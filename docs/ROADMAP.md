# ROADMAP

90-day portfolio plan (~10–15h/week). Maps to detailed mentor phases in the project plan.

**Session kế tiếp (chi tiết scope):** xem `docs/NEXT_SESSION.md` — không suy luận implementation từ checkbox bên dưới.

---

## Phase 1 — Foundation + Workspace (Days 1–28)

### Goals

- Scaffold Next.js 15 app with docs SSOT, Auth.js, app shell
- Multi-tenant workspace + dashboard + basic profile
- Membership authz on every slug-scoped read/write

### Deliverables

- [x] `/docs` SSOT complete
- [x] Next.js + Tailwind + UI primitives + Prisma (SQLite local) + Auth shell
- [x] Auth: register, login, logout, protected `(app)` layout
- [x] CI: lint + typecheck
- [x] `lib/` Domain-Oriented modules (ADR-010) — Auth + Workspace + shared
- [x] Workspace CRUD + `w/[slug]` + OWNER/MEMBER
- [x] Dashboard summary widgets
- [x] Profile basics (name, avatar URL)

### Completed

- [x] Docs SSOT (Session 0)
- [x] App scaffold + Auth (Phase 0 freeze)
- [x] Foundation cleanup (docs / ignore / dead paths)
- [x] Session 01–02 Workspace schema + validators/authz
- [x] Session 03 Architecture refactor (`lib/` domain modules)
- [x] Session 04–05 Workspace CRUD server + UI `/w/[slug]`
- [x] Session 06 Dashboard summary widgets
- [x] Session 07 Profile basics

---

## Phase 2 — Kanban + Calendar + Collab (Days 29–65)

### Goals

- Ship the portfolio “hero”: interactive Kanban with persisted positions
- Calendar + comments + team around a shared TaskDetail

### Deliverables

- [ ] Project + board columns + task CRUD
- [ ] DnD between columns (`@dnd-kit`) + reload-safe positions
- [ ] Optimistic UI via TanStack mutations; Zustand for drag overlay only
- [ ] Calendar month view by `dueDate`
- [ ] Comments on tasks
- [ ] Team list + invite/add member
- [ ] Shared TaskDetail sheet/drawer

### Completed

- [ ] Kanban core
- [ ] Calendar + Comments + Team

---

## Phase 3 — Polish + Ship (Days 66–90)

### Goals

- Notifications, files, settings, quality gates, public deploy
- Interview-ready README + seed demo data

### Deliverables

- [ ] In-app notification bell (assign/comment)
- [ ] Task file attachments
- [ ] Workspace + account settings (OWNER delete)
- [ ] Playwright happy paths + Jest units
- [ ] GitHub Actions + Vercel + managed Postgres
- [ ] README with architecture + screenshots

### Completed

- [ ] Notifications + Files + Settings
- [ ] Tests + CI + Deploy + README

---

## TODO

- [ ] Adjust dates if full-time (compress to ~45–60 days)
- [ ] Mark checkboxes as features ship
