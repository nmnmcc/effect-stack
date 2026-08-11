import { createServer } from "node:http";

import { NodeHttpServer, NodeRuntime, NodeServices } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";

import { Api } from "./services/api";
import { Config } from "./services/config";

const layer = Layer.mergeAll(NodeHttpServer.layerHttpServices, NodeServices.layer, Config.layer);

const program = Effect.gen(function* () {
  const config = yield* Config;
  const handler = yield* HttpRouter.toHttpEffect(Api);

  const server = yield* NodeHttpServer.make(createServer, {
    host: config.server.host,
    port: config.server.port,
  });

  yield* server.serve(handler);
  return yield* Effect.never;
}).pipe(Effect.provide(layer), Effect.scoped);

NodeRuntime.runMain(program);
