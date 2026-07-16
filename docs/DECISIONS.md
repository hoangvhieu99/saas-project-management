# DECISIONS

Architecture Decision Records (ADR). Newest first.

---

## Template

```
### ADR-XXX: Title

- **Date:** YYYY-MM-DD
- **Decision:**
- **Reason:**
- **Alternative:**
- **Impact:**
- **Status:** Proposed | Accepted | Superseded
```

---

### ADR-001: Full-stack Next.js (not FE-only mocks)

- **Date:** 2026-07-16
- **Decision:** Build App Router + Server Actions/Route Handlers + Postgres in one repo.
- **Reason:** Portfolio needs end-to-end story; one deploy target (Vercel).
- **Alternative:** Mock API / MSW frontend-only; separate Nest API.
- **Impact:** Prisma + Auth.js required early; slower Week 1, stronger demo.
- **Status:** Accepted

### ADR-002: Portfolio MVP scope (not product-ready multi-tenant SaaS)

- **Date:** 2026-07-16
- **Decision:** Optimize for demo depth (Kanban, authz, deploy) over billing/realtime/complex RBAC.
- **Reason:** 90-day side-project constraint.
- **Alternative:** Product-ready MVP with subscriptions and WebSockets.
- **Impact:** Roles limited to OWNER/MEMBER; notifications via poll/invalidate.
- **Status:** Accepted

### ADR-003: Auth.js v5 for authentication

- **Date:** 2026-07-16
- **Decision:** Use Auth.js (Credentials + optional Google OAuth).
- **Reason:** Native Next session model; less custom crypto.
- **Alternative:** Clerk / Lucia / custom JWT.
- **Impact:** Prisma adapter + `AUTH_SECRET`; OAuth env vars for Google.
- **Status:** Accepted

### ADR-004: Zustand for UI only; TanStack Query for server cache

- **Date:** 2026-07-16
- **Decision:** Never store tasks/members as Zustand source of truth.
- **Reason:** Prevents sync bugs; matches Senior FE practice.
- **Alternative:** All state in Zustand or Redux.
- **Impact:** Clear mental model for mentee and AI assistants.
- **Status:** Accepted

### ADR-005: No WebSockets in 90-day window

- **Date:** 2026-07-16
- **Decision:** In-app notifications via DB records + Query invalidation/polling.
- **Reason:** Realtime adds ops complexity beyond portfolio ROI.
- **Alternative:** Pusher / Ably / custom WS.
- **Impact:** Soft “live” feel only; document as Future Improvement.
- **Status:** Accepted

### ADR-006: SQLite for local zero-deps; Postgres via Docker for prod-like

- **Date:** 2026-07-16
- **Decision:** Default `DATABASE_URL=file:./dev.db` (SQLite). Keep `docker-compose.yml` Postgres for optional local/prod parity.
- **Reason:** Docker CLI unavailable on mentorship machine; portfolio must run with `npm install` alone.
- **Alternative:** Require Docker Postgres only.
- **Impact:** Switch schema `provider` to `postgresql` before production Neon/Supabase deploy.
- **Status:** Accepted

### ADR-007: Phase 0 implementation freeze / rollback

- **Date:** 2026-07-16
- **Decision:** Remove premature feature modules; keep Auth-only schema, shell, docs, slim CI.
- **Reason:** Roadmap was auto-advanced past Phase 0; foundation must be reviewable in isolation.
- **Alternative:** Keep over-built MVP and document as done.
- **Impact:** Workspace/Kanban/Calendar/etc. deferred; one-session rule enforced.
- **Status:** Accepted

## TODO

- [ ] Revisit Blob vs local uploads in Phase 4
- [ ] Revisit mutation patterns when Phase 1 APIs land
