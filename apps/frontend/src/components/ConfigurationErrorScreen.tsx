import { ScreenHost } from "@/components/ScreenHost";
import { useTranslation, type TranslationKey } from "@/lib/localization";
import type { RuntimeConfigError } from "@/lib/runtime-config";
import { useAppColors } from "@/lib/theme";
import { Column, Text } from "@expo/ui";
import { Match } from "effect";

const messageKey = Match.type<RuntimeConfigError["reason"]>().pipe(
  Match.when("missing", (): TranslationKey => "app.configurationMissing"),
  Match.when("invalid", (): TranslationKey => "app.configurationInvalid"),
  Match.exhaustive,
);

export function ConfigurationErrorScreen({ error }: { readonly error: RuntimeConfigError }) {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <ScreenHost>
      <Column alignment="center" spacing={16} style={{ padding: 32 }}>
        <Text textStyle={{ color: colors.text, fontSize: 26, fontWeight: "700", textAlign: "center" }}>
          {t("app.configurationError")}
        </Text>
        <Text textStyle={{ color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: "center" }}>
          {t(messageKey(error.reason))}
        </Text>
      </Column>
    </ScreenHost>
  );
}
