# PROJECT

## Project overview

**PulseBoard** — portfolio SaaS project management inspired by Jira / Trello / ClickUp.

## Business goal

Ship a credible portfolio demo: auth, multi-tenant workspace, Kanban, clean architecture, tests, Vercel deploy.

## Target users

- Small teams / freelancers
- Hiring managers reviewing the demo
- The builder (Senior FE learning path)

## Core features (roadmap)

- Authentication (Credentials + optional Google OAuth) — **Phase 0 done**
- Dashboard, Workspace, Kanban, Calendar
- Comments, Team, Notifications, File upload, Profile, Settings

## MVP scope

- [x] Auth.js session (register / login / logout) + empty protected shell
- [ ] Workspace list + create + `w/[slug]` + OWNER/MEMBER
- [ ] One board per project; task CRUD + DnD
- [ ] Calendar month view → shared TaskDetail
- [ ] Comments + team invite + in-app notification bell
- [ ] Task attachments
- [ ] Profile + workspace settings
- [ ] Playwright + Jest + CI + Vercel

## Non-MVP scope

- Full Jira-style RBAC / custom workflows
- WebSocket / realtime
- Google Calendar sync, email digests, push
- Billing / native apps / advanced reporting

## Folder conventions

| Path | Purpose | Status |
|------|---------|--------|
| `app/` | App Router | Present |
| `components/ui/` | Shared primitives | Present |
| `components/features/` | Feature UI | `auth/` only |
| `components/layout/` | App shell | Present |
| `lib/` | Domain modules (`auth/`, `workspace/`) + `shared/` infra | Present (ADR-010) |
| `stores/` | Zustand UI state | Present |
| `prisma/` | Schema + migrations | Auth + Workspace models |
| `docs/` | SSOT | Present |
| `hooks/` | Feature hooks | Deferred |
| `e2e/` | Playwright | Deferred (Phase 5) |
| `__tests__/` | Jest | Deferred (Phase 5) |

## Coding philosophy

1. Contract first — Zod + Prisma before UI polish.
2. Server for truth — RSC/Prisma reads; Route Handlers / Actions for writes.
3. Client for interaction — TanStack Query after mount; Zustand UI-only.
4. Authz on every workspace-scoped query (from Phase 1).
5. One session = one goal; update `SESSION.md`.
6. Portfolio honesty — depth over fake breadth.

## TODO

- [x] Brand name: PulseBoard
- [ ] Screenshot gallery after Phase 3
