# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 11 — Kanban board UI (read-only foundation)

## Goal

Gắn **UI board tối thiểu** vào route workspace: list projects, mở board theo project slug, hiển thị columns + tasks từ Server Actions Session 10. **Không DnD, không create task form phức tạp** — chốt chi tiết Design Review.

## Why this session

- Session 10 đã land CRUD server + seed columns.
- Pattern Session 05: UI sau CRUD server.
- Cần board visible trước khi mở DnD session.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/reviews/session-10-review.md`
6. `app/actions/project/`
7. `app/(app)/w/[slug]/` (shell hiện tại)

## Prerequisites

- [x] Session 08–10 — schema, authz, CRUD actions

## Scope

- Chốt Design Review: route project board, components `components/features/kanban/`
- Hiển thị board từ `getProjectBySlug`
- Có thể: list projects trong workspace shell, link vào board
- **Không** `@dnd-kit`, **không** `moveTask`

## Out of Scope

- DnD, optimistic UI, Zustand drag overlay
- TaskDetail drawer
- Calendar, comments

## Expected Files

- Route/page board under `/w/[slug]/...`
- `components/features/kanban/...`
- Docs review, SESSION, NEXT

## Deliverables

- [ ] UI trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang DnD — giữ read/display + minimal create nếu approve

## Success Criteria

- Member mở board thấy columns + tasks từ data thật
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
