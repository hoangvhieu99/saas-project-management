# Feature: Kanban

> **Status:** Deferred — Phase 2 (not in codebase yet)

## Feature Goal

Core portfolio feature: project board with columns and tasks; drag-and-drop persists column + position across reload.

## User Flow

1. Open project board in workspace
2. Create task in a column
3. Edit task in shared TaskDetail (sheet/drawer)
4. Drag task across columns / reorder
5. Reload — order and column unchanged

## Business Rules

- One board per project (MVP)
- Position integer (or fractional later) per column
- Assignee optional; dueDate optional
- Comments / attachments attach to Task (see ROADMAP)

## UI Requirements

- [ ] Column list + task cards
- [ ] DnD via `@dnd-kit`
- [ ] Create task control per column
- [ ] Loading / empty / error states
- [ ] Drag overlay (Zustand UI ok)

## API Requirements

- [ ] CRUD project / columns / tasks
- [ ] `moveTask` mutation (columnId + position)
- [ ] Membership-gated

## Database Models

- `Project`, `BoardColumn`, `Task` (title, description, dueDate, priority, position, columnId, assigneeId?)

## Validation Rules

- Title required
- Position non-negative
- Priority enum TBD

## Permission Rules

- Members can CRUD tasks in their workspace
- OWNER/MEMBER both can move tasks (MVP)

## State Management

- Board data: TanStack Query + server initial
- Drag overlay / active id: Zustand only
- Persist via mutation + invalidate

## Pending Tasks

- [ ] Models + default columns (Todo / Doing / Done)
- [ ] Task CRUD UI
- [ ] DnD + reorder helper (Jest)
- [ ] Shared TaskDetail

## Known Issues

- None yet

## Future Improvements

- Custom columns CRUD, swimlanes, filters, realtime presence

## Checklist

- [ ] Create task → appears in column
- [ ] Drag → reload persists
- [ ] TaskDetail reusable from Calendar later
