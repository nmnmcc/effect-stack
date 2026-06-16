import { Schema } from "effect";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/unstable/httpapi";

import { AuthMiddleware } from "./middlewares/auth";

export class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.UUID,
  title: Schema.String,
  isCompleted: Schema.Boolean,
  userId: Schema.UUID,
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
      success: Schema.Array(Todo),
    }).setQuery(
      Schema.Struct({
        limit: Schema.optionalWith(Schema.NumberFromString, { default: () => 25 }),
        offset: Schema.optionalWith(Schema.NumberFromString, { default: () => 0 }),
      }),
    ),
  )
  .add(
    HttpApiEndpoint.get("getById", "/:id", {
      success: Todo,
      errors: [TodoNotFound],
    }).setParams(Schema.Struct({ id: Schema.UUID })),
  )
  .add(
    HttpApiEndpoint.post("create", "/", {
      success: Todo,
    })
      .setPayload(
        Schema.Struct({
          title: Schema.String,
        }),
      )
      .middleware(AuthMiddleware),
  )
  .add(
    HttpApiEndpoint.patch("update", "/:id", {
      success: Todo,
      errors: [TodoNotFound, TodoForbidden],
    })
      .setParams(Schema.Struct({ id: Schema.UUID }))
      .setPayload(
        Schema.Struct({
          title: Schema.optionalWith(Schema.String, { as: "Option" }),
          isCompleted: Schema.optionalWith(Schema.Boolean, { as: "Option" }),
        }),
      )
      .middleware(AuthMiddleware),
  )
  .add(
    HttpApiEndpoint.del("delete", "/:id", {
      success: HttpApiSchema.NoContent,
      errors: [TodoNotFound, TodoForbidden],
    })
      .setParams(Schema.Struct({ id: Schema.UUID }))
      .middleware(AuthMiddleware),
  )
  .prefix("/todos") {}
