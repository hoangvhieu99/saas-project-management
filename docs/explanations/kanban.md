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

## Session 09 — Validation + authz helpers (2026-07-20)

### Mục tiêu session

Thêm **Zod validators** và **authz helpers** cho Project/Task trước CRUD Kanban. Đóng nợ Session 08: `assigneeId` phải là member của workspace project.

### Đã thêm

```
lib/project/
  validators.ts
  authz.ts
  index.ts
```

- Validators: project create/update, board column create, task create/update
- Authz: `requireProjectContext`, `requireTaskInProject`, `assertAssigneeInWorkspace`
- `requireTaskInProject` dùng **single nested-where query** theo `taskId` + `projectId` + `workspaceId` để chặn IDOR giữa nhiều project cùng workspace

### Quyết định trong session

1. **Assignee invalid → `FORBIDDEN`** (không `NOT_FOUND`)
2. **`requireTaskInProject` verify theo `projectId`** chứ không chỉ workspace scope
3. `assigneeId` nullable; empty string normalize thành `null`
4. Đổi slug project ngoài scope Session 09 (mirror Workspace Session 02)

### Cố ý chưa làm

- Server Actions / CRUD
- Routes / board UI / DnD
- Seed Todo / Doing / Done

### Learning liên quan

- `docs/learning/10-project-authz.md`

---

## Session 10 — CRUD Server Actions (2026-07-20)

### Mục tiêu session

Thêm **execution layer** Kanban: queries + mutations tại `app/actions/project/`. Không UI, không DnD.

### Đã thêm

```
app/actions/project/
  queries.ts    # listProjects, getProjectBySlug
  mutations.ts  # createProject, createTask, updateTask

lib/project/authz.ts
  requireColumnInProject  # nested verify column + projectId + workspaceId
```

- `createProject`: transaction Project + seed Todo/Doing/Done
- `createTask`: `requireColumnInProject` single nested query (columnId + projectId + workspace)
- `updateTask`: `requireTaskInProject` + `assertAssigneeInWorkspace` khi có assigneeId
- Slug conflict → `CONFLICT`

### Quyết định trong session

1. **Defer `createBoardColumn`** — seed đủ foundation
2. **Không `moveTask`** — session DnD sau
3. **Không delete** project/task/column

### Cố ý chưa làm

- Board UI, routes, DnD, TaskDetail

### Learning liên quan

- `docs/learning/11-project-server-actions.md`

---

<!-- Session 11+ sẽ append bên dưới dòng này -->

## Session 11 — Kanban board UI read-only (2026-07-20)

### Mục tiêu session

Gắn **UI board tối thiểu read-only** vào route workspace: list projects, mở board theo project slug, hiển thị columns + tasks từ Server Actions Session 10. Không DnD, không create form phức tạp.

### Đã thêm

```
app/(app)/w/[slug]/projects/[projectSlug]/page.tsx
components/features/kanban/
  KanbanBoard.tsx
  KanbanColumn.tsx
  KanbanTaskCard.tsx
app/(app)/w/[slug]/page.tsx   # list projects + link board
app/actions/project/queries.ts # getProjectBySlug include assignee
```

- Route board: `/w/[slug]/projects/[projectSlug]` (thay gợi ý `/p/` trong learning Session 08 — chưa từng implement)
- Board page: try/catch `NOT_FOUND` → `notFound()`; `UNAUTHORIZED` → redirect (defensive — xem review)
- `KanbanTaskCard`: title, priority badge, dueDate, assignee avatar/name

### Quyết định (Design Review + approve có điều kiện)

1. **Route `/projects/[projectSlug]`** — tự mô tả resource, giữ `/w/[slug]` làm shell entry
2. **Include assignee trong `getProjectBySlug`** — select `id`, `name`, `image`; không fetch client-side
3. **`UNAUTHORIZED` trên board page là defensive** — chỉ từ `requireUser()`; middleware + layout đã gate auth
4. **Component split** Board / Column / TaskCard — presentational, không business logic

### Cố ý chưa làm

- DnD, `@dnd-kit`, `moveTask`
- TaskDetail drawer
- Create project / create task form UI

### Learning liên quan

- (Session 11 chưa thêm learning file riêng — pattern mirror Session 05 workspace routes)

