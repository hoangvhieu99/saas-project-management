# Giải thích feature: Kanban

> Lịch sử xây dựng feature theo từng session. **Không xóa** — chỉ append.  
> Hợp đồng trạng thái hiện tại: `docs/features/kanban.md`.

---

## Session 08 — Database model (2026-07-20)

### Mục tiêu session

Chỉ đặt **nền tảng dữ liệu Kanban** — Project, BoardColumn, Task. Không UI, API, validation app, seed.

### Đã thêm vào schema

1. **`TaskPriority`** — `LOW` | `MEDIUM` | `HIGH`
2. **`Project`** — scoped `workspaceId`; `slug` unique trong workspace
3. **`BoardColumn`** — thuộc project; `position` = thứ tự cột
4. **`Task`** — thuộc column; `position`, `dueDate?`, `priority`, `assigneeId?`

### Quy tắc nghiệp vụ đã “khắc” vào DB

| Quy tắc | Cách thể hiện |
|---------|----------------|
| Project thuộc một workspace | `workspaceId` FK + cascade |
| Slug project không trùng trong workspace | `@@unique([workspaceId, slug])` |
| Xóa project → dọn cột + task | Cascade BoardColumn → Task |
| Xóa user assignee → task giữ | `assignee User? … onDelete: SetNull` |
| List task theo cột / due date | Index `[columnId, position]`, `[dueDate]` |

### Migration

- Tên: `kanban_foundation`
- Thư mục: `prisma/migrations/20260720073433_kanban_foundation/`

### Cố ý chưa làm

- Validate assigneeId ∈ workspace membership → **Session 09**
- Zod, authz helpers, Server Actions, UI, DnD, seed Todo/Doing/Done

### Sơ đồ sau Session 08

```
Workspace ──< Project ──< BoardColumn ──< Task
                                              │
                                    assigneeId? ──> User (SetNull on delete)
```

### Quyết định liên quan

- `docs/decisions/ADR-011-kanban-data-model.md`

### Bài học liên quan

- `docs/learning/09-prisma-kanban-models.md`

---

<!-- Session 09+ sẽ append bên dưới dòng này -->
