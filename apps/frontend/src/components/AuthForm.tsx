import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useTranslation, type TranslationKey } from "@/lib/localization";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export type AuthMode = "sign-in" | "sign-up";

interface AuthFormValues {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

const validate = ({ email, name, password }: AuthFormValues, mode: AuthMode): TranslationKey | undefined => {
  if (mode === "sign-up" && name.trim().length === 0) return "auth.nameRequired";
  if (!email.includes("@")) return "auth.emailInvalid";
  if (password.length < 8) return "auth.passwordTooShort";
  return undefined;
};

export function AuthForm({ mode }: { readonly mode: AuthMode }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<TranslationKey | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistration = mode === "sign-up";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = { email: email.trim(), name: name.trim(), password };
    const validationError = validate(values, mode);
    if (validationError !== undefined) {
      setErrorKey(validationError);
      return;
    }

    setErrorKey(undefined);
    setIsSubmitting(true);

    try {
      const response = isRegistration
        ? await authClient.signUp.email(values)
        : await authClient.signIn.email({ email: values.email, password: values.password });

      if (response.error !== null) {
        setErrorKey("auth.rejected");
        return;
      }

      navigate("/", { replace: true });
    } catch {
      setErrorKey("auth.requestFailed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md shadow-xl shadow-black/5">
      <CardHeader className="gap-2">
        <p className="text-primary text-xs font-semibold tracking-widest uppercase">{t("app.title")}</p>
        <CardTitle>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isRegistration ? t("auth.createAccount") : t("auth.signIn")}
          </h1>
        </CardTitle>
        <CardDescription>{isRegistration ? t("auth.signUpHelp") : t("auth.signInHelp")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {isRegistration ? (
            <div className="grid gap-2">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input
                autoComplete="name"
                disabled={isSubmitting}
                id="name"
                onChange={(event) => setName(event.currentTarget.value)}
                value={name}
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              autoCapitalize="none"
              autoComplete="email"
              disabled={isSubmitting}
              id="email"
              inputMode="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              autoComplete={isRegistration ? "new-password" : "current-password"}
              disabled={isSubmitting}
              id="password"
              minLength={8}
              onChange={(event) => setPassword(event.currentTarget.value)}
              type="password"
              value={password}
            />
          </div>
          {errorKey === undefined ? null : (
            <Alert variant="destructive">
              <AlertDescription>{t(errorKey)}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isRegistration ? t("auth.createAccount") : t("auth.signIn")}
          </Button>
        </form>
        <p className="text-muted-foreground text-center text-sm">
          {isRegistration ? t("auth.hasAccount") : t("auth.noAccount")}{" "}
          <Link
            className="text-foreground font-medium underline underline-offset-4"
            to={isRegistration ? "/sign-in" : "/sign-up"}
          >
            {isRegistration ? t("auth.signIn") : t("auth.signUp")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
