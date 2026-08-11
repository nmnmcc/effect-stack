import { AuthForm, type AuthFormValues } from "@/components/AuthForm";
import { getAuthErrorTranslationKey, signInAtom } from "@/lib/auth-actions";
import { useAtomSet } from "@effect/atom-react";
import { Exit } from "effect";
import { useCallback } from "react";

export default function SignInRoute() {
  const signIn = useAtomSet(signInAtom, { mode: "promiseExit" });
  const handleSubmit = useCallback(
    async ({ email, password }: AuthFormValues) => {
      const exit = await signIn({ email, password });
      return Exit.isSuccess(exit) ? undefined : getAuthErrorTranslationKey(exit);
    },
    [signIn],
  );

  return <AuthForm isRegistration={false} onSubmit={handleSubmit} />;
}
