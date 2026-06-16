import { Schema } from "effect";
import { HttpApiEndpoint, HttpApiError, HttpApiGroup, HttpApiSchema } from "effect/unstable/httpapi";

import { AuthMiddleware } from "./middlewares/auth";

export class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.String,
  title: Schema.String,
  isCompleted: Schema.Boolean,
  userId: Schema.String,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
}) {}

export class TodoNotFound extends Schema.TaggedErrorClass<TodoNotFound>()("TodoNotFound", {}, { httpApiStatus: 404 }) {}

export class TodoForbidden extends Schema.TaggedErrorClass<TodoForbidden>()(
  "TodoForbidden",
  {},
  { httpApiStatus: 403 },
) {}

export class TodosGroup extends HttpApiGroup.make("todos")
  .add(
    HttpApiEndpoint.get("list", "/", {
      query: {
        limit: Schema.optional(Schema.NumberFromString),
        offset: Schema.optional(Schema.NumberFromString),
      },
      success: Schema.Array(Todo),
      error: HttpApiError.InternalServerError,
    }),
  )
  .add(
    HttpApiEndpoint.get("getById", "/:id", {
      params: { id: Schema.String },
      success: Todo,
      error: [TodoNotFound, HttpApiError.InternalServerError],
    }),
  )
  .add(
    HttpApiEndpoint.post("create", "/", {
      payload: Schema.Struct({
        title: Schema.String,
      }),
      success: Todo,
      error: HttpApiError.InternalServerError,
    }).middleware(AuthMiddleware),
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id", {
      params: { id: Schema.String },
      payload: Schema.Struct({
        title: Schema.optional(Schema.String),
        isCompleted: Schema.optional(Schema.Boolean),
      }),
      success: Todo,
      error: [TodoNotFound, TodoForbidden, HttpApiError.InternalServerError],
    }).middleware(AuthMiddleware),
  )
  .add(
    HttpApiEndpoint.delete("delete", "/:id", {
      params: { id: Schema.String },
      success: HttpApiSchema.NoContent,
      error: [TodoNotFound, TodoForbidden, HttpApiError.InternalServerError],
    }).middleware(AuthMiddleware),
  )
  .prefix("/todos") {}
