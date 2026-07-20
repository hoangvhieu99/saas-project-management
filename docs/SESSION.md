# SESSION

Cập nhật mỗi coding session. AI/dev: đọc file này trước, rồi `features/*.md` + `explanations/*.md`.

**Ngôn ngữ tài liệu: tiếng Việt.**

---

## Sprint hiện tại

Workspace Foundation

## Goal hiện tại

Session 03 đã xong: refactor `lib/` → Domain-Oriented Modules (ADR-010). Chờ session tường minh tiếp theo (Workspace CRUD — không tự advance).

## Feature đang làm

Workspace — `docs/features/workspace.md` · lịch sử `docs/explanations/workspace.md`

## Task hiện tại

Không — Session 03 đã STOP.

## Blocked

Không

## Task tiếp theo

- Session Workspace CRUD / UI / routes — **chỉ khi được yêu cầu rõ**
- Không tự mở feature khác

## Files được phép sửa

- Không — session đã đóng

## Files cấm sửa

- Không tự advance roadmap
- Không thêm Workspace CRUD / UI / API nếu chưa có session tường minh

## Notes

- Session 01: Prisma Workspace + Membership
- Session 02: `lib/workspace` validators + authz (WorkspaceContext)
- Session 03 (2026-07-20): move Auth → `lib/auth/`, infra → `lib/shared/`; rename `validators.ts`; ADR-010; **không** đổi business logic

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
| 2026-07-20 | Session 03 Architecture refactor Domain Modules | Xong |

## TODO

- [x] Foundation cleanup
- [x] Architecture freeze
- [x] Session 01 Workspace Prisma models
- [x] Backfill docs Session 01
- [x] Session 02 — validations + authz helpers
- [x] Session 03 — Domain-Oriented `lib/` (ADR-010)
- [ ] Session CRUD / UI / routes (khi được giao)
