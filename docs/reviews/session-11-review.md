# Review Session 11 — Kanban board UI (read-only foundation)

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- Route `/w/[slug]/projects/[projectSlug]` — board page với `notFound()` / defensive `UNAUTHORIZED` redirect
- `app/actions/project/queries.ts` — `getProjectBySlug` include `assignee` (id, name, image) trong nested tasks
- `components/features/kanban/` — `KanbanBoard`, `KanbanColumn`, `KanbanTaskCard`
- `app/(app)/w/[slug]/page.tsx` — list projects + link vào board
- Docs: feature, explanation, ARCHITECTURE, SESSION, NEXT

**Không** có: DnD, `@dnd-kit`, `moveTask`, TaskDetail, create task/project form.

## Làm tốt

- Mirror Session 05 pattern: RSC page fetch actions, presentational feature components
- `NOT_FOUND` tường minh ở board page — không bubble 500
- Assignee include ở query layer — card không cần fetch thêm
- Route `/projects/[projectSlug]` tự mô tả hơn gợi ý `/p/` trong learning Session 08
- Component split rõ: board → column → card

## UNAUTHORIZED — nguồn gốc đã xác nhận

| Nguồn | Throw khi |
|-------|-----------|
| `requireUser()` (`lib/auth/authz.ts`) | Không có session |

`requireWorkspaceContext` / `requireProjectContext` **không** throw `UNAUTHORIZED` — chỉ `NOT_FOUND` / `FORBIDDEN`.

Board page chạy sau middleware + `AuthenticatedShell` + `w/[slug]/layout` → nhánh `UNAUTHORIZED` là **defensive only** (session hết hạn giữa render). Comment đã ghi trong page.

## Risks còn lại

| Risk | Chuyển giao |
|------|-------------|
| Không có create project/task UI | Session 12 mutations UI |
| Chưa có `moveTask` | Session DnD |
| Stale assignee hiển thị | Known issue — validate read session sau |

## Testing considerations (manual)

1. Member mở `/w/{ws}/projects/{project}` → 3 cột Todo/Doing/Done + tasks ordered
2. Task có assignee → card hiển thị avatar/name
3. Cột rỗng → empty state per column
4. Non-member hoặc slug sai → `notFound()` (404)
5. Workspace shell list projects → link mở board
6. Không có drag / `moveTask` call

## Kết luận

Session đạt goal: board read-only visible từ data thật, sẵn cho create-task UI và DnD session sau.
