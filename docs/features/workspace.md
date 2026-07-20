# Feature: Workspace

> **Trạng thái:** Đang làm — Phase 1 (Session 04: CRUD server đã land; chưa UI/routes)

## Mục tiêu feature

User đã đăng nhập tạo và chuyển workspace; mọi dữ liệu dự án được scope theo `slug` workspace kèm kiểm tra membership.

## Trạng thái triển khai

| Khu vực | Trạng thái | Ghi chú |
|---------|------------|---------|
| Prisma models + migration | **Đã land** | Session 01 — `20260716062526_workspace_foundation` |
| Zod validations (name, slug create; name-only update) | **Đã land** | Session 02 — `lib/workspace/validators.ts` |
| Membership authz helpers (WorkspaceContext) | **Đã land** | Session 02 — `lib/workspace/authz.ts` |
| CRUD (Server Actions) | **Đã land** | Session 04 — `app/actions/workspace/{queries,mutations}.ts` |
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

- [x] `lib/workspace/validators.ts` — create `{ name, slug }`; update `{ name }` only
- [x] `lib/workspace/authz.ts` — `WorkspaceContext`, `requireWorkspaceContext`, `requireWorkspaceOwner`
- [x] `lib/workspace/index.ts` — public exports
- [x] Learning: `03-validation.md`, `05-authorization.md`

### Đã land (Session 03 — 2026-07-20)

- [x] `lib/` Domain-Oriented Modules (ADR-010): `auth/`, `workspace/`, `shared/`
- [x] Rename quy ước `validators.ts`

### Đã land (Session 04 — 2026-07-20)

- [x] Queries: `listWorkspaces`, `getWorkspaceBySlug` — `app/actions/workspace/queries.ts`
- [x] Mutations: `createWorkspace`, `updateWorkspace`, `deleteWorkspace` — `app/actions/workspace/mutations.ts`
- [x] Create: `$transaction` Workspace + Membership `OWNER`
- [x] Delete: chỉ xóa Workspace (Membership Cascade)
- [x] `api-helpers`: map `NOT_FOUND`, `CONFLICT`
- [x] Learning: `06-server-actions.md`

### Hoãn

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
- Đoán slug mà không phải member → `NOT_FOUND` (không leak tồn tại)
- MEMBER update/delete → `FORBIDDEN`

## UI requirements

- [ ] Dialog/form tạo workspace
- [ ] List / switcher
- [ ] Empty state zero workspaces

## API requirements

- [x] Create / list / get-by-slug / update / delete (Server Actions)
- [x] Luôn verify membership phía server

## Database models

**Đã có trong `prisma/schema.prisma`:**

- `WorkspaceRole` — `OWNER`, `MEMBER`
- `Workspace` — `id` (cuid), `name`, `slug` (unique), `createdAt`; quan hệ `memberships`
- `Membership` — `id`, `userId`, `workspaceId`, `role`, `createdAt`; `@@unique([userId, workspaceId])`

**Chưa có:** projects, tasks, invites, entity khác scoped theo workspace.

## Validation rules

- Name: bắt buộc
- Slug: kebab lowercase, unique, URL-safe

> Validator: `lib/workspace/validators.ts`. Uniqueness slug vẫn ở DB (`CONFLICT` khi P2002).

## Permission rules

| Action | OWNER | MEMBER |
|--------|-------|--------|
| Đọc workspace | ✓ | ✓ |
| Update / delete workspace | ✓ | ✗ |
| Invite members | ✓ | TBD |

> Enforce trên Server Actions Session 04 qua `requireWorkspaceContext` / `requireWorkspaceOwner`.

## State management

- List: RSC hoặc TanStack Query (UI chưa land)
- Active slug: URL param (source of truth) — chờ routes

## Pending tasks

- [x] Prisma models + migrate
- [x] Tài liệu Session 01 (learning / ADR / explanations / review)
- [x] Zod + WorkspaceContext authz helpers (Session 02)
- [x] CRUD + check membership server-side (Session 04)
- [ ] UI create + switcher + routes `/w/[slug]`

## Known issues

- Chưa có (ở tầng schema + server CRUD)

## Future improvements

- Custom roles, avatar workspace, transfer ownership

## Checklist

- [x] Prisma schema khớp hợp đồng (Workspace + Membership + roles)
- [x] Migration `workspace_foundation` apply sạch
- [x] Zod + WorkspaceContext authz (`lib/workspace`)
- [x] Create + đọc theo slug (Server Actions)
- [x] Non-member không đọc được (enforce trên actions)
- [x] Chỉ OWNER được xóa (enforce trên actions)
- [ ] UI create + switcher + `/w/[slug]`

## Tài liệu liên quan

- Lịch sử: `docs/explanations/workspace.md`
- ADR: `docs/decisions/ADR-008-workspace-membership-model.md`, `ADR-010-domain-oriented-module-architecture.md`
- Học: `docs/learning/01-project-structure.md`, `02-prisma.md`, `03-validation.md`, `05-authorization.md`, `06-server-actions.md`
- Review: `docs/reviews/session-01-review.md` … `session-04-review.md`
