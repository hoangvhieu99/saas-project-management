# SESSION

Cập nhật mỗi coding session. AI/dev: đọc file này trước, rồi **`docs/NEXT_SESSION.md`**, rồi feature/explanation theo Reading Order trong NEXT.

**Ngôn ngữ tài liệu: tiếng Việt.**

**Session kế tiếp (SSOT):** [`docs/NEXT_SESSION.md`](./NEXT_SESSION.md) — không suy luận từ ROADMAP hay chat.

---

## Sprint hiện tại

Workspace Foundation

## Goal hiện tại

Session 04 đã xong (Workspace CRUD server). Coding session tiếp theo xem `NEXT_SESSION.md` — **không tự advance**.

## Feature đang làm

Workspace — `docs/features/workspace.md` · lịch sử `docs/explanations/workspace.md`

## Task hiện tại

Không — chờ Design Review + approve theo `NEXT_SESSION.md`.

## Blocked

Không

## Files được phép sửa

- Không — cho đến khi session trong `NEXT_SESSION.md` được approve implement

## Files cấm sửa

- Không tự advance roadmap / tự implement NEXT mà chưa approve
- Không thêm Workspace UI / routes `/w/[slug]` nếu chưa được duyệt Design Review

## Notes

- Session 01: Prisma Workspace + Membership
- Session 02: validators + WorkspaceContext authz
- Session 03: Domain-Oriented `lib/` (ADR-010)
- Session 04: Server Actions CRUD tại `app/actions/workspace/` (queries + mutations)
- Docs (2026-07-20): learning `06-server-actions.md`

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
| 2026-07-20 | Thêm `NEXT_SESSION.md` handoff | Xong |
| 2026-07-20 | Session 04 Workspace CRUD (server) | Xong |

## TODO

- [x] Foundation cleanup
- [x] Architecture freeze
- [x] Session 01 Workspace Prisma models
- [x] Backfill docs Session 01
- [x] Session 02 — validations + authz helpers
- [x] Session 03 — Domain-Oriented `lib/` (ADR-010)
- [x] `NEXT_SESSION.md` handoff
- [x] Session 04 — Workspace CRUD (server)
- [ ] Session 05 — xem `NEXT_SESSION.md`
