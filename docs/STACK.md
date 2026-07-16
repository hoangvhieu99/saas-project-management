# STACK

Each choice is portfolio-friendly: one Next.js codebase, strong typing, Vercel-ready.

## Languages

| Tech | Why |
|------|-----|
| **TypeScript** | Safer refactors, shared Zod/Prisma types |

## Framework

| Tech | Why |
|------|-----|
| **Next.js 15 (App Router)** | RSC + Route Handlers; SaaS default |
| **React 19** | Matches Next 15 |

## Libraries (in use — Phase 0)

| Tech | Why |
|------|-----|
| **TanStack Query** | Ready for server-state cache (Phase 1+) |
| **Zustand** | Tiny UI store |
| **Axios** | Client HTTP wrapper |
| **React Hook Form** | Auth forms |
| **Zod** | Shared validation |
| **Auth.js v5** | Session auth |

## Libraries (deferred)

| Tech | Phase | Why later |
|------|-------|-----------|
| **@dnd-kit** | 2 | Kanban DnD |
| **date-fns** | 3 | Calendar helpers |

## UI

| Tech | Why |
|------|-----|
| **Tailwind CSS** | Design tokens, fast iteration |
| **Shadcn-style primitives** | Owned components under `components/ui/` (not full shadcn CLI inventory) |

## Database

| Tech | Why |
|------|-----|
| **SQLite (local default)** | Zero-deps — ADR-006 |
| **PostgreSQL (optional/prod)** | Via Docker Compose / managed free tier when switching provider |

## ORM

| Tech | Why |
|------|-----|
| **Prisma** | Schema-first migrations |

## Deployment / ops

| Tech | Why |
|------|-----|
| **Vercel** | Target host (Phase 5) |
| **Docker Compose** | Optional local Postgres |
| **GitHub Actions** | Lint + typecheck on PR (Phase 0) |

## Testing (deferred — Phase 5)

| Tech | Why |
|------|-----|
| **Playwright** | Critical journeys |
| **Jest** | Pure unit helpers |

## Lint

| Tech | Why |
|------|-----|
| **ESLint** (Next config) | React/Next footguns |

## Package manager

| Tech | Why |
|------|-----|
| **npm** | Default with create-next-app |

## TODO

- [x] Lock stack to Phase 0 reality after freeze
- [ ] Attachments storage choice in Phase 4
