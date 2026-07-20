# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 10 — Kanban CRUD Server Actions (`app/actions/project/`)

## Goal

Thêm **Server Actions CRUD tối thiểu** cho Project/BoardColumn/Task trên nền `lib/project/` Session 09. Bắt đầu execution layer Phase 2 — **không UI, không DnD**.

## Why this session

- Session 09 đã land validators + authz `lib/project/`.
- Pattern đã chứng minh: Session 04 CRUD sau Session 02 authz/validators.
- CRUD server là bước cần trước UI board và DnD.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/reviews/session-09-review.md`
6. `lib/project/`
7. `app/actions/workspace/` (pattern tham chiếu Session 04)
8. `prisma/schema.prisma`

## Prerequisites

- [x] Session 08 — Kanban schema + migration
- [x] Session 09 — `lib/project/` validators + authz

## Scope

- Chốt ở Design Review: `app/actions/project/queries.ts`, `mutations.ts`
- CRUD tối thiểu:
  - list projects theo workspace
  - get project theo slug
  - create project
  - create/update task
  - create column nếu cần cho foundation
- **Bắt buộc** reuse `lib/project/` authz/validators, gồm `assertAssigneeInWorkspace` và `requireTaskInProject`
- **Không** routes/UI/DnD

## Out of Scope

- Board UI, DnD, Zustand
- TaskDetail drawer/sheet
- Calendar, comments, invite
- Repository / Service layer

## Expected Files

- `app/actions/project/queries.ts`, `mutations.ts`
- Có thể update nhẹ `lib/project/` nếu Design Review phát hiện thiếu helper nhỏ
- `docs/reviews/session-10-review.md`
- `docs/SESSION.md`, `docs/NEXT_SESSION.md`
- Feature/explanation/learning cập nhật nếu cần

## Deliverables

- [ ] CRUD Server Actions trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang UI/DnD — giữ server-only
- Quên gọi `assertAssigneeInWorkspace` khi create/update task
- Quên dùng `requireTaskInProject(..., projectId, taskId)` gây IDOR giữa sibling projects

## Success Criteria

- Queries/mutations khớp kanban contract foundation
- Task create/update bắt buộc enforce assignee membership
- Lookup task trong project dùng đúng helper chặn IDOR
- Không UI/DnD trong session
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
