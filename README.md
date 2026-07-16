# PulseBoard — SaaS Project Management

Phase 0 foundation: Next.js 15 + Auth.js + Prisma + empty protected dashboard.

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → register → dashboard.

## Docs

See [`docs/`](docs/) — start with [`docs/SESSION.md`](docs/SESSION.md).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run db:migrate` | Prisma migrate |

## Database

- **Local default:** SQLite (`file:./dev.db`)
- **Optional Postgres:** `docker compose up -d` (switch schema provider when ready)

## Current scope (Phase 0)

Auth (register / login / logout) · App shell · Empty dashboard · Docs SSOT · CI lint/typecheck

Later phases: Workspace, Kanban, Calendar, Team, Notifications, Files, Settings, tests, deploy.
