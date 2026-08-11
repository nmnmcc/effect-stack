import { HeaderActions } from "@/components/HeaderActions";
import { TodoScreen } from "@/components/TodoScreen";
import { useTranslation } from "@/lib/localization";
import { Stack } from "expo-router";

export default function HomeRoute() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HeaderActions />, title: t("app.title") }} />
      <TodoScreen />
    </>
  );
}
