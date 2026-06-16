import { eq } from "drizzle-orm";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Database } from "../../database";
import { todos } from "../../database/schema/todo";
import { CurrentUser } from "../interfaces/middlewares/auth";
import { TodoForbidden, TodoNotFound } from "../interfaces/todos";
import { Api } from "../interfaces";

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
          return rows;
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => Effect.fail(new HttpApiError.InternalServerError()))),
      )
      .handle("getById", ({ params }) =>
        Effect.gen(function* () {
          const row = yield* database.query.todos.findFirst({
            where: { id: params.id },
          });
          if (row === undefined) return yield* new TodoNotFound();
          return row;
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => Effect.fail(new HttpApiError.InternalServerError()))),
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
          return row!;
        }).pipe(Effect.catchTag("EffectDrizzleQueryError", () => Effect.fail(new HttpApiError.InternalServerError()))),
      )
      .handle("update", ({ params, payload }) =>
        Effect.gen(function* () {
          const user = yield* CurrentUser;
          const existing = yield* database.query.todos.findFirst({
            where: { id: params.id },
          });
          if (existing === undefined) return yield* new TodoNotFound();
          if (existing.userId !== user.id) return yield* new TodoForbidden();

          const updates: Record<string, unknown> = {};
          if (payload.title !== undefined) updates["title"] = payload.title;
          if (payload.isCompleted !== undefined) updates["isCompleted"] = payload.isCompleted;

          const [row] = yield* database.update(todos).set(updates).where(eq(todos.id, params.id)).returning();
          return row!;
        }).pipe(
          Effect.catchTag("EffectDrizzleQueryError", () => Effect.fail(new HttpApiError.InternalServerError())),
        ),
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
        }).pipe(
          Effect.catchTag("EffectDrizzleQueryError", () => Effect.fail(new HttpApiError.InternalServerError())),
        ),
      );
  }),
);
