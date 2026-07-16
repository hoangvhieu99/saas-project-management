# ARCHITECTURE

## Folder structure

See `PROJECT.md` → Folder conventions. App routes:

```
app/
  (auth)/login|register
  (app)/dashboard
  (app)/w/[slug]/...     # workspace-scoped
  api/auth/[...nextauth]
```

## Feature-based architecture

- **Route groups** own pages; **features** own UI + hooks under `components/features/*` and `hooks/*`.
- Shared contracts live in `lib/validations/*` (Zod) and `prisma/schema.prisma`.
- Feature docs: `docs/features/*.md` — keep in sync when shipping.

## Data flow

```
Browser UI → TanStack Query / forms
         → Server Actions or Route Handlers
         → Auth.js session + membership check
         → Prisma → Postgres
```

Initial page data: **RSC + Prisma**. After hydration, client mutations invalidate Query keys.

## Component hierarchy

```
RootLayout
  └─ (app) Shell (sidebar, topbar, providers)
       └─ Page (RSC)
            └─ Feature client islands (KanbanBoard, TaskDetail, …)
                 └─ ui/* (Shadcn)
```

## Server Components vs Client Components

| Use RSC when | Use Client when |
|--------------|-----------------|
| Read-only lists, layouts, SEO-safe pages | DnD, forms with RHF, modals, optimistic UI |
| Auth-gated server fetches | Browser APIs, local ephemeral state |

Default to Server; add `"use client"` only at interaction boundaries.

## State management

| Layer | Tool | Scope |
|-------|------|-------|
| Server truth | Prisma / DB | Tasks, members, workspaces |
| Server cache (client) | TanStack Query | After mutations / polls |
| UI ephemeral | Zustand | Sidebar, drag overlay, filters |
| Forms | RHF + Zod | Input + shared validation |

**Do not** store server entities as source of truth in Zustand.

## API flow

1. Client calls Server Action or `axios` → `/api/...`
2. Validate with Zod
3. `auth()` → require session
4. Resolve workspace membership
5. Prisma mutate/query
6. Return DTO; client invalidates Query keys

## Authentication flow

1. Register/login via Auth.js (Credentials + optional Google)
2. Session cookie; middleware protects `(app)` routes
3. Server Actions call `auth()`; unauthorized → redirect or 401
4. Workspace routes also require Membership row for slug

## Error handling

- Zod failures → 400 + field errors
- Unauthenticated → 401 / redirect login
- Not a member → 403
- Not found → 404
- Unexpected → log + generic 500; UI shows toast / error boundary

## File naming conventions

- Components: `PascalCase.tsx` (`KanbanBoard.tsx`)
- Hooks: `useThing.ts`
- Stores: `useUiStore.ts`
- Validations: `thing.ts` exporting `thingSchema`
- Routes: Next.js file conventions (`page.tsx`, `layout.tsx`, `route.ts`)

## TODO

- [ ] Document Query key factory once hooks exist
- [ ] Add sequence diagram for task move (DnD)
