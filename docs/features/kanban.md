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

- Project name required; project slug lowercase kebab-case
- Column name required; position non-negative
- Title required; position non-negative
- Priority enum LOW|MEDIUM|HIGH
- `assigneeId`: cuid hoặc null; **Session 09** validate membership ở app layer

## Permission rules

- Member CRUD task trong workspace (MVP)
- OWNER/MEMBER đều move task (MVP)
- `requireProjectContext(userId, workspaceSlug, projectSlug)` → member + project thuộc workspace
- `requireTaskInProject(userId, workspaceSlug, projectId, taskId)` → task phải thuộc **đúng project** trong workspace (chặn IDOR giữa sibling projects)
- `assertAssigneeInWorkspace(assigneeId, workspaceId)` → non-member assignee = `FORBIDDEN`

## State management

- Board: TanStack Query + RSC initial
- Drag overlay: Zustand only
- Persist: mutation + invalidate

## Pending tasks

- [x] Models + migration (Session 08)
- [x] Validation + authz assignee membership (Session 09)
- [ ] Default columns Todo/Doing/Done (seed hoặc create-project)
- [ ] Task CRUD UI + DnD
- [ ] TaskDetail shared

## Known issues

- DB **không tự enforce** assignee ∈ workspace; Session 09 đã thêm helper app-layer và Session 10 CRUD phải bắt buộc gọi helper này

## Future improvements

- Custom columns CRUD, swimlanes, filters, realtime

## Checklist

- [x] Schema khớp Project → BoardColumn → Task
- [x] Project scoped `workspaceId`
- [x] assignee `onDelete: SetNull`
- [x] Validators + authz `lib/project/`
- [ ] Create task → column
- [ ] Drag → reload persist
- [ ] Assignee chỉ member workspace
