import { ScreenHost } from "@/components/ScreenHost";
import { useTranslation, type TranslationKey } from "@/lib/localization";
import { useAppColors } from "@/lib/theme";
import { Button, Column, Text, TextInput, useNativeState } from "@expo/ui";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

export interface AuthFormValues {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

export interface AuthFormProps {
  readonly isRegistration: boolean;
  readonly onSubmit: (values: AuthFormValues) => Promise<TranslationKey | undefined>;
}

const validate = ({ email, name, password }: AuthFormValues, isRegistration: boolean): TranslationKey | undefined => {
  if (isRegistration && name.trim().length === 0) return "auth.nameRequired";
  if (!email.includes("@")) return "auth.emailInvalid";
  if (password.length < 8) return "auth.passwordTooShort";
  return undefined;
};

export function AuthForm({ isRegistration, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useAppColors();
  const nameState = useNativeState("");
  const emailState = useNativeState("");
  const passwordState = useNativeState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<TranslationKey | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const values = { email: email.trim(), name: name.trim(), password };
    const validationError = validate(values, isRegistration);
    if (validationError !== undefined) {
      setErrorKey(validationError);
      return;
    }

    setErrorKey(undefined);
    setIsSubmitting(true);
    const submitError = await onSubmit(values);
    setIsSubmitting(false);

    if (submitError !== undefined) {
      setErrorKey(submitError);
      return;
    }

    router.replace("/");
  }, [email, isRegistration, name, onSubmit, password, router]);

  return (
    <ScreenHost>
      <Column spacing={16} style={{ padding: 24 }}>
        <Text textStyle={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>
          {isRegistration ? t("auth.createAccount") : t("auth.signIn")}
        </Text>
        <Text textStyle={{ color: colors.muted, fontSize: 15, lineHeight: 22 }}>
          {isRegistration ? t("auth.signUpHelp") : t("auth.signInHelp")}
        </Text>
        {isRegistration ? (
          <TextInput
            autoComplete="name"
            autoCapitalize="words"
            editable={!isSubmitting}
            onChangeText={setName}
            placeholder={t("auth.name")}
            returnKeyType="next"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: 12,
              borderWidth: 1,
              padding: 14,
              width: "100%",
            }}
            value={nameState}
          />
        ) : null}
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          editable={!isSubmitting}
          inputMode="email"
          onChangeText={setEmail}
          placeholder={t("auth.email")}
          returnKeyType="next"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 12,
            borderWidth: 1,
            padding: 14,
            width: "100%",
          }}
          value={emailState}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete={isRegistration ? "new-password" : "current-password"}
          autoCorrect={false}
          editable={!isSubmitting}
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
          placeholder={t("auth.password")}
          returnKeyType="done"
          secureTextEntry
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 12,
            borderWidth: 1,
            padding: 14,
            width: "100%",
          }}
          value={passwordState}
        />
        {errorKey === undefined ? null : (
          <Text textStyle={{ color: colors.danger, fontSize: 14, lineHeight: 20 }}>{t(errorKey)}</Text>
        )}
        <Button
          disabled={isSubmitting}
          label={isRegistration ? t("auth.createAccount") : t("auth.signIn")}
          onPress={handleSubmit}
        />
      </Column>
    </ScreenHost>
  );
}
