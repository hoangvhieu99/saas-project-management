# Feature: Kanban

> **Trạng thái:** Đang làm — Phase 2 (Session 08: schema Project/BoardColumn/Task đã land; UI/API chưa)

## Mục tiêu feature

Board Kanban portfolio: cột + task, DnD persist position sau reload; TaskDetail dùng chung Calendar sau.

## User flow

1. Mở project board trong workspace
2. Tạo task trong cột
3. Sửa task trong TaskDetail (sheet/drawer)
4. Kéo task giữa cột / reorder
5. Reload — thứ tự và cột không đổi

## Business rules

- Một board / project (MVP)
- Position integer trên cột (task) và project (column order)
- Assignee optional; dueDate optional
- Project slug unique trong workspace
- Xóa user assignee → `assigneeId` null (`onDelete: SetNull`) — **chưa** validate assignee ∈ workspace tại schema (Session 09)

## UI requirements

- [ ] Column list + task cards
- [ ] DnD `@dnd-kit`
- [ ] Create task per column
- [ ] Loading / empty / error
- [ ] Drag overlay (Zustand UI ok)

## API requirements

- [ ] CRUD project / columns / tasks
- [ ] `moveTask` (columnId + position)
- [ ] Membership-gated

## Database models

**Đã land (Session 08):**

- `TaskPriority` — `LOW`, `MEDIUM`, `HIGH`
- `Project` — `id`, `workspaceId`, `name`, `slug`, timestamps; `@@unique([workspaceId, slug])`
- `BoardColumn` — `id`, `projectId`, `name`, `position`
- `Task` — `id`, `columnId`, `title`, `description?`, `position`, `dueDate?`, `priority`, `assigneeId?`; assignee FK **`onDelete: SetNull`**

Migration: `20260720073433_kanban_foundation`

**Chưa có:** Comment, attachment, seed default columns

## Validation rules

- Title required (Session API sau)
- Position non-negative (Session API sau)
- Priority enum LOW|MEDIUM|HIGH
- **Session 09:** assigneeId phải là member của workspace project

## Permission rules

- Member CRUD task trong workspace (MVP)
- OWNER/MEMBER đều move task (MVP)

## State management

- Board: TanStack Query + RSC initial
- Drag overlay: Zustand only
- Persist: mutation + invalidate

## Pending tasks

- [x] Models + migration (Session 08)
- [ ] Validation + authz assignee membership (Session 09)
- [ ] Default columns Todo/Doing/Done (seed hoặc create-project)
- [ ] Task CRUD UI + DnD
- [ ] TaskDetail shared

## Known issues

- **assigneeId chưa validate theo workspace membership ở DB** — chuyển Session 09 (`lib/project/` authz)

## Future improvements

- Custom columns CRUD, swimlanes, filters, realtime

## Checklist

- [x] Schema khớp Project → BoardColumn → Task
- [x] Project scoped `workspaceId`
- [x] assignee `onDelete: SetNull`
- [ ] Create task → column
- [ ] Drag → reload persist
- [ ] Assignee chỉ member workspace
