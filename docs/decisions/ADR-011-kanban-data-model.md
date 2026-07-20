# ADR-011: Mô hình dữ liệu Kanban (Project + BoardColumn + Task)

## Status

Accepted — 2026-07-20 (Session 08)

## Context

Phase 2 Kanban cần nền dữ liệu: project trong workspace, board một project, cột và task có thứ tự (DnD), `dueDate` cho Calendar, `assigneeId` optional.

ADR-008 đã có Workspace + Membership. Session 08 chỉ schema — không UI/API.

## Problem

Làm sao thiết kế schema tối thiểu nhưng đủ cho:

1. Scope project theo workspace (multi-tenant)
2. DnD reorder columns + tasks (position integer)
3. Calendar query theo `dueDate`
4. Assignee optional, an toàn khi xóa user

## Decision

Thêm vào Prisma:

1. **`Project`** — `workspaceId`, `name`, `slug`, `@@unique([workspaceId, slug])`, cascade từ Workspace
2. **`BoardColumn`** — `projectId`, `name`, `position`; một board / project (MVP)
3. **`Task`** — `columnId`, `title`, `description?`, `position`, `dueDate?`, `priority` (`TaskPriority`: LOW|MEDIUM|HIGH), `assigneeId?`
4. **`Task.assignee`** → `User` với **`onDelete: SetNull`** (xóa user → task giữ, assignee null)
5. Cascade: Workspace → Project → BoardColumn → Task

Migration: `20260720073433_kanban_foundation`.

**Chưa có:** validation assignee membership, CRUD, UI, seed default columns, Comment.

## Why this solution?

- **BoardColumn bảng riêng** (không enum status trên Task) — DnD cột, custom columns sau
- **`workspaceId` chỉ trên Project** — scope tenant tại root entity; Task/Column qua FK chain
- **`onDelete: SetNull` assignee** — task không mất khi user bị xóa; tránh orphan FK block
- **Index `dueDate`, `[columnId, position]`** — Calendar + board query

## Alternatives considered

| Phương án | Mô tả |
|-----------|--------|
| A. `Task.status` enum thay BoardColumn | Ít bảng |
| B. `workspaceId` denormalize trên Task | Query authz nhanh hơn |
| C. `onDelete: Cascade` assignee | Xóa user xóa task |
| D. `onDelete: Restrict` assignee | Block xóa user có task |

## Why alternatives were rejected

- **A:** Khó reorder/custom columns; lệch `kanban.md`
- **B:** Redundant; drift risk — authz qua Project đủ Phase 2
- **C:** Mất task khi offboard user — UX xấu MVP
- **D:** Phức tạp offboard — SetNull + validate app layer Session 09

## Pros

- Khớp ROADMAP DnD + Calendar
- Mirror pattern Session 01 (schema trước)
- SetNull assignee an toàn DB-level

## Cons

- **Schema không enforce assignee ∈ workspace** — phải validate app (Session 09)
- Chưa seed Todo/Doing/Done — session sau

## Trade-offs

| Được | Mất |
|------|-----|
| Linh hoạt DnD | Position collision xử lý session DnD |
| SetNull an toàn xóa user | Assignee có thể trỏ user ngoài workspace nếu app không validate |

## Future impact

- Session 09: Zod + authz helpers `lib/project/` — **bắt buộc validate assigneeId theo workspace membership**
- Session sau: CRUD, board UI, `moveTask`

## Related files

- `prisma/schema.prisma`
- `prisma/migrations/20260720073433_kanban_foundation/migration.sql`
- `docs/features/kanban.md`
- `docs/explanations/kanban.md`
- `docs/learning/09-prisma-kanban-models.md`

## References

- ADR-008 (workspace scoping)
- ADR-010 (domain modules — Session 09+)
