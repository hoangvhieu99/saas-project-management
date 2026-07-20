# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 05 — Workspace UI + routes `/w/[slug]`

## Goal

Gắn CRUD server đã có vào **UI tối thiểu** và **route group** `/w/[slug]/...` (layout + membership gate), để user tạo/chọn workspace và vào không gian theo slug.

## Why this session

- Session 04 đã land Server Actions (queries/mutations) + authz trên mọi path dữ liệu.
- Feature vẫn hoãn dialog/switcher/empty state và routes — đây là dependency trước Dashboard widgets / Profile.
- Một goal rõ: **shell workspace trong app**, không nhét Kanban/Calendar.

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/ROADMAP.md` (context Phase — không tự mở rộng scope)
4. `docs/features/workspace.md`
5. `docs/explanations/workspace.md`
6. `docs/learning/06-server-actions.md`
7. `docs/decisions/ADR-008-workspace-membership-model.md`
8. `docs/decisions/ADR-010-domain-oriented-module-architecture.md`
9. `docs/ARCHITECTURE.md`

## Prerequisites

- [x] Session 01 — Prisma `Workspace` + `Membership` + `WorkspaceRole`
- [x] Session 02 — validators + WorkspaceContext authz
- [x] Session 03 — Domain-Oriented `lib/` (ADR-010)
- [x] Session 04 — Server Actions CRUD (`app/actions/workspace/`)

## Scope

- Route group `app/(app)/w/[slug]/...` + layout gọi authz (member gate)
- UI tối thiểu:
  - tạo workspace (form/dialog gọi `createWorkspace`)
  - list / switcher (gọi `listWorkspaces`)
  - empty state khi chưa có workspace
- Dùng actions hiện có — không viết lại Prisma trong page
- Map lỗi throw (`CONFLICT`, `FORBIDDEN`, …) ra UX hợp lý (toast / inline)
- Cập nhật docs bắt buộc (feature, explanation, learning nếu có khái niệm mới, review, SESSION, overwrite NEXT)

## Out of Scope

- Dashboard widgets, Profile, Kanban, Calendar
- Đổi Prisma schema / migration mới (trừ Design Review phát hiện thiếu — dừng hỏi)
- Đổi slug workspace
- Invite members, custom roles, settings xóa workspace phức tạp (có thể wire `deleteWorkspace` tối giản nếu Design Review duyệt; không bắt buộc)
- Repository / Service / Clean Architecture
- Viết lại CRUD trong `lib/workspace/` dưới dạng actions

## Expected Files

- `app/(app)/w/[slug]/layout.tsx`, `page.tsx` (và route con tối thiểu nếu cần)
- `components/features/workspace/...` — form create, switcher, empty state
- Có thể chỉnh shell/sidebar để gắn switcher
- `docs/features/workspace.md`, `docs/explanations/workspace.md`
- `docs/learning/` (ví dụ routing theo slug nếu land lần đầu)
- `docs/reviews/session-05-review.md`
- `docs/SESSION.md`, `docs/NEXT_SESSION.md`

## Deliverables

- [ ] Code trong Scope
- [ ] Docs: feature / explanation / learning / review
- [ ] ADR chỉ nếu có quyết định kiến trúc mới
- [ ] `SESSION.md` cập nhật
- [ ] `NEXT_SESSION.md` overwrite cho session kế (hoặc Waiting)
- [ ] `tsc` / lint / build xanh

## Risks

- Scope creep sang Dashboard/Kanban — giữ UI workspace shell only
- Quên gọi authz ở layout → leak trang theo slug
- Duplicate fetch (layout + page) — chốt pattern ở Design Review
- UX nuốt lỗi `CONFLICT` / validation — phải hiện được cho user

## Success Criteria

- User login tạo được workspace từ UI và trở thành OWNER
- Switcher/list chỉ hiện workspace user là member
- Vào `/w/[slug]` với tư cách member được; non-member không xem được nội dung (gate server)
- Empty state khi zero workspaces
- Không có Kanban/Calendar/Profile trong session
- Docs + NEXT_SESSION đã cập nhật; STOP

## Completion Workflow

1. Verify TypeScript  
2. Verify ESLint  
3. Verify Build  
4. Update Feature  
5. Update Explanation  
6. Update Learning  
7. Update Review  
8. Update ADR (nếu có)  
9. Update SESSION.md  
10. Overwrite NEXT_SESSION.md (session kế **hoặc** `Waiting for human assignment`)  
11. STOP — không tự mở session mới  

## Status

`Ready for Design Review`
