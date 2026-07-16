# PROJECT

## Project overview

SaaS Project Management — portfolio full-stack app inspired by Jira / Trello / ClickUp. Teams manage work in workspaces with Kanban boards, calendar views, comments, and light collaboration.

## Business goal

Ship a credible **portfolio demo** that proves end-to-end product skills: auth, multi-tenant workspace, interactive Kanban, clean architecture, tests, and Vercel deploy — enough for interview storytelling.

## Target users

- Small teams / freelancers tracking tasks across projects
- Hiring managers / interviewers evaluating the demo
- The builder (learning path: Senior FE patterns in a real Next.js app)

## Core features

- Authentication (Credentials + optional Google OAuth)
- Dashboard (summary widgets)
- Workspace (CRUD, slug, membership)
- Kanban (columns, tasks, drag-and-drop)
- Calendar (tasks by `dueDate`)
- Comments, Team, Notifications (in-app), File upload, Profile, Settings

## MVP scope

- [ ] Auth.js session (register / login / logout)
- [ ] Workspace list + create + `w/[slug]` routing + OWNER/MEMBER roles
- [ ] One board per project; task CRUD + DnD position persist
- [ ] Calendar month view → open shared TaskDetail
- [ ] Comments + team invite/add + in-app notification bell
- [ ] Task attachments (Blob/Uploadthing)
- [ ] Profile + workspace settings
- [ ] Playwright happy path + Jest for pure logic + CI + Vercel

## Non-MVP scope

- [ ] Full Jira-style RBAC / custom workflows
- [ ] WebSocket / realtime collaboration
- [ ] Google Calendar sync, email digests, push notifications
- [ ] Billing / subscriptions
- [ ] Mobile native apps
- [ ] Advanced reporting / burndown

## Folder conventions

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router (auth + protected shells) |
| `components/ui/` | Shadcn primitives |
| `components/features/` | Feature UI (kanban, calendar, …) |
| `lib/` | auth, db, validations, api-client |
| `hooks/` | TanStack Query / feature hooks |
| `stores/` | Zustand — UI state only |
| `prisma/` | Schema + migrations |
| `docs/` | Single source of truth (this folder) |
| `e2e/` | Playwright |
| `__tests__/` | Jest unit tests |

## Coding philosophy

1. **Contract first** — Zod + Prisma before UI polish.
2. **Server for truth** — RSC/Prisma for reads; mutations via Server Actions or Route Handlers.
3. **Client for interaction** — TanStack Query for cache after mount; Zustand only for ephemeral UI.
4. **Authz everywhere** — membership check on every workspace-scoped query.
5. **Small PRs / sessions** — one clear goal; update `SESSION.md` each session.
6. **Portfolio honesty** — prefer working depth over fake breadth.

## TODO

- [ ] Add product name / brand once UI direction is chosen
- [ ] Screenshot gallery for README after Phase 3
