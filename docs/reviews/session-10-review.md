# Review Session 10 — Kanban CRUD Server Actions

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `app/actions/project/queries.ts` — `listProjects`, `getProjectBySlug`
- `app/actions/project/mutations.ts` — `createProject`, `createTask`, `updateTask`
- `lib/project/authz.ts` — thêm `requireColumnInProject` (nested where)
- Docs: feature, explanation, learning 11, SESSION, NEXT

**Không** có: UI, DnD, `moveTask`, delete, `createBoardColumn`.

## Làm tốt

- Mirror Session 04 execution pattern
- `createProject` transaction + seed Todo/Doing/Done
- `createTask` nested verify column + project + workspace (điều kiện approve)
- `updateTask` dùng `requireTaskInProject` + assignee check
- `getProjectBySlug` trả board payload ordered cho UI sau

## Risks còn lại

| Risk | Chuyển giao |
|------|-------------|
| UI session quên wire actions | Session 11 board UI |
| Chưa có `moveTask` | Session DnD |
| Position collision | Helper normalize session DnD |

## Testing considerations (manual)

1. Non-member `listProjects` → `NOT_FOUND`
2. `createProject` → 3 columns Todo/Doing/Done
3. Duplicate project slug → `CONFLICT`
4. `createTask` assignee ngoài workspace → `FORBIDDEN`
5. `createTask` columnId project B + projectId project A → `NOT_FOUND`
6. `updateTask` taskId project B + projectId project A → `NOT_FOUND`
7. `updateTask` hợp lệ + assignee member → OK

## Kết luận

Session đạt goal: execution layer Kanban foundation sẵn cho board UI.
