# SESSION

Cập nhật mỗi coding session. AI/dev: đọc file này trước, rồi **`docs/NEXT_SESSION.md`**, rồi feature/explanation theo Reading Order trong NEXT.

**Ngôn ngữ tài liệu: tiếng Việt.**

**Session kế tiếp (SSOT):** [`docs/NEXT_SESSION.md`](./NEXT_SESSION.md) — không suy luận từ ROADMAP hay chat.

---

## Sprint hiện tại

Phase 2 — Kanban domain foundation

## Goal hiện tại

Session 09 đã xong (Kanban validation + authz). Coding session tiếp theo xem `NEXT_SESSION.md` — **không tự advance**.

## Feature đang làm

Kanban — `docs/features/kanban.md` · lịch sử `docs/explanations/kanban.md`

## Task hiện tại

Không — chờ Design Review + approve theo `NEXT_SESSION.md`.

## Blocked

Không

## Files được phép sửa

- Không — cho đến khi session trong `NEXT_SESSION.md` được approve implement

## Files cấm sửa

- Không tự advance roadmap / tự implement NEXT mà chưa approve

## Notes

- Session 08: Project/BoardColumn/Task + `TaskPriority`; assignee `onDelete: SetNull`
- Session 09: `lib/project/` validators + authz; assignee membership + task/project IDOR guard
- Session 10 sẽ mở CRUD Server Actions trên nền `lib/project/`

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
| 2026-07-20 | Session 05 Workspace UI + `/w/[slug]` | Xong |
| 2026-07-20 | Session 06 Dashboard summary widgets | Xong |
| 2026-07-20 | Session 07 Profile basics | Xong |
| 2026-07-20 | Session 08 Kanban schema | Xong |
| 2026-07-20 | Session 09 Kanban validation + authz | Xong |

## TODO

- [x] Phase 1 (Sessions 01–07)
- [x] Session 08 — Kanban schema
- [x] Session 09 — Kanban validation + authz
- [ ] Session 10 — xem `NEXT_SESSION.md`
