# effect-stack

An opinionated full-stack TypeScript template built with Effect, Expo, Drizzle ORM, PostgreSQL, and Better Auth. One Expo Router application targets iOS, Android, and a statically exported web SPA; there is no frontend SSR or React server runtime.

## Tech stack

- **Effect v4** — typed effects, services, failures, and structured concurrency
- **Expo 57 + Expo Router** — client-side routing across iOS, Android, and web
- **Expo UI + React Native** — native and cross-platform interface components
- **React 19** — client UI runtime
- **Drizzle ORM + PostgreSQL** — typed persistence
- **Better Auth + `@better-auth/expo`** — cookie-backed web sessions and secure native session storage
- **Docker** — backend runtime and an Nginx image for the static web export
- **Docker Compose** — local PostgreSQL, Redis, and S3-compatible storage

## Project structure

```text
effect-stack/
├── apps/
│   ├── backend/              # Effect API, handlers, auth, and database
│   └── frontend/
│       ├── src/app/          # Expo Router routes
│       ├── src/atoms/        # Effect Atom API state
│       ├── src/components/   # Expo UI / React Native screens
│       └── src/lib/          # API, auth, locale, theme, and runtime config
├── packages/api/             # Shared HttpApi contracts and OpenAPI document
├── compose.yaml              # Shared dependency services and development ports
├── compose.production.yaml   # Production application services and safe overrides
├── Dockerfile.backend
├── Dockerfile.frontend       # Static Expo web export served by Nginx
└── Taskfile.yml
```

## Requirements

- Node.js 24
- Yarn 4 through Corepack
- Docker Engine or Docker Desktop
- Xcode for the iOS simulator, or Android Studio for the Android emulator
- Docker when building container images

## Local development

Install dependencies:

```sh
corepack enable
yarn install
```

Start Docker, then provision PostgreSQL, Redis, and RustFS with Docker Compose and launch both applications with hot reload:

```sh
task dev
```

`task dev` starts the Compose services, creates the configured S3 bucket, runs database migrations, and then starts the backend and Expo in parallel. `Ctrl+C` stops the local application processes; dependency containers remain available for the next run.

Useful infrastructure commands:

```sh
task infra:config
task dev:status
task dev:logs -- postgres
task dev:stop       # stop containers and keep their volumes
task dev:destroy    # delete the stack and all development data
```

To run the applications in separate terminals, use `task infra:up` first. Then run `task backend:database:migrate`, `task backend:dev`, and `task frontend:dev`. The backend commands use the same local defaults shown in `.env.example`.

For a physical phone, copy the frontend environment example before starting Expo:

```sh
cp apps/frontend/.env.example apps/frontend/.env.local
```

`EXPO_PUBLIC_API_URL` must be the backend origin without `/api`, for example `http://192.168.1.10:30000`. Use an address reachable from a physical phone; `localhost` on a phone points back to that phone. The web development build can fall back to its current browser origin, but setting the variable explicitly is recommended when the API runs on port `30000`.

From the Expo terminal, press `i`, `a`, or `w` to open iOS, Android, or web. The equivalent workspace commands are:

```sh
yarn workspace @effect-stack/frontend ios
yarn workspace @effect-stack/frontend android
yarn workspace @effect-stack/frontend web
```

The backend accepts local web origins through `CORS_ORIGINS`. Better Auth native deep links are controlled by `BETTER_AUTH_TRUSTED_ORIGINS`; its default includes the `effect-stack://` application scheme and Expo development schemes. Override both as comma-separated origin lists for deployed environments.

## Architecture

### Shared API contract

`@effect-stack/api` is the environment-independent source of truth for endpoint paths, schemas, typed failures, and middleware requirements. The backend implements each API group, while the Expo client builds typed `AtomHttpApi` queries from the same `Api` value.

The package also exports the OpenAPI 3.1 document generated from that contract:

```ts
import { Api } from "@effect-stack/api";
import { openApiDocument } from "@effect-stack/api/openapi";
```

When running, the backend serves `/api/openapi.json` and the Scalar UI at `/api/docs`.

### Frontend runtime boundaries

The frontend is client-only on every platform:

- Expo Router routes live under `apps/frontend/src/app/`.
- Stable Effect Atom families own todo queries and mutations.
- Native auth stores session data through Expo Secure Store and attaches its cookie to API requests.
- Web auth uses browser cookies. The development client talks to the configured API origin; the production Nginx image proxies same-origin `/api` traffic.
- User-visible text is localized in English and Simplified Chinese according to the device or browser locale.
- Missing or invalid native API configuration renders a localized configuration screen instead of attempting requests against an accidental host.

There are no loaders, server components, hydration paths, or frontend server modules.

### Backend

Backend configuration is loaded through the Effect `Config` service. Database, Better Auth, and API handlers are provided as layers and composed at the entry point. API handlers under `services/api/groups/` correspond one-to-one with contracts exported by `@effect-stack/api`.

Public clients can list todos. Authenticated users can add todos and can update or delete only their own records.

## Verification commands

```sh
task typecheck          # Type-check every workspace
task test               # API contract and Expo frontend tests
task lint               # Lint backend and frontend
task build              # Backend bundle plus Expo exports for all platforms
task frontend:build:web # Static web export only
task infra:config       # Render and validate the Compose configuration
```

## Local infrastructure

`compose.yaml` runs PostgreSQL, Redis, RustFS, and an idempotent one-shot container that creates the configured S3 bucket. A failed bucket initialization also fails `task infra:up`.

The defaults match `task dev`. To override addresses, ports, database names, or S3 settings, copy the example and edit the local file:

```sh
cp .env.example .env.local
task infra:config
task infra:up
```

Task loads `.env.local` for both Compose and application commands. Docker Compose can also be used directly with shell environment variables or `docker compose --env-file .env.local ...`. Keep local credentials out of version control.

## Production with Docker Compose

The production overlay builds and runs the migration image, backend, and static frontend alongside the dependency services. PostgreSQL, Redis, and RustFS remain private to the Compose network; only the frontend port is published. Production credentials and Better Auth origins are required rather than falling back to development values.

Create the production environment file and replace every placeholder:

```sh
cp .env.production.example .env.production
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml config
```

Start dependencies, initialize the bucket, run migrations, and then start the application:

```sh
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d --wait postgres redis rustfs
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml run --rm rustfs-setup
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml run --rm --build migrate
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d --build --wait backend frontend
```

Open the configured `BETTER_AUTH_URL`. To inspect or stop the production stack:

```sh
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml ps
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml logs -f backend frontend
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml down
```

`down` preserves named database and object-storage volumes. Add `--volumes` only when the stored production data is intentionally disposable.

## Container images

Build the static frontend image and backend targets:

```sh
docker build -f Dockerfile.frontend -t effect-stack/frontend .
docker build -f Dockerfile.backend -t effect-stack/backend .
docker build -f Dockerfile.backend --target migrate -t effect-stack/migrate .
```

Run it with a backend reachable from the container network:

```sh
docker run --rm -p 3000:3000 -e BACKEND_URL=http://backend:30000 effect-stack/frontend
```

Nginx serves the exported SPA and falls back to `index.html` for client routes. Only `/api/` is proxied to `BACKEND_URL`; the container does not run Node.js or perform SSR.

## License

[MIT](LICENSE)
