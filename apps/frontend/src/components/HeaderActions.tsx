import { signOutAtom } from "@/lib/auth-actions";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "@/lib/localization";
import { useAppColors } from "@/lib/theme";
import { useAtomSet } from "@effect/atom-react";
import { Button, Host, Row, Text } from "@expo/ui";
import { Exit } from "effect";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export function HeaderActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const runSignOut = useAtomSet(signOutAtom, { mode: "promiseExit" });
  const { t } = useTranslation();
  const colors = useAppColors();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignOutError, setHasSignOutError] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setHasSignOutError(false);
    const exit = await runSignOut();
    setIsSigningOut(false);

    if (Exit.isFailure(exit)) {
      setHasSignOutError(true);
    }
  }, [runSignOut]);

  if (isPending) return null;

  return (
    <Host matchContents>
      {session ? (
        <Row alignment="center" spacing={8}>
          <Text numberOfLines={1} textStyle={{ color: colors.muted, fontSize: 13 }}>
            {session.user.name}
          </Text>
          <Button
            disabled={isSigningOut}
            label={hasSignOutError ? t("auth.retrySignOut") : t("auth.signOut")}
            onPress={handleSignOut}
            variant="text"
          />
        </Row>
      ) : (
        <Row alignment="center" spacing={4}>
          <Button label={t("auth.signIn")} onPress={() => router.push("/sign-in")} variant="text" />
          <Button label={t("auth.signUp")} onPress={() => router.push("/sign-up")} variant="outlined" />
        </Row>
      )}
    </Host>
  );
}
