# ARCHITECTURE

## Current tree (Session 11 — Kanban board UI read-only)

```
app/
  layout.tsx / page.tsx / globals.css
  (auth)/login|register
  (app)/layout.tsx         # AuthenticatedShell → AppShell
    (app)/dashboard
    (app)/profile
    (app)/w/[slug]/
      projects/[projectSlug]/   # board page
  actions/
    workspace/
    profile/
    project/               # list, get-by-slug (+ assignee), create project/task
  api/auth/[...nextauth]
  api/auth/register
components/
  features/
    auth/ | dashboard/ | profile/ | workspace/ | kanban/
  layout/ | ui/
lib/
  auth/ | workspace/ | project/ | shared/
stores/useUiStore.ts
prisma/
  schema.prisma            # + Project, BoardColumn, Task, TaskPriority
  migrations/.../kanban_foundation/
docs/
```

## Planned later (not in tree yet)

- Workspace settings UI (rename / delete)
- Kanban DnD (`@dnd-kit`, `moveTask`)
- Create project / create task UI forms
- `hooks/` — when feature queries need shared hooks
- `e2e/`, `__tests__/` — Phase 5

## Lightweight Domain-Oriented Modules

- **Domain** (`lib/<domain>/`): validators, authz, và logic nghiệp vụ của domain đó (không `"use server"`).
- **Execution**: Server Actions tại `app/actions/<domain>/` (queries / mutations) — gọi domain + Prisma.
- **Shared** (`lib/shared/`): chỉ infrastructure (DB client, HTTP helpers, `cn` / `slugify`).
- **UI**: `components/features/<feature>/` — không nhét business vào UI primitives.
- **Không** dùng Repository / Service layer / Clean Architecture / DDD Aggregates (ADR-010).

Feature specs: `docs/features/*.md`. Schema: `prisma/schema.prisma`.

## Documentation roles

| Doc | Role |
|-----|------|
| `docs/SESSION.md` | Snapshot session vừa đóng + log |
| `docs/NEXT_SESSION.md` | Handoff — **một** session kế tiếp (overwrite) |
| `docs/ROADMAP.md` | Phase dài hạn (không thay NEXT) |
| `docs/features/` | Contract feature |
| `docs/explanations/` | Lịch sử build (append) |
| `docs/decisions/` | ADR |
| `docs/learning/` | Mentorship |
| `docs/reviews/` | Review sau session |

Workflow: đọc SESSION → NEXT_SESSION → Design Review → approve → implement → docs → overwrite NEXT → STOP.

## Data flow

```
Browser → Auth forms / Auth.js
       → Workspace UI (create / switcher)
       → Server Actions (`app/actions/workspace/...`)
            → requireUser + lib/workspace authz/validators
            → Prisma (`lib/shared/db`) → SQLite (local default)
       → `/w/[slug]` layout gate → getWorkspaceBySlug → notFound if non-member
```

Active workspace = URL `slug` (không Zustand). Sau mutation: `revalidatePath` + client `router.refresh`.

## Component hierarchy

```
RootLayout → Providers
  └─ (auth) pages
  └─ (app)/layout → AuthenticatedShell → AppShell (switcher) → page
       └─ w/[slug]/layout (membership gate) → page
```

## Server Components vs Client Components

| Use RSC when | Use Client when |
|--------------|-----------------|
| Protected layouts, list workspaces, slug gate | Forms (RHF), dialog, switcher highlight via `useParams` |

Default to Server; `"use client"` only at interaction boundaries.

## State management

| Layer | Tool | Scope |
|-------|------|-------|
| Server truth | Prisma / Auth.js | User session, memberships |
| Server cache (client) | TanStack Query | Wired; unused until heavier client lists |
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

- Zod failures → throw message (Server Action) hoặc 400 (Route Handler)
- Unauthenticated → `UNAUTHORIZED` → 401 / redirect
- Forbidden → `FORBIDDEN` → 403
- Not found (workspace / non-member) → `NOT_FOUND` → 404 / `notFound()`
- Unique conflict (slug) → `CONFLICT` → toast + slug suggestion in create form
- Unexpected → log + 500

## File naming conventions

- Components: `PascalCase.tsx` hoặc `kebab-case.tsx`
- Domain modules: `validators.ts`, `authz.ts`
- Shared: descriptive infra names (`db.ts`, `utils.ts`)
- Routes: `page.tsx`, `layout.tsx`, `route.ts`

## TODO

- [ ] Document Query key factory when Phase 1 hooks land
- [ ] Sequence diagrams when Kanban ships
