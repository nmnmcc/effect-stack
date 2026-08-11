import { ScreenHost } from "@/components/ScreenHost";
import { useTranslation } from "@/lib/localization";
import { useAppColors } from "@/lib/theme";
import { Button, Column, Text } from "@expo/ui";
import { useRouter } from "expo-router";

export default function NotFoundRoute() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <ScreenHost>
      <Column alignment="center" spacing={16} style={{ padding: 32 }}>
        <Text textStyle={{ color: colors.text, fontSize: 24, fontWeight: "700", textAlign: "center" }}>
          {t("app.notFound")}
        </Text>
        <Button label={t("app.goHome")} onPress={() => router.replace("/")} />
      </Column>
    </ScreenHost>
  );
}
