import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi";

import { Auth } from "../auth";
import { Config } from "../config";
import { Database, DatabasePool } from "../database";
import { HealthHandlers } from "./implementations/health";
import { AuthMiddlewareLive } from "./implementations/middlewares/auth";
import { TodosHandlers } from "./implementations/todos";
import { Api as Interfaces } from "./interfaces";
import { AuthRoutes } from "./routes/auth";

export const Api = HttpApiBuilder.layer(Interfaces, {
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
    HttpApiScalar.layer(Interfaces, { path: "/api/docs" }),
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
