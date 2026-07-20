# Review Session 08 — Kanban foundation (schema)

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- Prisma: `Project`, `BoardColumn`, `Task`, enum `TaskPriority`
- Relations: Workspace → Project → BoardColumn → Task; Task.assignee → User
- **`onDelete: SetNull`** tường minh trên `Task.assigneeId` FK
- Migration `20260720073433_kanban_foundation`
- ADR-011, feature/explanation/learning, SESSION, NEXT

**Không** có: UI, API, seed columns, validation app.

## Làm tốt

- Mirror Session 01 — schema-only, reviewable
- `@@unique([workspaceId, slug])` sẵn routing
- Index DnD + Calendar (`position`, `dueDate`)
- SetNull assignee — task survive user delete
- Migration SQL có `ON DELETE SET NULL` rõ ràng

## Architecture quality

Khớp ADR-008 scoping (Project.workspaceId) + ADR-011 BoardColumn table.

## Risks / nợ chuyển giao

| Risk / nợ | Mức | Chuyển giao |
|-----------|-----|-------------|
| **assigneeId chưa validate theo workspace membership** | Trung bình — schema cho phép gán user ngoài workspace | **Session 09 bắt buộc:** validator + authz trong `lib/project/` trước CRUD |
| Position collision khi DnD | Thấp | Session DnD + helper normalize |
| Chưa seed default columns | Chủ đích | create-project session |

## Security

- Schema alone — chưa bề mặt API
- SetNull tránh orphan FK khi xóa user; **không** thay membership check assignee

## Testing considerations

1. `prisma migrate` apply sạch
2. `prisma generate` + build xanh
3. (Tùy chọn Studio) Tạo Project → Column → Task → gán assignee → xóa User → `assigneeId` null

## Kết luận

Session đạt goal Phase 2 foundation. Session 09 phải đóng gap assignee membership trước Server Actions.
