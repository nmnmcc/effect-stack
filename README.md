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
├── packages/
│   ├── backend/          # Effect-based API server
│   │   ├── src/
│   │   │   ├── Config/       # Typed configuration (Effect Config)
│   │   │   ├── Database/     # Drizzle schema, migrations, database layer
│   │   │   ├── Auth/         # better-auth integration as Effect service
│   │   │   ├── Api/          # API modules with interfaces/implementations
│   │   │   │   ├── Users/
│   │   │   │   │   ├── Api.ts           # Interface (Effect Context tag)
│   │   │   │   │   ├── ApiLive.ts       # Implementation (Effect Layer)
│   │   │   │   │   └── index.ts
│   │   │   │   └── ...
│   │   │   └── Main.ts       # Entry point, layer composition
│   │   ├── drizzle/          # Generated migrations
│   │   ├── Taskfile.yml
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── frontend/         # Next.js application
│       ├── src/
│       │   ├── app/          # Next.js App Router pages and layouts
│       │   ├── atoms/        # Jotai atoms for client state
│       │   ├── lib/          # Shared utilities, API client, auth helpers
│       │   └── components/   # UI components (Ark UI + shadcn)
│       ├── Taskfile.yml
│       ├── tsconfig.json
│       └── package.json
├── deploy/               # Nomad job specs and deployment config
├── package.json          # Yarn workspaces root
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
   task typecheck     # Type check all packages
   task lint          # Lint all packages
   task format        # Format code with Prettier
   task build         # Build all packages
   ```

## Architecture

### Effect Services Pattern

The backend follows the Effect services pattern for dependency injection and structured error handling:

- **Interface** -- Defined as an `Effect.Tag` (Context tag) that declares the service contract. This is the public API consumers depend on.
- **Implementation** -- Provided as an `Effect.Layer` that satisfies the interface. Implementations can depend on other services through their layer requirements.
- **Composition** -- Layers are composed at the entry point (`Main.ts`) to wire the full dependency graph. Effect resolves and manages the lifecycle of all services.

This pattern gives you compile-time checked dependency injection, testability through layer substitution, and explicit error channels in every operation's type signature.

### Backend Structure

- `Config/` -- Application configuration loaded via Effect's Config module with typed schemas and environment variable mapping.
- `Database/` -- Drizzle ORM schema definitions, migration runner, and a database service layer that manages the connection pool.
- `Auth/` -- Authentication service wrapping better-auth, exposed as an Effect service with session management and middleware.
- `Api/` -- Feature modules each following the interface/implementation split. Each module exports its tag, layer, and any request/response schemas.

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
