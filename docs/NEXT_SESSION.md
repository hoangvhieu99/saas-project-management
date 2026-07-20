# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 12 — Kanban create project + create task UI

## Goal

Wire **mutations UI tối thiểu** cho Kanban: form tạo project (seed columns), form tạo task per column trên board read-only Session 11. Sau submit → `revalidatePath` + board refresh thấy data mới. **Không DnD, không TaskDetail.**

## Why this session

- Session 11 board read-only — member chưa tạo project/task từ UI (chỉ seed/manual DB).
- Pattern Session 05: CRUD server (Session 10) rồi wire mutations vào UI.
- Cần populate board trước khi mở DnD session.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/reviews/session-11-review.md`
6. `app/actions/project/mutations.ts`
7. `components/features/workspace/create-workspace-form.tsx` (CONFLICT pattern mirror)
8. `app/(app)/w/[slug]/` + `components/features/kanban/`

## Prerequisites

- [x] Session 08–11 — schema, authz, CRUD actions, board UI read-only

## Scope

- Chốt Design Review: create project form (workspace shell hoặc dialog)
- Create task form per column trên board (title required; fields optional tối thiểu)
- Wire `createProject`, `createTask`; CONFLICT slug handling mirror workspace
- **Không** `@dnd-kit`, **không** `moveTask`, **không** `updateTask` UI

## Out of Scope

- DnD, optimistic UI, Zustand drag overlay
- TaskDetail drawer / update task form
- Delete project/task/column
- Calendar, comments

## Expected Files

- `components/features/kanban/create-project-form.tsx` (hoặc tương đương)
- `components/features/kanban/create-task-form.tsx` (hoặc tương đương)
- Sửa `app/(app)/w/[slug]/page.tsx` và/hoặc kanban components
- Docs review, SESSION, NEXT

## Deliverables

- [ ] UI trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang DnD hoặc TaskDetail — giữ form tối thiểu
- Create task position — chốt append cuối cột (max position + 1) trong Design Review

## Success Criteria

- Member tạo project từ UI → redirect hoặc link board, thấy 3 cột seed
- Member tạo task trong cột → card xuất hiện sau refresh
- Không DnD trong session
- Docs + NEXT cập nhật; STOP

## Completion Workflow

1. Verify TypeScript  
2. Verify ESLint  
3. Verify Build  
4. Update docs  
5. Update SESSION.md  
6. Overwrite NEXT_SESSION.md  
7. STOP  

## Status

`Ready for Design Review`
