import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import { apiOrigin } from "./runtime-config";

export const authClient = createAuthClient({
  baseURL: apiOrigin,
  basePath: "/api/auth",
  plugins: [
    expoClient({
      scheme: "effect-stack",
      storage: SecureStore,
      storagePrefix: "effect-stack",
    }),
  ],
});
