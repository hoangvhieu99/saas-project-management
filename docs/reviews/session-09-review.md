# Review Session 09 — Kanban validation + authz (`lib/project/`)

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `lib/project/validators.ts` — project, column, task schemas
- `lib/project/authz.ts` — `requireProjectContext`, `requireTaskInProject`, `assertAssigneeInWorkspace`
- `lib/project/index.ts` — barrel export
- Docs: feature, explanation, learning `10-project-authz.md`, SESSION, NEXT

**Không** có: Server Actions, routes, UI, migration mới.

## Làm tốt

- Mirror đúng pattern Session 02 (`lib/workspace/`)
- `requireTaskInProject` dùng **single nested-where query** theo `taskId` + `projectId` + `workspaceId`
- Đóng lỗ IDOR giữa sibling projects trong cùng workspace
- Assignee rule tách đúng lớp: Zod validate shape, authz validate membership
- `assigneeId` nullable rõ ràng

## Risks / nợ còn lại

| Risk / nợ | Mức | Chuyển giao |
|-----------|-----|-------------|
| CRUD session sau quên gọi `assertAssigneeInWorkspace` | Trung bình | Session 10 review phải check bắt buộc |
| `requireProjectContext` dùng `projectSlug`, còn task helper dùng `projectId` | Thấp | Chấp nhận: phù hợp route vs nested entity lookup |
| Chưa có `moveTask` authz riêng | Thấp | Session CRUD/DnD sau |

## Testing considerations (manual spec)

1. `assertAssigneeInWorkspace(null, workspaceId)` → không throw
2. Member A assign Member B cùng workspace → OK
3. Member A assign User C ngoài workspace → `FORBIDDEN`
4. `requireProjectContext(member, wsSlug, badProjectSlug)` → `NOT_FOUND`
5. `requireTaskInProject(member, wsSlug, projectA.id, taskFromProjectB.id)` → `NOT_FOUND`
6. `requireTaskInProject(member, wsSlug, projectA.id, taskFromProjectA.id)` → OK
7. `createTaskSchema` reject title empty, position âm, assignee malformed

## Kết luận

Session đạt goal: `lib/project/` sẵn cho CRUD Kanban, và rule assignee membership đã được khóa ở app layer trước khi mở actions.
