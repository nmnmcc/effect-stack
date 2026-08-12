import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

import { relations } from "../database/relations";
import * as schema from "../database/schema";

export interface AuthConfig {
  readonly baseURL: string;
  readonly trustedOrigins: Array<string>;
}

export const make = (pool: Pool, config: AuthConfig) =>
  betterAuth({
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins,
    database: drizzleAdapter(drizzle({ client: pool, relations }), {
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
