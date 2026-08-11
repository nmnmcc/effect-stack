# effect-stack

An opinionated full-stack TypeScript template built on Effect, Next.js, Drizzle ORM, and better-auth. Extracted from OpenWorks to provide a reusable foundation for building robust, type-safe web applications with algebraic effect management.

## Tech Stack

- **Effect v4** -- Algebraic effect system for structured concurrency, dependency injection, and error handling
- **Next.js 16** -- React framework with App Router, server components, and server actions
- **React 19** -- UI library with concurrent features and server component support
- **Drizzle ORM** -- Type-safe SQL query builder and schema management
- **PostgreSQL** -- Primary database
- **better-auth** -- Authentication library with session management
- **Ark UI + shadcn** -- Accessible component primitives with shadcn styling
- **Tailwind CSS 4** -- Utility-first CSS framework
- **Nomad** -- Orchestration for local development and production deployment
- **Docker** -- Container runtime for services (Postgres, etc.)

## Project Structure

```
effect-stack/
├── apps/
│   ├── backend/          # Effect API server, handlers, auth, and database
│   └── frontend/         # Next.js/vinext web application
├── packages/
│   └── api/              # Shared HttpApi contracts and generated OpenAPI document
│       ├── src/
│       │   ├── groups/       # Endpoint groups and request/response schemas
│       │   ├── middlewares/  # Middleware contracts shared with handlers
│       │   ├── api.ts        # Complete Effect HttpApi definition
│       │   └── openapi.ts    # OpenAPI document derived from the HttpApi
│       └── test/              # Public contract and OpenAPI checks
├── package.json          # Yarn workspace root for apps/* and packages/*
├── tsconfig.base.json    # Shared TypeScript configuration
├── tsconfig.json         # Project references
├── Taskfile.yml          # Root task runner
├── devenv.nix            # Nix development environment
└── devenv.yaml           # devenv inputs
```

## Getting Started

### Prerequisites

- **Node.js 24** -- JavaScript runtime
- **Yarn 4** -- Package manager (configured via Corepack or devenv)
- **Docker** -- Required for PostgreSQL and other services
- **devenv** -- Nix-based development environment (recommended)
- **Nomad** -- Service orchestrator for local development (provided by devenv)

### Quick Start

1. **Clone the repository:**

   ```sh
   git clone <repo-url> effect-stack
   cd effect-stack
   ```

2. **Enter the development environment** (if using devenv):

   ```sh
   devenv shell
   ```

3. **Install dependencies:**

   ```sh
   yarn install
   ```

4. **Start the development environment:**

   ```sh
   task dev
   ```

   This starts Nomad in dev mode, creates the Docker network, launches PostgreSQL, runs database migrations, and starts both the backend and frontend with hot reload.

5. **Other useful commands:**

   ```sh
   task dev:status    # Show status of all services
   task dev:logs -- backend   # Follow logs for a specific service
   task dev:stop      # Stop all services
   task dev:reset     # Destroy data and restart fresh
   task typecheck     # Type check all workspaces
   task test          # Test shared packages
   task lint          # Lint both apps
   task format        # Format code with Prettier
   task build         # Build both apps
   ```

## Architecture

### Effect Services Pattern

The backend follows the Effect services pattern for dependency injection and structured error handling:

- **Interface** -- Defined as an `Effect.Tag` (Context tag) that declares the service contract. This is the public API consumers depend on.
- **Implementation** -- Provided as an `Effect.Layer` that satisfies the interface. Implementations can depend on other services through their layer requirements.
- **Composition** -- Layers are composed at the entry point (`Main.ts`) to wire the full dependency graph. Effect resolves and manages the lifecycle of all services.

This pattern gives you compile-time checked dependency injection, testability through layer substitution, and explicit error channels in every operation's type signature.

### Shared API Contract

`@effect-stack/api` is the environment-independent source of truth for endpoint names, paths, schemas, typed failures, and middleware requirements. The backend uses it to type its `HttpApiBuilder` handlers, while the frontend uses the same runtime `HttpApi` value to construct its typed client.

The package also exports an OpenAPI 3.1 document generated directly from that contract:

```ts
import { Api } from "@effect-stack/api";
import { openApiDocument } from "@effect-stack/api/openapi";
```

When the backend is running, it serves the same contract at `/api/openapi.json` and its Scalar UI at `/api/docs`.

Keep server layers, database access, environment configuration, and authentication-provider adapters in `apps/backend`; putting them in the contract package would make browser and tooling consumers depend on server implementation details.

### Backend Structure

- `src/services/config/` -- Application configuration loaded through Effect Config.
- `src/services/database/` -- Drizzle schemas, migrations, and the managed database layer.
- `src/services/auth/` -- better-auth integration exposed as an Effect service.
- `src/services/api/groups/` -- Handler layers corresponding 1:1 with the groups exported by `@effect-stack/api`.

### Frontend Structure

- `atoms/` -- Jotai atoms for client-side state management. Keeps reactive state separate from UI components.
- `lib/` -- Shared utilities including the API client (typed to match backend contracts), auth helpers, and common functions.
- `components/` -- Reusable UI components built on Ark UI primitives with shadcn styling conventions and Tailwind CSS 4.

## Deployment

### Local Development

Local development uses Nomad in `-dev` mode to orchestrate all services. The `task dev` command handles the full lifecycle: starting the Nomad agent, creating Docker networks and volumes, running database containers, applying migrations, and starting application servers.

### Production

Production deployments use Nomad job specifications in the `deploy/` directory. The setup supports Docker-based deployment with configurable resource limits, health checks, and rolling updates.

## License

[MIT](LICENSE)
