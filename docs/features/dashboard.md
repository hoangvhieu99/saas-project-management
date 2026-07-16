# Feature: Dashboard

> **Status:** Deferred — Phase 1 widgets (empty shell page exists only)

## Feature Goal

Give signed-in users an at-a-glance home: workspaces, due-soon tasks, and simple activity — not a cluttered analytics suite.

## User Flow

1. After login → `/dashboard`
2. See workspace cards / CTA to create first workspace
3. See due-soon tasks (when data exists)
4. Navigate into a workspace or project

## Business Rules

- Only show data for workspaces the user belongs to
- Empty states preferred over fake charts

## UI Requirements

- [ ] Summary widgets: workspace count, due soon, recent projects
- [ ] CTA: create workspace / open last workspace
- [ ] Loading + empty states

## API Requirements

- [ ] Aggregate query: memberships + due tasks (limit)
- [ ] No cross-tenant data

## Database Models

- Reads `Membership`, `Workspace`, `Task` (dueDate)

## Validation Rules

- N/A for read aggregates; query limits TBD

## Permission Rules

- Authenticated only; scoped by membership

## State Management

- Prefer RSC for initial dashboard payload
- Optional Query for soft refresh

## Pending Tasks

- [ ] Dashboard page shell
- [ ] Wire real aggregates after Task model exists
- [ ] Placeholder widgets until Kanban ships

## Known Issues

- Widgets incomplete until Phase 2 data exists

## Future Improvements

- Activity feed, saved filters, per-workspace dashboard

## Checklist

- [ ] Renders for new user (empty)
- [ ] Renders with memberships
- [ ] No data leak across workspaces
