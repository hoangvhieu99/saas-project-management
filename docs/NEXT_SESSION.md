# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 06 — Dashboard summary widgets

## Goal

Thêm **widget tóm tắt tối thiểu** trên Dashboard (đã có list workspace), dựa trên dữ liệu workspace/membership hiện có — không mở Kanban/Calendar/Profile.

## Why this session

- Session 05 đã land shell workspace + `/w/[slug]`.
- ROADMAP Phase 1 còn Dashboard summary widgets trước Profile.
- Một goal rõ: **dashboard có giá trị tóm tắt**, không nhét board/task.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/ROADMAP.md` (context Phase — không tự mở rộng scope)
4. `docs/features/workspace.md`
5. `docs/explanations/workspace.md`
6. `docs/ARCHITECTURE.md`
7. `docs/learning/07-workspace-routes.md`

## Prerequisites

- [x] Session 01–04 — schema, validators, authz, Server Actions
- [x] Session 05 — UI + `/w/[slug]` + layout gate

## Scope

- Widget tóm tắt trên `/dashboard` (ví dụ: số workspace, workspace gần đây / role OWNER vs MEMBER — chốt ở Design Review)
- Tái sử dụng `listWorkspaces` (và queries hiện có) — không Prisma trong Client Component
- Cập nhật docs bắt buộc (feature nếu đụng contract, explanation, learning nếu khái niệm mới, review, SESSION, overwrite NEXT)

## Out of Scope

- Profile (name, avatar)
- Kanban, Calendar, Project/Task models
- Workspace settings rename/delete UI
- Invite members
- Schema / migration mới (trừ Design Review phát hiện thiếu — dừng hỏi)
- Repository / Service / Clean Architecture

## Expected Files

- `app/(app)/dashboard/page.tsx` và/hoặc `components/features/dashboard/...`
- Có thể chỉnh nhẹ shell nếu cần entry
- `docs/reviews/session-06-review.md`
- `docs/SESSION.md`, `docs/NEXT_SESSION.md`
- Feature/explanation/learning chỉ khi thực sự đụng

## Deliverables

- [ ] Code trong Scope
- [ ] Docs: review (+ feature/explanation/learning nếu cần)
- [ ] ADR chỉ nếu có quyết định kiến trúc mới
- [ ] `SESSION.md` cập nhật
- [ ] `NEXT_SESSION.md` overwrite cho session kế (hoặc Waiting)
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang Profile / Kanban — giữ widget summary only
- Invent dữ liệu giả (task count) khi chưa có model Task — **không** bịa; chỉ aggregate từ Workspace/Membership

## Success Criteria

- Dashboard còn empty/list workspace **và** có summary widgets hữu ích từ dữ liệu thật
- Không có Profile / Kanban / Calendar / settings workspace trong session
- Docs + NEXT_SESSION đã cập nhật; STOP

## Completion Workflow

1. Verify TypeScript  
2. Verify ESLint  
3. Verify Build  
4. Update Feature (nếu cần)  
5. Update Explanation (nếu cần)  
6. Update Learning (nếu cần)  
7. Update Review  
8. Update ADR (nếu có)  
9. Update SESSION.md  
10. Overwrite NEXT_SESSION.md (session kế **hoặc** `Waiting for human assignment`)  
11. STOP — không tự mở session mới  

## Status

`Ready for Design Review`
