# Prisma models Kanban — Project, BoardColumn, Task

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 08 — Kanban foundation**.

## Đây là gì?

Ba model nối tiếp nhau tạo board Kanban trong một workspace:

```
Workspace → Project → BoardColumn → Task
```

- **Project** = một bảng Kanban (MVP: 1 project = 1 board)
- **BoardColumn** = cột (Todo, Doing, Done — tên seed session sau)
- **Task** = thẻ công việc, có thứ tự trong cột

## Tại sao làm DB trước? (giống Session 01 Workspace)

```
Sai:  UI board → rồi mới nghĩ position / dueDate
Đúng: Schema → validation → authz → CRUD → UI + DnD
```

## Scoping workspace (ADR-008)

Chỉ **`Project`** có `workspaceId`. Task không denormalize `workspaceId` — authz sau này đi:

`Task → BoardColumn → Project → workspaceId` + check Membership.

## Position integer

- `BoardColumn.position` — thứ tự cột trái → phải
- `Task.position` — thứ tự card trong cột

Session DnD sau sẽ có helper normalize khi trùng position. **Không** dùng `@@unique([columnId, position])` — reorder dễ conflict.

## assigneeId và onDelete: SetNull

```prisma
assignee User? @relation(fields: [assigneeId], references: [id], onDelete: SetNull)
```

| Hành vi | Ý nghĩa |
|---------|---------|
| User bị xóa | `assigneeId` → `null`, task vẫn tồn tại |
| Cascade task | **Không** — tránh mất dữ liệu công việc |

**Quan trọng:** DB **không** kiểm tra assignee có phải member workspace không. Gán user ngoài workspace vẫn insert được nếu app không validate → **Session 09** thêm authz/validator.

## TaskPriority

Enum `LOW | MEDIUM | HIGH`, default `MEDIUM` — đủ MVP; không thêm `NONE` (optional qua field khác nếu cần sau).

## Index đáng nhớ

| Index | Dùng cho |
|-------|----------|
| `Project(workspaceId, slug)` unique | Route `/w/[slug]/p/[projectSlug]` |
| `BoardColumn(projectId, position)` | List cột ordered |
| `Task(columnId, position)` | List task trong cột + DnD |
| `Task(dueDate)` | Calendar month view |

## Anti-patterns

| Sai | Đúng |
|-----|------|
| `Task.status` enum thay BoardColumn | Bảng column riêng |
| `onDelete: Cascade` assignee → xóa hết task khi xóa user | `SetNull` |
| Tin FK assignee = đúng member workspace | Validate Session 09 |
| Seed columns trong migration Session 08 | Seed khi có create-project |

## File liên quan

- `prisma/schema.prisma`
- `prisma/migrations/20260720073433_kanban_foundation/migration.sql`
- `docs/decisions/ADR-011-kanban-data-model.md`

## Câu hỏi tự kiểm

1. Entity nào mang `workspaceId`?
2. Xóa User assignee thì Task ra sao — cascade hay set null?
3. Vì sao assignee membership validate không làm ở Session 08?
