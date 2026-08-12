import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { TodoEncoded, TodosListParams } from "@/generated/models";
import {
  getTodosListQueryKey,
  useTodosCreate,
  useTodosDelete,
  useTodosList,
  useTodosUpdate,
} from "@/generated/todos/todos";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "@/lib/localization";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { TodoItems } from "./TodoItems";

export const todoListParams = { limit: "25", offset: "0" } satisfies TodosListParams;

export function TodoScreen() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const todosQuery = useTodosList(todoListParams);
  const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: getTodosListQueryKey() });
  const createTodo = useTodosCreate({ mutation: { onSuccess: invalidateTodos } });
  const updateTodo = useTodosUpdate({ mutation: { onSuccess: invalidateTodos } });
  const deleteTodo = useTodosDelete({ mutation: { onSuccess: invalidateTodos } });

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0 || createTodo.isPending) return;

    createTodo.mutate(
      { data: { title: trimmedTitle } },
      {
        onSuccess: () => setTitle(""),
      },
    );
  };

  const handleToggle = (todo: TodoEncoded) => {
    updateTodo.mutate({ id: todo.id, data: { isCompleted: !todo.isCompleted } });
  };

  const handleDelete = (id: string) => {
    deleteTodo.mutate({ id });
  };

  const isTodoPending = (id: string) =>
    (updateTodo.isPending && updateTodo.variables.id === id) ||
    (deleteTodo.isPending && deleteTodo.variables.id === id);

  const hasMutationError = updateTodo.isError || deleteTodo.isError;

  return (
    <Card className="shadow-xl shadow-black/5">
      <CardHeader className="flex-row items-end justify-between gap-4">
        <div>
          <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">{t("app.title")}</p>
          <CardTitle>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("todo.title")}</h1>
          </CardTitle>
        </div>
        {todosQuery.isFetching && !todosQuery.isPending ? (
          <Badge variant="secondary">{t("todo.refreshing")}</Badge>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {session ? (
          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleCreate}>
            <Label className="sr-only" htmlFor="new-todo">
              {t("todo.newPlaceholder")}
            </Label>
            <Input
              className="h-9"
              disabled={createTodo.isPending}
              id="new-todo"
              maxLength={200}
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder={t("todo.newPlaceholder")}
              value={title}
            />
            <Button
              className="sm:shrink-0"
              disabled={createTodo.isPending || title.trim().length === 0}
              size="lg"
              type="submit"
            >
              {t("todo.add")}
            </Button>
          </form>
        ) : (
          <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2.5 text-sm">{t("todo.manageHint")}</p>
        )}

        {createTodo.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{t("todo.createFailed")}</AlertDescription>
          </Alert>
        ) : null}
        {hasMutationError ? (
          <Alert variant="destructive">
            <AlertDescription>{t("todo.mutationFailed")}</AlertDescription>
          </Alert>
        ) : null}

        {todosQuery.isPending ? (
          <div aria-label={t("app.loading")} className="grid gap-3 border-t pt-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
          </div>
        ) : null}
        {todosQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>{t("todo.loadFailed")}</span>
              <Button onClick={() => todosQuery.refetch()} size="sm" type="button" variant="outline">
                {t("app.retry")}
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        {todosQuery.data === undefined ? null : (
          <TodoItems
            isTodoPending={isTodoPending}
            onDelete={handleDelete}
            onToggle={handleToggle}
            sessionUserId={session?.user.id}
            todos={todosQuery.data}
          />
        )}
      </CardContent>
    </Card>
  );
}
