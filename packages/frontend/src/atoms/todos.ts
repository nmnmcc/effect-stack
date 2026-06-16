import { Keys } from "./keys";
import { ApiClient } from "./runtime";

export const PAGE_SIZE = 25;

export const todosPageQuery = (args: { readonly offset: number }) =>
  ApiClient.query("todos", "list", {
    query: { limit: PAGE_SIZE, offset: args.offset },
    reactivityKeys: [Keys.todos],
  });

export const todoQuery = (id: string) =>
  ApiClient.query("todos", "getById", {
    params: { id },
    reactivityKeys: [Keys.todo(id)],
  });

export const createTodoAtom = ApiClient.mutation("todos", "create");
export const updateTodoAtom = ApiClient.mutation("todos", "update");
export const deleteTodoAtom = ApiClient.mutation("todos", "delete");
