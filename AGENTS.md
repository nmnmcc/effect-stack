# AGENTS.md

> This file contains project instructions for AI coding assistants. `CLAUDE.md` is a symlink to it.

## Code Style

- **No `as` type assertions** unless the type system genuinely cannot express the constraint.
- **Prefer Drizzle Queries API** (`db.query.*`) over query builder (`db.select().from()...`).
- **No conditional spread for optional properties** — use `key: x ?? undefined` instead of `...(x ? { key: x } : {})`.
- **Yieldable errors need no `Effect.fail` wrapper** — `yield* new XxxError()` directly.
- **`database` is always spelled out**, never abbreviated to `db`.
- **`index.ts` may contain implementation code**, not just re-exports. Files within the same directory must not import from the directory's own `index.ts`.
- **No `switch/case`** — use Effect `Match` for all value-based branching.
- **Boolean variables** must use `is`/`has`/`should`/`can` prefixes or adjective/past-participle forms.
- **Prefer `export * from "..."`** in barrel files over listing individual exports.

## API (`packages/api/`)

- Keep the package environment-independent: only declarative `HttpApi` contracts, schemas, middleware tags, and OpenAPI generation belong here.
- Export the Effect `HttpApi` from the package root and generate the exported OpenAPI document from that same value.
- API group contracts live in `src/groups/`; backend handlers must have 1:1 correspondence.

## Backend (`apps/backend/`)

- All constants go in the **Config service** (`services/config/index.ts`).
- **No `Effect.die` / `Effect.orDie`** — map unrecoverable errors to `HttpApiError.InternalServerError`.
- **Error mapping must use individual `Effect.catchTag`** calls — no batch `Effect.mapError`.
- **No `let`** — all bindings are `const`.
- API group handlers live in `services/api/groups/`; contracts come from `@effect-stack/api`.

## Frontend (`apps/frontend/`)

- The frontend is an **Expo Router client application** for iOS, Android, and static web. It has no SSR, React Server Components, or server route modules.
- Register routes under `src/app/` using Expo Router file-based routing and React Native primitives or `@expo/ui` components.
- Keep API and authentication adapters platform-specific with `.native.ts` and `.web.ts` files when cookies or storage differ.
- Build `AtomHttpApi` queries with stable `Atom.family` values. Do not add server-value initialization to client-only atoms.
- All user-visible strings belong in `src/lib/localization.ts`; English and Simplified Chinese must remain complete and type-safe.
- Native builds read the backend origin from `EXPO_PUBLIC_API_URL`. Web development may use its current origin, while the production Nginx image proxies same-origin `/api` requests to `BACKEND_URL`.
