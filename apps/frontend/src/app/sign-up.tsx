import { AuthForm, type AuthFormValues } from "@/components/AuthForm";
import { getAuthErrorTranslationKey, signUpAtom } from "@/lib/auth-actions";
import { useAtomSet } from "@effect/atom-react";
import { Exit } from "effect";
import { useCallback } from "react";

export default function SignUpRoute() {
  const signUp = useAtomSet(signUpAtom, { mode: "promiseExit" });
  const handleSubmit = useCallback(
    async ({ email, name, password }: AuthFormValues) => {
      const exit = await signUp({ email, name, password });
      return Exit.isSuccess(exit) ? undefined : getAuthErrorTranslationKey(exit);
    },
    [signUp],
  );

  return <AuthForm isRegistration onSubmit={handleSubmit} />;
}
