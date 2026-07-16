# ARCHITECTURE

## Current tree (Phase 0)

```
app/
  layout.tsx / page.tsx / globals.css
  (auth)/login|register
  (app)/layout.tsx         # AuthenticatedShell → AppShell
  (app)/dashboard          # content only (empty shell page)
  api/auth/[...nextauth]
  api/auth/register
components/
  features/auth/           # login + register forms only
  layout/                  # AppShell, AuthenticatedShell
  providers.tsx
  ui/                      # shared primitives
lib/                       # auth, authz, db, validations, api-client, api-helpers, utils
stores/useUiStore.ts
prisma/                    # Auth models only (User, Account, Session, …)
docs/                      # SSOT
```

## Planned later (not in tree yet)

- `app/(app)/w/[slug]/...` — Phase 1+
- `components/features/{workspace,kanban,calendar,…}` — by phase
- `hooks/` — when feature queries need shared hooks
- `e2e/`, `__tests__/` — Phase 5

## Feature-based architecture

- **Route groups** own pages; **features** own UI under `components/features/*`.
- Shared contracts: `lib/validations/*` + `prisma/schema.prisma`.
- Feature specs: `docs/features/*.md` (stubs until implemented).

## Data flow (Phase 0)

```
Browser → Auth forms / Auth.js
       → Prisma → SQLite (local default)
```

Later phases add: TanStack Query mutations, membership checks, Postgres (optional/prod).

## Component hierarchy (Phase 0)

```
RootLayout → Providers
  └─ (auth) pages
  └─ (app)/layout → AuthenticatedShell → AppShell → page
```

`(app)/layout` owns the shell. Pages under `(app)` render content only.

## Server Components vs Client Components

| Use RSC when | Use Client when |
|--------------|-----------------|
| Protected layouts, simple server reads | Forms (RHF), browser APIs, local UI state |

Default to Server; `"use client"` only at interaction boundaries.

## State management

| Layer | Tool | Scope (Phase 0) |
|-------|------|-----------------|
| Server truth | Prisma / Auth.js | User session |
| Server cache (client) | TanStack Query | Wired; unused until Phase 1+ |
| UI ephemeral | Zustand | Sidebar open |
| Forms | RHF + Zod | Login / register |

**Do not** store server entities as source of truth in Zustand.

## API flow (Phase 0)

1. `POST /api/auth/register` or Auth.js credentials
2. Validate with Zod (`registerSchema` / `loginSchema`) where applicable
3. Session via Auth.js JWT
4. Middleware protects `(app)` page routes; Route Handlers must call `requireUser` (and membership from Phase 1)

Membership / workspace steps deferred to Phase 1.

## Authentication flow

1. Register/login via Auth.js (Credentials + optional Google)
2. Credentials + login form share `loginSchema` in `lib/validations`
3. Session cookie; middleware protects `(app)`
4. Unauthorized → redirect login or 401

## Error handling

- Zod failures → 400
- Unauthenticated → 401 / redirect
- Unexpected → log + 500

## File naming conventions

- Components: `PascalCase.tsx` or feature files `kebab-case.tsx` (`login-form.tsx`)
- Hooks (later): `useThing.ts`
- Stores: `useUiStore.ts`
- Validations: schemas in `lib/validations/`
- Routes: `page.tsx`, `layout.tsx`, `route.ts`

## TODO

- [ ] Document Query key factory when Phase 1 hooks land
- [ ] Sequence diagrams when Kanban ships
