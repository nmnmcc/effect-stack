import { HttpApi, OpenApi } from "effect/unstable/httpapi";

import { HealthGroup } from "./groups/health";
import { TodosGroup } from "./groups/todos";

export class Api extends HttpApi.make("api")
  .add(HealthGroup)
  .add(TodosGroup)
  .prefix("/api")
  .annotateMerge(
    OpenApi.annotations({
      title: "effect-stack API",
      version: "0.1.0",
    }),
  ) {}
