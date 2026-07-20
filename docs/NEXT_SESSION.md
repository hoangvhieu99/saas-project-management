# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 07 — Profile basics (name, avatar URL)

## Goal

Cho phép user đã đăng nhập **xem và cập nhật profile cơ bản** (name, avatar URL) — Phase 1 ROADMAP item còn lại trước Phase 2 Kanban.

## Why this session

- Session 06 đã land dashboard summary widgets.
- ROADMAP Phase 1 còn Profile basics sau Dashboard widgets.
- Profile là nền cho assignee display sau này (Phase 2+).

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/ROADMAP.md` (context Phase — không tự mở rộng scope)
4. `docs/features/profile.md`
5. `docs/ARCHITECTURE.md`
6. `prisma/schema.prisma` (User model hiện tại)

## Prerequisites

- [x] Session 01–05 — workspace foundation + UI
- [x] Session 06 — dashboard summary widgets

## Scope

- Chốt chi tiết ở **Design Review** (route `/profile` hoặc modal, form RHF + Zod, Server Action update user)
- User chỉ sửa profile của chính mình
- Avatar: URL string (không upload file trong session này trừ Design Review approve khác)
- Cập nhật docs bắt buộc (feature, explanation, review, SESSION, overwrite NEXT)

## Out of Scope

- Email change
- Kanban, Calendar, Task models
- Workspace settings / invite
- File upload / S3
- Schema migration lớn (trừ Design Review phát hiện thiếu field — dừng hỏi)
- Repository / Service / Clean Architecture

## Expected Files

- Route hoặc page profile + `components/features/profile/...`
- Server Action hoặc route handler update (chốt Design Review)
- `docs/reviews/session-07-review.md`
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

- Scope creep sang avatar upload / email change
- Session refresh sau update name — chốt UX ở Design Review

## Success Criteria

- User đăng nhập sửa được name + avatar URL; hiển thị cập nhật trong shell/menu
- Không Kanban / workspace settings trong session
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
