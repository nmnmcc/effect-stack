import { createAuthClient } from "better-auth/react";

import { apiOrigin } from "./runtime-config";

export const authClient = createAuthClient({
  baseURL: apiOrigin,
  basePath: "/api/auth",
});
