# Feature: Workspace

> **Trạng thái:** Đang làm — Phase 1 (Session 02: validation + authz helpers đã land; chưa CRUD/UI)

## Mục tiêu feature

User đã đăng nhập tạo và chuyển workspace; mọi dữ liệu dự án được scope theo `slug` workspace kèm kiểm tra membership.

## Trạng thái triển khai

| Khu vực | Trạng thái | Ghi chú |
|---------|------------|---------|
| Prisma models + migration | **Đã land** | Session 01 — `20260716062526_workspace_foundation` |
| Zod validations (name, slug create; name-only update) | **Đã land** | Session 02 — `lib/workspace/validation.ts` |
| Membership authz helpers (WorkspaceContext) | **Đã land** | Session 02 — `lib/workspace/authz.ts` |
| CRUD (Server Actions / API) | **Hoãn** | Cần session tường minh |
| UI (create, switcher, empty state) | **Hoãn** | Cần session tường minh |
| Routes `/w/[slug]/...` | **Hoãn** | Cần session tường minh |

### Đã land (Session 01 — 2026-07-16)

- [x] Enum `WorkspaceRole` (`OWNER` | `MEMBER`)
- [x] Model `Workspace` với `slug` unique
- [x] Model `Membership` nối `User` ↔ `Workspace` kèm role
- [x] Cascade delete khi xóa user/workspace
- [x] Index: unique `(userId, workspaceId)`; index `workspaceId`
- [x] Migration: `prisma/migrations/20260716062526_workspace_foundation/`
- [x] Docs: ADR-008, learning Prisma, explanations, review Session 01 (2026-07-20)

### Đã land (Session 02 — 2026-07-20)

- [x] `lib/workspace/validation.ts` — create `{ name, slug }`; update `{ name }` only
- [x] `lib/workspace/authz.ts` — `WorkspaceContext`, `requireWorkspaceContext`, `requireWorkspaceOwner`
- [x] `lib/workspace/index.ts` — public exports
- [x] Learning: `03-validation.md`, `05-authorization.md`

### Hoãn

- [ ] Create / list / get-by-slug / update / delete
- [ ] Dialog/form tạo workspace
- [ ] List / switcher workspace
- [ ] Empty state khi user chưa có workspace
- [ ] Route group `/w/[slug]` + layout

## User flow (mục tiêu sản phẩm)

1. Từ dashboard → Tạo workspace (name → slug)
2. Mở `/w/[slug]/...`
3. Đổi workspace từ sidebar/list
4. OWNER đổi tên/xóa (settings); MEMBER xem/đóng góp theo rule

## Business rules

- Người tạo trở thành `OWNER`
- Role: chỉ `OWNER` | `MEMBER`
- Slug unique; mọi query theo slug phải có membership
- Đoán slug mà không phải member → 403/404 (không leak tồn tại)

## UI requirements

- [ ] Dialog/form tạo workspace
- [ ] List / switcher
- [ ] Empty state zero workspaces

## API requirements

- [ ] Create / list / get-by-slug / update / delete
- [ ] Luôn verify membership phía server

## Database models

**Đã có trong `prisma/schema.prisma`:**

- `WorkspaceRole` — `OWNER`, `MEMBER`
- `Workspace` — `id` (cuid), `name`, `slug` (unique), `createdAt`; quan hệ `memberships`
- `Membership` — `id`, `userId`, `workspaceId`, `role`, `createdAt`; `@@unique([userId, workspaceId])`

**Chưa có:** projects, tasks, invites, entity khác scoped theo workspace.

## Validation rules

- Name: bắt buộc
- Slug: kebab lowercase, unique, URL-safe

> Validator: `lib/workspace/validation.ts` (Session 02). Uniqueness slug vẫn ở DB.

## Permission rules

| Action | OWNER | MEMBER |
|--------|-------|--------|
| Đọc workspace | ✓ | ✓ |
| Update / delete workspace | ✓ | ✗ |
| Invite members | ✓ | TBD |

> Helper sẵn: `requireWorkspaceContext` / `requireWorkspaceOwner`. Enforce trên CRUD/API vẫn chờ session sau.

## State management

- List: RSC hoặc TanStack Query
- Active slug: URL param (source of truth)

## Pending tasks

- [x] Prisma models + migrate
- [x] Tài liệu Session 01 (learning / ADR / explanations / review)
- [x] Zod + WorkspaceContext authz helpers (Session 02)
- [ ] CRUD + check membership server-side
- [ ] UI create + switcher + routes `/w/[slug]`

## Known issues

- Chưa có (ở tầng schema)

## Future improvements

- Custom roles, avatar workspace, transfer ownership

## Checklist

- [x] Prisma schema khớp hợp đồng (Workspace + Membership + roles)
- [x] Migration `workspace_foundation` apply sạch
- [x] Zod + WorkspaceContext authz (`lib/workspace`)
- [ ] Create + mở theo slug
- [ ] Non-member không đọc được (enforce trên CRUD/API)
- [ ] Chỉ OWNER được xóa (enforce trên CRUD/API)

## Tài liệu liên quan

- Lịch sử: `docs/explanations/workspace.md`
- ADR: `docs/decisions/ADR-008-workspace-membership-model.md`
- Học: `docs/learning/02-prisma.md`, `03-validation.md`, `05-authorization.md`
- Review: `docs/reviews/session-01-review.md`, `docs/reviews/session-02-review.md`
