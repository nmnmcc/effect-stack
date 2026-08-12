import { AuthForm } from "@/components/AuthForm";
import { translate } from "@/lib/localization";

import type { Route } from "./+types/sign-up";

export const meta: Route.MetaFunction = () => [{ title: `${translate("en", "auth.signUp")} · effect-stack` }];

export default function SignUp() {
  return <AuthForm mode="sign-up" />;
}
