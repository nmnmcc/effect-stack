import {
  AuthMiddleware,
  CurrentSession,
  CurrentUser,
  CurrentUserOption,
  OptionalAuthMiddleware,
  Unauthorized,
} from "@effect-stack/api";
import { Effect, Layer, Option } from "effect";
import { HttpServerRequest } from "effect/unstable/http";

import { Auth } from "../../auth";

const makeOptionalAuth = Effect.gen(function* () {
  const auth = yield* Auth;

  return Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const headers = new globalThis.Headers(request.headers);

    const result = yield* auth.api.getSession({ headers }).pipe(
      Effect.catchTag("API", () => Effect.succeed(null)),
      Effect.catchTag("Unknown", () => Effect.succeed(null)),
    );

    return Option.fromNullishOr(result);
  });
});

export const OptionalAuthMiddlewareLive = Layer.effect(
  OptionalAuthMiddleware,
  Effect.gen(function* () {
    const optionalAuth = yield* makeOptionalAuth;

    return (next) =>
      Effect.gen(function* () {
        const result = yield* optionalAuth;

        return yield* next.pipe(Effect.provideService(CurrentUserOption, result.pipe(Option.map(({ user }) => user))));
      });
  }),
);

export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const optionalAuth = yield* makeOptionalAuth;

    return (next) =>
      Effect.gen(function* () {
        const result = yield* optionalAuth.pipe(
          Effect.flatMap((result) => Effect.fromOption(result, () => new Unauthorized())),
        );

        return yield* next.pipe(
          Effect.provideService(CurrentSession, result.session),
          Effect.provideService(CurrentUser, result.user),
        );
      });
  }),
);
