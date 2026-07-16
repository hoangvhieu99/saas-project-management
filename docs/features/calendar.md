# Feature: Calendar

> **Status:** Deferred — Phase 3 (not in codebase yet)

## Feature Goal

Month view of tasks by `dueDate`; clicking a task opens the same TaskDetail used by Kanban.

## User Flow

1. Open Calendar in a project or workspace scope
2. See tasks on due dates
3. Click task → TaskDetail sheet
4. Edit dueDate → event moves on next fetch

## Business Rules

- Only tasks with `dueDate` appear
- Scoped by workspace membership (+ project filter if applicable)
- No external calendar sync (Non-MVP)

## UI Requirements

- [ ] Month grid (date-fns + custom UI)
- [ ] Task chips on days
- [ ] Navigate prev/next month
- [ ] Empty days clean (no clutter)

## API Requirements

- [ ] List tasks in date range for workspace/project
- [ ] Reuse task update for dueDate changes

## Database Models

- Reads/updates `Task.dueDate`

## Validation Rules

- dueDate: valid ISO date or null

## Permission Rules

- Same as Kanban task read/update

## State Management

- Range + selected month: URL or local React state
- Tasks: TanStack Query by `{ workspaceId, from, to }`

## Pending Tasks

- [ ] Calendar page/grid
- [ ] Wire TaskDetail
- [ ] Query by date range

## Known Issues

- None yet

## Future Improvements

- Week/day views, drag to reschedule, Google sync

## Checklist

- [ ] Tasks with dueDate render on correct day
- [ ] Click opens shared TaskDetail
- [ ] No FullCalendar dependency unless justified later
