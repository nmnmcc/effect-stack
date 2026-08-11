import { Cause, Data, Effect, Match, Option, type Exit } from "effect";
import { Atom } from "effect/unstable/reactivity";

import { authClient } from "./auth-client";
import type { TranslationKey } from "./localization";

export interface SignInInput {
  readonly email: string;
  readonly password: string;
}

export interface SignUpInput extends SignInInput {
  readonly name: string;
}

export class AuthNetworkError extends Data.TaggedError("AuthNetworkError")<{
  readonly cause: unknown;
}> {}

export class AuthRejectedError extends Data.TaggedError("AuthRejectedError")<{
  readonly code: string | undefined;
}> {}

export type AuthActionError = AuthNetworkError | AuthRejectedError;

const rejectAuthError = (error: { readonly code?: string | undefined }) =>
  new AuthRejectedError({ code: error.code ?? undefined });

export const signInAtom = Atom.fn<SignInInput>()((input) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => authClient.signIn.email(input),
      catch: (cause) => new AuthNetworkError({ cause }),
    });
    if (response.error !== null) return yield* rejectAuthError(response.error);
    return response.data;
  }),
);

export const signUpAtom = Atom.fn<SignUpInput>()((input) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => authClient.signUp.email(input),
      catch: (cause) => new AuthNetworkError({ cause }),
    });
    if (response.error !== null) return yield* rejectAuthError(response.error);
    return response.data;
  }),
);

export const signOutAtom = Atom.fn(() =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => authClient.signOut(),
      catch: (cause) => new AuthNetworkError({ cause }),
    });
    if (response.error !== null) return yield* rejectAuthError(response.error);
    return response.data;
  }),
);

const authErrorTranslationKey = Match.type<AuthActionError>().pipe(
  Match.tagsExhaustive({
    AuthNetworkError: (): TranslationKey => "auth.requestFailed",
    AuthRejectedError: (): TranslationKey => "auth.rejected",
  }),
);

export const getAuthErrorTranslationKey = (exit: Exit.Exit<unknown, AuthActionError>): TranslationKey => {
  if (exit._tag === "Success") return "auth.rejected";

  return Option.match(Cause.findErrorOption(exit.cause), {
    onNone: (): TranslationKey => "auth.requestFailed",
    onSome: authErrorTranslationKey,
  });
};
