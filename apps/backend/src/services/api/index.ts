import { Api as ApiDefinition } from "@effect-stack/api";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi";

import { Auth } from "../auth";
import { Config } from "../config";
import { Database, DatabasePool } from "../database";
import { HealthHandlers } from "./groups/health";
import { TodosHandlers } from "./groups/todos";
import { AuthMiddlewareLive } from "./middlewares/auth";
import { AuthRoutes } from "./routes/auth";

export const Api = HttpApiBuilder.layer(ApiDefinition, {
  openapiPath: "/api/openapi.json",
}).pipe(
  Layer.provide([
    TodosHandlers.pipe(
      Layer.provide(AuthMiddlewareLive),
      Layer.provide(Auth.layer),
      Layer.provide(Database.layer),
      Layer.provide(DatabasePool.layer),
    ),
    AuthRoutes.pipe(Layer.provide(Auth.layer), Layer.provide(DatabasePool.layer)),
    HealthHandlers,
    HttpApiScalar.layer(ApiDefinition, { path: "/api/docs" }),
    Layer.unwrap(
      Effect.gen(function* () {
        const config = yield* Config;
        return HttpRouter.cors({
          allowedOrigins: config.server.corsOrigins,
          credentials: true,
        });
      }),
    ),
  ]),
);
