import { ConfigurationErrorScreen } from "@/components/ConfigurationErrorScreen";
import { useTranslation } from "@/lib/localization";
import { runtimeConfig } from "@/lib/runtime-config";
import { RegistryProvider } from "@effect/atom-react";
import { Result } from "effect";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { t } = useTranslation();

  if (Result.isFailure(runtimeConfig)) return <ConfigurationErrorScreen error={runtimeConfig.failure} />;

  return (
    <RegistryProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerBackTitle: t("app.back") }}>
          <Stack.Screen name="index" options={{ title: t("app.title") }} />
          <Stack.Screen name="sign-in" options={{ presentation: "modal", title: t("auth.signIn") }} />
          <Stack.Screen name="sign-up" options={{ presentation: "modal", title: t("auth.signUp") }} />
          <Stack.Screen name="+not-found" options={{ title: t("app.notFound") }} />
        </Stack>
      </SafeAreaProvider>
    </RegistryProvider>
  );
}
