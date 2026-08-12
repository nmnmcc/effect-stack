import { AuthForm } from "@/components/AuthForm";
import { translate } from "@/lib/localization";

import type { Route } from "./+types/sign-in";

export const meta: Route.MetaFunction = () => [{ title: `${translate("en", "auth.signIn")} · effect-stack` }];

export default function SignIn() {
  return <AuthForm mode="sign-in" />;
}
