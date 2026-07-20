# NEXT SESSION

> Handoff document. **Một thời điểm chỉ một session kế tiếp.**  
> Không lưu lịch sử — overwrite sau mỗi session hoàn thành.  
> AI/Junior: đọc file này ngay sau `SESSION.md`, trước khi Design Review.  
> **Không** suy luận scope từ ROADMAP nếu mâu thuẫn với file này.

---

## Session

Session 08 — Kanban foundation (Project + Task schema)

## Goal

Đặt **nền dữ liệu Kanban** — Prisma models Project + Task (và quan hệ workspace-scoped) — tương tự Session 01 Workspace. **Không UI, không API, không DnD.**

## Why this session

- Phase 1 (Workspace + Dashboard + Profile) đã xong.
- ROADMAP Phase 2 bắt đầu bằng Project + board columns + task CRUD — schema trước, UI sau (pattern đã chứng minh Session 01→05).

## Reading Order

1. `docs/SESSION.md`
2. `docs/NEXT_SESSION.md` (file này)
3. `docs/ROADMAP.md`
4. `docs/features/kanban.md`
5. `docs/decisions/ADR-008-workspace-membership-model.md` (workspace scoping pattern)
6. `docs/ARCHITECTURE.md`
7. `prisma/schema.prisma`

## Prerequisites

- [x] Phase 1 complete (Sessions 01–07)

## Scope

- Chốt model fields + relations ở **Design Review** (Project, Task, column/status, workspaceId FK, indexes)
- Migration mới
- Docs: feature kanban, explanation append, review, SESSION, overwrite NEXT
- **Không** Server Actions, routes, UI, DnD

## Out of Scope

- Board UI, `@dnd-kit`, TanStack mutations
- Calendar, comments, invite
- Repository / Service layer
- Seed data (trừ Design Review approve)

## Expected Files

- `prisma/schema.prisma` + migration
- `docs/features/kanban.md`, `docs/explanations/kanban.md` (nếu chưa có)
- `docs/reviews/session-08-review.md`
- `docs/SESSION.md`, `docs/NEXT_SESSION.md`
- ADR nếu quyết định model đủ lớn

## Deliverables

- [ ] Schema + migration trong Scope
- [ ] Docs đầy đủ
- [ ] `tsc` / lint / build xanh (Prisma generate)

## Risks

- Scope creep sang UI/API — giữ DB-only
- Task model thiếu field cho Calendar/DnD sau — Design Review phải đọc `kanban.md` + ROADMAP Phase 2

## Success Criteria

- Migration apply sạch; models khớp feature contract draft
- Không UI/API trong session
- Docs + NEXT cập nhật; STOP

## Completion Workflow

1. Verify TypeScript  
2. Verify ESLint  
3. Verify Build  
4. Update Feature / Explanation / Learning / Review / ADR (nếu có)  
5. Update SESSION.md  
6. Overwrite NEXT_SESSION.md  
7. STOP  

## Status

`Ready for Design Review`
