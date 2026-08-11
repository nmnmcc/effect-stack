import { Config as C, Context, Layer, Redacted } from "effect";

export class Config extends Context.Service<Config>()("@effect-stack/backend/services/config/Config", {
  make: C.all({
    server: C.all({
      port: C.port("PORT").pipe(C.withDefault(30000)),
      host: C.string("HOST").pipe(C.withDefault("0.0.0.0")),
      baseURL: C.string("BETTER_AUTH_URL").pipe(C.withDefault("http://localhost:30000")),
      corsOrigins: C.string("CORS_ORIGINS").pipe(
        C.withDefault("http://localhost:3000"),
        C.map((origins) => origins.split(",")),
      ),
    }),
    database: C.all({
      url: C.url("DATABASE_URL").pipe(C.map((u) => Redacted.make(u.toString()))),
    }),
    s3: C.option(
      C.all({
        endpoint: C.string("S3_ENDPOINT"),
        accessKeyId: C.redacted("S3_ACCESS_KEY_ID"),
        secretAccessKey: C.redacted("S3_SECRET_ACCESS_KEY"),
        bucket: C.string("S3_BUCKET").pipe(C.withDefault("effect-stack")),
        region: C.string("S3_REGION").pipe(C.withDefault("us-east-1")),
      }),
    ),
    pagination: C.all({
      defaultLimit: C.number("PAGINATION_DEFAULT_LIMIT").pipe(C.withDefault(25)),
      maxLimit: C.number("PAGINATION_MAX_LIMIT").pipe(C.withDefault(100)),
    }),
  }),
}) {}

export namespace Config {
  export const layer = Layer.effect(Config, Config.make);
}
