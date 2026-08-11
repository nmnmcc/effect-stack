import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

import * as schema from "../database/schema/all";

export interface AuthConfig {
  readonly baseURL: string;
  readonly trustedOrigins: Array<string>;
}

export const make = (pool: Pool, config: AuthConfig) =>
  betterAuth({
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins,
    plugins: [expo()],
    database: drizzleAdapter(drizzle({ client: pool }), {
      provider: "pg",
      camelCase: false,
      usePlural: true,
      transaction: true,
      schema,
    }),
    advanced: {
      database: {
        generateId: "uuid",
      },
    },
    user: {
      additionalFields: {
        displayName: { type: "string", required: false },
      },
    },
    emailAndPassword: {
      enabled: true,
    },
  });
