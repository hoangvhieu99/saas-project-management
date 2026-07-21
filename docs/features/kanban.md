# Feature: Kanban

> **Trạng thái:** Đang làm — Phase 2 (Session 13: DnD + moveTask; TaskDetail chưa)

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
- `createProject` seed 3 cột mặc định: Todo, Doing, Done
- Xóa user assignee → `assigneeId` null (`onDelete: SetNull`); assignee validate ở app layer

## UI requirements

- [x] Column list + task cards (read-only board)
- [x] DnD `@dnd-kit`
- [x] Create task per column
- [x] Loading / empty / error (empty per column + notFound gate)
- [x] Drag overlay (Zustand UI ok)

## API requirements

- [x] Queries: `listProjects`, `getProjectBySlug`
- [x] Mutations: `createProject`, `createTask`, `updateTask`, `moveTask`
- [x] Membership-gated qua `lib/project/` authz

## Database models

**Đã land (Session 08):**

- `TaskPriority` — `LOW`, `MEDIUM`, `HIGH`
- `Project`, `BoardColumn`, `Task` — xem schema

Migration: `20260720073433_kanban_foundation`

## Validation rules

- Project name + slug kebab-case
- Task title required; position non-negative; priority enum
- `assigneeId`: cuid hoặc null + `assertAssigneeInWorkspace`

## Permission rules

- Member CRUD task trong workspace (MVP)
- `requireProjectContext`, `requireTaskInProject`, `requireColumnInProject` — chặn IDOR sibling projects
- `assertAssigneeInWorkspace` → non-member assignee = `FORBIDDEN`

## State management

- Board: TanStack Query + RSC initial (session UI sau)
- Drag overlay: Zustand only
- Persist: mutation + invalidate

## Pending tasks

- [x] Models + migration (Session 08)
- [x] Validation + authz (Session 09)
- [x] CRUD Server Actions foundation (Session 10)
- [x] Default columns seed trong `createProject`
- [x] Board UI read-only (Session 11)
- [x] Task create UI (Session 12)
- [x] DnD (Session 13)
- [ ] TaskDetail shared

## Known issues

- Stale assignee nếu user bị remove khỏi workspace — read hiển thị tùy UI session sau

## Future improvements

- Custom columns CRUD, swimlanes, filters, realtime

## Checklist

- [x] Schema khớp Project → BoardColumn → Task
- [x] Validators + authz `lib/project/`
- [x] Server Actions `app/actions/project/`
- [x] Assignee chỉ member workspace (create/update task)
- [x] Board read-only UI + assignee display
- [x] Create task → column (UI)
- [x] Drag → reload persist
