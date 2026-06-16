"use client";

import { createTodoAtom, deleteTodoAtom, todosPageQuery, updateTodoAtom } from "@/atoms/todos";
import { authClient } from "@/lib/auth-client";
import { useAtomSet, useAtomValue } from "@effect/atom-react";
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult";
import { CheckIcon, Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";

export function TodosContent() {
  const { data: session } = authClient.useSession();
  const result = useAtomValue(todosPageQuery({ offset: 0 }));
  const setCreateTodo = useAtomSet(createTodoAtom);
  const setUpdateTodo = useAtomSet(updateTodoAtom);
  const setDeleteTodo = useAtomSet(deleteTodoAtom);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (newTitle.trim().length === 0) return;
      setCreateTodo({ payload: { title: newTitle.trim() } });
      setNewTitle("");
    },
    [newTitle, setCreateTodo],
  );

  const handleToggle = useCallback(
    (id: string, isCompleted: boolean) => {
      setUpdateTodo({ params: { id }, payload: { isCompleted: !isCompleted } });
    },
    [setUpdateTodo],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeleteTodo({ params: { id } });
    },
    [setDeleteTodo],
  );

  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Todos</h1>

      {session && (
        <form className="mb-6 flex gap-2" onSubmit={handleCreate}>
          <input
            className="border-input bg-background ring-ring/20 flex-1 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            type="text"
            value={newTitle}
          />
          <button
            className="bg-primary text-primary-foreground inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium"
            type="submit"
          >
            <PlusIcon className="size-4" />
            Add
          </button>
        </form>
      )}

      {AsyncResult.isInitial(result) && (
        <div className="flex justify-center py-8">
          <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}

      {AsyncResult.isSuccess(result) && (
        <ul className="divide-border divide-y rounded-md border">
          {result.value.length === 0 && (
            <li className="text-muted-foreground px-4 py-8 text-center text-sm">No todos yet.</li>
          )}
          {result.value.map((todo) => (
            <li className="flex items-center gap-3 px-4 py-3" key={todo.id}>
              <button
                className={`flex size-5 shrink-0 items-center justify-center rounded border ${todo.isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                onClick={() => handleToggle(todo.id, todo.isCompleted)}
                type="button"
              >
                {todo.isCompleted && <CheckIcon className="size-3" />}
              </button>
              <span className={`min-w-0 flex-1 truncate text-sm ${todo.isCompleted ? "text-muted-foreground line-through" : ""}`}>
                {todo.title}
              </span>
              {session && (
                <button
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleDelete(todo.id)}
                  type="button"
                >
                  <TrashIcon className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!session && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Sign in to create and manage todos.
        </p>
      )}
    </div>
  );
}
