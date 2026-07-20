# SESSION

Cập nhật mỗi coding session. AI/dev: đọc file này trước, rồi `features/*.md` + `explanations/*.md`.

**Ngôn ngữ tài liệu: tiếng Việt.**

---

## Sprint hiện tại

Workspace Foundation

## Goal hiện tại

Session 02 đã xong: `lib/workspace` (Zod + WorkspaceContext authz). Chờ session tường minh tiếp theo (CRUD hoặc architecture refactor — không tự advance).

## Feature đang làm

Workspace — `docs/features/workspace.md` · lịch sử `docs/explanations/workspace.md`

## Task hiện tại

Không — Session 02 đã STOP.

## Blocked

Không

## Task tiếp theo

- Session CRUD workspace **hoặc** session refactor Domain-Oriented cho Auth/shared — **chỉ khi được yêu cầu rõ**
- Không tự mở UI/API/routes

## Files được phép sửa

- Không — session đã đóng

## Files cấm sửa

- Không tự advance roadmap
- Không thêm Workspace CRUD / UI / API nếu chưa có session tường minh
- Không migrate `lib/auth*` / `lib/shared` nếu chưa có session refactor tường minh

## Notes

- Session 01 (2026-07-16): `Workspace` + `Membership` + `WorkspaceRole`; migration `workspace_foundation`
- Session docs (2026-07-20): khung learning / decisions / explanations / reviews
- Session 02 (2026-07-20): `lib/workspace/{validation,authz,index}.ts`; learning 03 + 05; **không** ADR; **không** đổi `api-helpers`
- Hybrid tạm: Auth flat, Workspace theo domain — chấp nhận đến session refactor

---

## Session log

| Ngày | Goal | Kết quả |
|------|------|---------|
| 2026-07-16 | Docs SSOT | Xong |
| 2026-07-16 | Phase 0 freeze | Xong |
| 2026-07-16 | Foundation cleanup | Xong — chờ review |
| 2026-07-16 | Architecture review + freeze | Xong |
| 2026-07-16 | Workspace Sprint planning | Đã duyệt |
| 2026-07-16 | Session 01 Workspace Prisma models | Xong |
| 2026-07-20 | Khung tài liệu TV + backfill Session 01 | Xong |
| 2026-07-20 | Session 02 validation + authz (`lib/workspace`) | Xong |

## TODO

- [x] Foundation cleanup
- [x] Architecture freeze
- [x] Session 01 Workspace Prisma models
- [x] Backfill docs Session 01 (learning, ADR-008, explanations, review)
- [x] Session 02 — validations + authz helpers
- [ ] Session CRUD / UI / routes (khi được giao)
- [ ] Session architecture refactor Auth/shared (khi được giao)
