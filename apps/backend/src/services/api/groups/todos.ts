import { Api, CurrentUser, Todo, TodoForbidden, TodoNotFound } from "@effect-stack/api";
import { eq } from "drizzle-orm";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Database } from "../../database";
import { todos } from "../../database/schema/todo";

export const TodosHandlers = HttpApiBuilder.group(
  Api,
  "todos",
  Effect.fn(function* (handlers) {
    const database = yield* Database;

    return handlers
      .handle("list", ({ query }) =>
        Effect.gen(function* () {
          const rows = yield* database.query.todos.findMany({
            limit: query.limit ?? 25,
            offset: query.offset ?? 0,
            orderBy: (table, { desc }) => [desc(table.createdAt)],
          });
          return rows.map((row) => new Todo(row));
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => new HttpApiError.InternalServerError())),
      )
      .handle("getById", ({ params }) =>
        Effect.gen(function* () {
          const row = yield* database.query.todos.findFirst({
            where: { id: params.id },
          });
          if (row === undefined) return yield* new TodoNotFound();
          return new Todo(row);
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => new HttpApiError.InternalServerError())),
      )
      .handle("create", ({ payload }) =>
        Effect.gen(function* () {
          const user = yield* CurrentUser;
          const [row] = yield* database
            .insert(todos)
            .values({
              title: payload.title,
              userId: user.id,
            })
            .returning();
          if (row === undefined) return yield* new HttpApiError.InternalServerError();
          return new Todo(row);
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => new HttpApiError.InternalServerError())),
      )
      .handle("update", ({ params, payload }) =>
        Effect.gen(function* () {
          const user = yield* CurrentUser;
          const existing = yield* database.query.todos.findFirst({
            where: { id: params.id },
          });
          if (existing === undefined) return yield* new TodoNotFound();
          if (existing.userId !== user.id) return yield* new TodoForbidden();

          const [row] = yield* database
            .update(todos)
            .set({
              title: payload.title ?? undefined,
              isCompleted: payload.isCompleted ?? undefined,
            })
            .where(eq(todos.id, params.id))
            .returning();
          if (row === undefined) return yield* new HttpApiError.InternalServerError();
          return new Todo(row);
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => new HttpApiError.InternalServerError())),
      )
      .handle("delete", ({ params }) =>
        Effect.gen(function* () {
          const user = yield* CurrentUser;
          const existing = yield* database.query.todos.findFirst({
            where: { id: params.id },
          });
          if (existing === undefined) return yield* new TodoNotFound();
          if (existing.userId !== user.id) return yield* new TodoForbidden();

          yield* database.delete(todos).where(eq(todos.id, params.id));
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => new HttpApiError.InternalServerError())),
      );
  }),
);
