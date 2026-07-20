# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 13 — Kanban DnD + `moveTask`

## Goal

Thêm **drag-and-drop** giữa cột / reorder trong cột với `@dnd-kit`, mutation `moveTask` persist position, reload-safe. **Không TaskDetail, không optimistic phức tạp** — chốt chi tiết Design Review.

## Why this session

- Session 12 đã có board + create task UI — board có data thật để kéo.
- Feature contract `kanban.md` yêu cầu DnD persist position sau reload.
- ROADMAP Phase 2 hero: interactive Kanban.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/features/kanban.md`
4. `docs/explanations/kanban.md`
5. `docs/reviews/session-12-review.md`
6. `app/actions/project/mutations.ts`
7. `lib/project/validators.ts` + `authz.ts`
8. `components/features/kanban/`

## Prerequisites

- [x] Session 08–12 — schema, authz, CRUD, board UI, create forms

## Scope

- Chốt Design Review: `moveTask` Server Action + validator
- `@dnd-kit` drag overlay (Zustand UI ok per feature spec)
- Reorder within column + move between columns
- Position normalize strategy (chốt trong Design Review)
- **Không** TaskDetail drawer

## Out of Scope

- TaskDetail / update task UI
- Delete project/task/column
- Calendar, comments
- Full TanStack Query optimistic pipeline (có thể defer)

## Expected Files

- `app/actions/project/mutations.ts` — `moveTask`
- `lib/project/validators.ts` — move schema (nếu cần)
- `components/features/kanban/` — DnD wrappers
- Docs review, SESSION, NEXT

## Deliverables

- [ ] UI + action trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep TaskDetail — giữ DnD only
- Position collision — cần chốt normalize helper trong Design Review
- Client/server boundary với RSC board — chốt wrapper pattern

## Success Criteria

- Kéo task giữa cột / reorder → reload giữ thứ tự
- Không TaskDetail trong session
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
