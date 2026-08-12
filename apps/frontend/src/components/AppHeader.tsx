import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "@/lib/localization";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isPending } = authClient.useSession();
  const { t } = useTranslation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignOutError, setHasSignOutError] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setHasSignOutError(false);

    try {
      const response = await authClient.signOut();
      if (response.error !== null) {
        setHasSignOutError(true);
        return;
      }

      await queryClient.invalidateQueries();
      navigate("/", { replace: true });
    } catch {
      setHasSignOutError(true);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-background/85 sticky top-0 z-10 border-b backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <Link className="inline-flex items-center gap-2.5 font-semibold tracking-tight" to="/">
          <span
            aria-hidden="true"
            className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg"
          >
            e
          </span>
          <span>{t("app.title")}</span>
        </Link>
        <nav aria-label={t("auth.account")} className="flex items-center gap-1">
          {session ? (
            <>
              <span className="text-muted-foreground hidden max-w-48 truncate text-sm sm:inline">
                {session.user.name}
              </span>
              <Button disabled={isSigningOut} onClick={handleSignOut} type="button" variant="ghost">
                {hasSignOutError ? t("auth.retrySignOut") : t("auth.signOut")}
              </Button>
            </>
          ) : isPending ? (
            <Skeleton aria-hidden="true" className="h-8 w-36" />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/sign-in">{t("auth.signIn")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/sign-up">{t("auth.signUp")}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
