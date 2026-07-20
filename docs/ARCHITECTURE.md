# ARCHITECTURE

## Current tree (Session 03 — Domain-Oriented `lib/`)

```
app/
  layout.tsx / page.tsx / globals.css
  (auth)/login|register
  (app)/layout.tsx         # AuthenticatedShell → AppShell
  (app)/dashboard
  api/auth/[...nextauth]
  api/auth/register
components/
  features/auth/           # feature UI
  layout/
  providers.tsx
  ui/                      # shared primitives
lib/
  auth/                    # Auth domain
    auth.ts                # NextAuth config
    authz.ts               # requireUser
    validators.ts          # login / register Zod
  workspace/               # Workspace domain
    authz.ts
    validators.ts
    index.ts               # barrel (re-exports)
  shared/                  # infrastructure only
    db.ts
    api-client.ts
    api-helpers.ts
    utils.ts               # cn, slugify
stores/useUiStore.ts
prisma/
docs/
```

## Planned later (not in tree yet)

- `app/(app)/w/[slug]/...` — Phase 1+
- `components/features/{workspace,kanban,calendar,…}` — by phase
- `lib/project/`, `lib/task/`, … — same domain module pattern
- `hooks/` — when feature queries need shared hooks
- `e2e/`, `__tests__/` — Phase 5

## Lightweight Domain-Oriented Modules

- **Domain** (`lib/<domain>/`): validators, authz, và logic nghiệp vụ của domain đó.
- **Shared** (`lib/shared/`): chỉ infrastructure (DB client, HTTP helpers, `cn` / `slugify`).
- **UI**: `components/features/<feature>/` — không nhét business vào UI primitives.
- **Không** dùng Repository / Service layer / Clean Architecture / DDD Aggregates (ADR-010).

Feature specs: `docs/features/*.md`. Schema: `prisma/schema.prisma`.

## Data flow

```
Browser → Auth forms / Auth.js
       → Prisma (`lib/shared/db`) → SQLite (local default)
```

Later: TanStack Query mutations; mọi path workspace-scoped gọi `lib/workspace/authz`.

## Component hierarchy

```
RootLayout → Providers
  └─ (auth) pages
  └─ (app)/layout → AuthenticatedShell → AppShell → page
```

## Server Components vs Client Components

| Use RSC when | Use Client when |
|--------------|-----------------|
| Protected layouts, simple server reads | Forms (RHF), browser APIs, local UI state |

Default to Server; `"use client"` only at interaction boundaries.

## State management

| Layer | Tool | Scope |
|-------|------|-------|
| Server truth | Prisma / Auth.js | User session |
| Server cache (client) | TanStack Query | Wired; unused until Phase 1+ |
| UI ephemeral | Zustand | Sidebar open |
| Forms | RHF + Zod | Domain validators |

**Do not** store server entities as source of truth in Zustand.

## API flow

1. `POST /api/auth/register` hoặc Auth.js credentials
2. Validate với `@/lib/auth/validators`
3. Session Auth.js JWT
4. Middleware + `requireUser` (`@/lib/auth/authz`); workspace paths dùng `@/lib/workspace` authz

## Authentication flow

1. Register/login via Auth.js
2. Shared schemas: `lib/auth/validators.ts`
3. Session cookie; middleware protects `(app)`
4. Unauthorized → redirect login hoặc 401

## Error handling

- Zod failures → 400
- Unauthenticated → 401 / redirect
- Forbidden / Not found (workspace) → session API sau sẽ map từ helper throw
- Unexpected → log + 500

## File naming conventions

- Components: `PascalCase.tsx` hoặc `kebab-case.tsx`
- Domain modules: `validators.ts`, `authz.ts`
- Shared: descriptive infra names (`db.ts`, `utils.ts`)
- Routes: `page.tsx`, `layout.tsx`, `route.ts`

## TODO

- [ ] Document Query key factory when Phase 1 hooks land
- [ ] Sequence diagrams when Kanban ships
