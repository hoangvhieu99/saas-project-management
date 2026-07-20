# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 09 — Kanban validation + authz (`lib/project/`)

## Goal

Thêm **Zod validators** và **authz helpers** cho Project/Task scoped workspace — mirror Session 02 Workspace. **Bắt buộc đóng nợ Session 08:** validate `assigneeId` theo workspace membership trước khi có CRUD.

## Why this session

- Session 08 land schema; DB **không** enforce assignee ∈ workspace.
- Pattern đã chứng minh: Session 02 authz trước Session 04 CRUD.
- ROADMAP Phase 2 CRUD/DnD cần cửa authz project/task.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/decisions/ADR-011-kanban-data-model.md`
6. `docs/decisions/ADR-008-workspace-membership-model.md`
7. `lib/workspace/` (pattern tham chiếu Session 02)
8. `prisma/schema.prisma`

## Prerequisites

- [x] Session 08 — Kanban schema + migration

## Scope

- Chốt chi tiết Design Review: `lib/project/validators.ts`, `authz.ts`, `index.ts`
- **Bắt buộc:** helper/rule validate `assigneeId` (nullable) — assignee phải có Membership workspace của project
- ProjectContext hoặc tương đương (member + project thuộc workspace slug)
- **Không** Server Actions, routes, UI

## Out of Scope

- CRUD project/task/columns
- Board UI, DnD
- Seed default columns
- Repository / Service layer

## Expected Files

- `lib/project/validators.ts`, `authz.ts`, `index.ts`
- `docs/reviews/session-09-review.md`
- `docs/SESSION.md`, `docs/NEXT_SESSION.md`
- Feature/explanation/learning cập nhật nếu cần

## Deliverables

- [ ] `lib/project/` trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang CRUD/UI — giữ lib-only
- Assignee validation thiếu edge case (null ok, user removed from workspace) — chốt Design Review

## Success Criteria

- Validators + authz helpers khớp kanban contract
- **assigneeId membership rule** có test/manual spec rõ trong review
- Không CRUD/UI trong session
- Docs + NEXT cập nhật; STOP

## Completion Workflow

1. Verify TypeScript  
2. Verify ESLint  
3. Verify Build  
4. Update Feature / Explanation / Learning / Review  
5. Update SESSION.md  
6. Overwrite NEXT_SESSION.md  
7. STOP  

## Status

`Ready for Design Review`
