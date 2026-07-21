# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 14 — TaskDetail drawer (Kanban)

## Goal

Thêm **TaskDetail sheet/drawer** trên board: click task card → xem/sửa fields cơ bản qua `updateTask`. **Không Calendar, không comments** — chốt chi tiết Design Review.

## Why this session

- Session 13 DnD hero xong — user flow step 3 trong `kanban.md`: sửa task trong TaskDetail.
- `updateTask` action đã có từ Session 10; chưa có UI.
- Chuẩn bị shared TaskDetail cho Calendar session sau.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/reviews/session-13-review.md`
6. `app/actions/project/mutations.ts` (`updateTask`)
7. `lib/project/validators.ts` (`updateTaskSchema`)
8. `components/features/kanban/`

## Prerequisites

- [x] Session 08–13 — schema, CRUD, board UI, create forms, DnD

## Scope

- Chốt Design Review: drawer/sheet component, wire `updateTask`
- Fields tối thiểu: title, description, priority, dueDate (optional)
- **Không** assignee picker phức tạp nếu chưa có member list API (chốt Design Review)
- Board vẫn DnD + create task hoạt động

## Out of Scope

- Calendar view
- Comments
- Delete task
- TanStack Query cache layer

## Expected Files

- `components/features/kanban/task-detail-drawer.tsx` (hoặc tương đương)
- Sửa `KanbanTaskCard` / sortable wrapper — open drawer on click (không conflict DnD)
- Docs review, SESSION, NEXT

## Deliverables

- [ ] UI trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Click vs drag conflict — activation constraint / separate handle (chốt Design Review)
- Scope creep Calendar/comments

## Success Criteria

- Click task → drawer mở, sửa title → save → reload card updated
- DnD vẫn hoạt động
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
