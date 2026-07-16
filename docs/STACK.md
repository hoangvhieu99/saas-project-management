# STACK

Each choice is portfolio- and mentor-friendly: one full-stack Next.js codebase, strong typing, and deployable to Vercel.

## Languages

| Tech | Why |
|------|-----|
| **TypeScript** | Safer refactors, shared Zod/Prisma types, interview-ready code |

## Framework

| Tech | Why |
|------|-----|
| **Next.js 15 (App Router)** | RSC + Route Handlers + deploy target; industry default for SaaS FE |
| **React 19** | Matches Next 15; modern client/server component model |

## Libraries

| Tech | Why |
|------|-----|
| **TanStack Query** | Server-state cache, mutations, invalidation for Kanban |
| **Zustand** | Tiny UI store; avoids Redux boilerplate |
| **Axios** | Consistent client HTTP + interceptors |
| **React Hook Form** | Performant forms |
| **Zod** | Single validation source for client + server |
| **Auth.js v5** | Session auth in Next without custom crypto |
| **@dnd-kit** | Accessible Kanban DnD (add when building board) |
| **date-fns** | Light date helpers for Calendar |

## UI

| Tech | Why |
|------|-----|
| **Tailwind CSS** | Fast iteration, consistent design tokens |
| **Shadcn UI** | Accessible primitives you own (copy-in), not a black-box kit |

## Database

| Tech | Why |
|------|-----|
| **PostgreSQL** | Relational fit for membership, tasks, positions; free tiers (Neon/Supabase) |
| **SQLite (local)** | Zero-deps local default when Docker unavailable — see ADR-006 |

## ORM

| Tech | Why |
|------|-----|
| **Prisma** | Schema-first, migrations, great DX for portfolio pace |

## Deployment

| Tech | Why |
|------|-----|
| **Vercel** | Native Next.js hosting |
| **Docker Compose** | Local Postgres parity |
| **GitHub Actions** | Lint/typecheck/test on PR |

## Testing

| Tech | Why |
|------|-----|
| **Playwright** | Critical user journeys (login → board → DnD) |
| **Jest** | Pure units: Zod, reorder helpers |

## Lint / Formatting

| Tech | Why |
|------|-----|
| **ESLint** (Next config) | Catch React/Next footguns |
| **Prettier** (optional later) | Consistent formatting — TODO if not bundled |

## Package manager

| Tech | Why |
|------|-----|
| **npm** | Default with `create-next-app`; simplest for solo portfolio |

## TODO

- [ ] Lock versions in package.json after scaffold
- [ ] Decide Uploadthing vs Vercel Blob for attachments
