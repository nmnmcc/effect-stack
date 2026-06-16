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

## Backend (`packages/backend/`)

- All constants go in the **Config service** (`services/config/index.ts`).
- **No `Effect.die` / `Effect.orDie`** — map unrecoverable errors to `HttpApiError.InternalServerError`.
- **Error mapping must use individual `Effect.catchTag`** calls — no batch `Effect.mapError`.
- **No `let`** — all bindings are `const`.
- API groups live in `interfaces/` (contract) and `implementations/` (handlers) with 1:1 correspondence.

## Frontend (`packages/frontend/`)

- `components/ui/` are **generated files** from `@shark` registry — do not edit manually.
- Prefer **server components**; only use `"use client"` when browser APIs or state are needed.
- Pages using `nuqs` must split into server `page.tsx` + client `content.tsx` with `SectionBoundary` wrapping.
- Pages using `useAtomSet`/`useAtomValue` must use `ClientOnly` to prevent SSR errors.
- URL search params use **nuqs** (`useQueryState`/`useQueryStates`).
