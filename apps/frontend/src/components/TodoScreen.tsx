import { Keys } from "@/atoms/keys";
import { createTodoAtom, deleteTodoAtom, todosPageQuery, updateTodoAtom } from "@/atoms/todos";
import { ScreenHost } from "@/components/ScreenHost";
import { TodoItems, type TodoItem } from "@/components/TodoItems";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "@/lib/localization";
import { useAppColors } from "@/lib/theme";
import { useAtomRefresh, useAtomSet, useAtomValue } from "@effect/atom-react";
import { Button, Column, Text, TextInput, type TextInputRef } from "@expo/ui";
import { Exit } from "effect";
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult";
import { useCallback, useRef, useState } from "react";

export function TodoScreen() {
  const { data: session } = authClient.useSession();
  const todosAtom = todosPageQuery(0);
  const result = useAtomValue(todosAtom);
  const refreshTodos = useAtomRefresh(todosAtom);
  const createTodo = useAtomSet(createTodoAtom, { mode: "promiseExit" });
  const updateTodo = useAtomSet(updateTodoAtom, { mode: "promiseExit" });
  const deleteTodo = useAtomSet(deleteTodoAtom, { mode: "promiseExit" });
  const titleInputRef = useRef<TextInputRef>(null);
  const { t } = useTranslation();
  const colors = useAppColors();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [pendingTodoIds, setPendingTodoIds] = useState<ReadonlySet<string>>(() => new Set());
  const [actionError, setActionError] = useState<"create" | "mutation" | undefined>();

  const handleCreate = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0 || isCreating) return;

    setActionError(undefined);
    setIsCreating(true);
    const exit = await createTodo({
      payload: { title: trimmedTitle },
      reactivityKeys: [Keys.todos],
    });
    setIsCreating(false);

    if (Exit.isFailure(exit)) {
      setActionError("create");
      return;
    }

    setTitle("");
    titleInputRef.current?.clear();
  }, [createTodo, isCreating, title]);

  const runTodoMutation = useCallback(async (id: string, mutation: () => Promise<Exit.Exit<unknown, unknown>>) => {
    setActionError(undefined);
    setPendingTodoIds((current) => new Set([...current, id]));
    const exit = await mutation();
    setPendingTodoIds((current) => new Set([...current].filter((currentId) => currentId !== id)));
    if (Exit.isFailure(exit)) setActionError("mutation");
  }, []);

  const handleToggle = useCallback(
    (todo: TodoItem) =>
      runTodoMutation(todo.id, () =>
        updateTodo({
          params: { id: todo.id },
          payload: { isCompleted: !todo.isCompleted },
          reactivityKeys: [Keys.todos, Keys.todo(todo.id)],
        }),
      ),
    [runTodoMutation, updateTodo],
  );

  const handleDelete = useCallback(
    (id: string) =>
      runTodoMutation(id, () =>
        deleteTodo({
          params: { id },
          reactivityKeys: [Keys.todos, Keys.todo(id)],
        }),
      ),
    [deleteTodo, runTodoMutation],
  );

  return (
    <ScreenHost>
      <Column spacing={16} style={{ padding: 20 }}>
        <Text textStyle={{ color: colors.text, fontSize: 30, fontWeight: "700" }}>{t("todo.title")}</Text>

        {session ? (
          <Column spacing={10}>
            <TextInput
              editable={!isCreating}
              maxLength={200}
              onChangeText={setTitle}
              onSubmitEditing={handleCreate}
              placeholder={t("todo.newPlaceholder")}
              ref={titleInputRef}
              returnKeyType="done"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: 12,
                borderWidth: 1,
                padding: 14,
                width: "100%",
              }}
            />
            <Button disabled={isCreating || title.trim().length === 0} label={t("todo.add")} onPress={handleCreate} />
          </Column>
        ) : (
          <Text textStyle={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>{t("todo.manageHint")}</Text>
        )}

        {actionError === undefined ? null : (
          <Text textStyle={{ color: colors.danger, fontSize: 14, lineHeight: 20 }}>
            {t(actionError === "create" ? "todo.createFailed" : "todo.mutationFailed")}
          </Text>
        )}

        {AsyncResult.isInitial(result) ? (
          <Text textStyle={{ color: colors.muted, fontSize: 15 }}>{t("app.loading")}</Text>
        ) : null}

        {AsyncResult.isFailure(result) ? (
          <Column spacing={10}>
            <Text textStyle={{ color: colors.danger, fontSize: 15 }}>{t("todo.loadFailed")}</Text>
            <Button label={t("app.retry")} onPress={refreshTodos} variant="outlined" />
          </Column>
        ) : null}

        {AsyncResult.isSuccess(result) ? (
          <Column spacing={8}>
            {result.waiting ? (
              <Text textStyle={{ color: colors.muted, fontSize: 13 }}>{t("todo.refreshing")}</Text>
            ) : null}
            <TodoItems
              onDelete={handleDelete}
              onToggle={handleToggle}
              pendingTodoIds={pendingTodoIds}
              sessionUserId={session?.user.id}
              todos={result.value}
            />
          </Column>
        ) : null}
      </Column>
    </ScreenHost>
  );
}
