# ADR-008: Mô hình Workspace + Membership (multi-tenant mỏng)

## Status

Accepted — 2026-07-16 (Session 01)

## Context

SaaS quản lý dự án cần **đa không gian làm việc**: một user thuộc nhiều team/workspace; mọi dữ liệu sau này (project, task…) phải được scope theo workspace.

Auth đã có (`User`). Chưa có cách biểu diễn “user X thuộc workspace Y với role Z”.

## Problem

Làm sao thiết kế schema tối thiểu nhưng đúng để:

1. Tạo/định danh workspace bằng `slug` (URL)
2. Gán user vào workspace kèm quyền
3. Chặn user đoán slug của workspace người khác (nền tảng cho authz session sau)
4. Không over-engineer RBAC / billing / invite ngay Phase 1

## Decision

Thêm vào Prisma:

1. `enum WorkspaceRole { OWNER, MEMBER }`
2. `model Workspace` — `id` (cuid), `name`, `slug` (@unique), `createdAt`
3. `model Membership` — nối `User` ↔ `Workspace`, có `role`, `@@unique([userId, workspaceId])`, `@@index([workspaceId])`, `onDelete: Cascade` cả hai phía

Migration: `20260716062526_workspace_foundation`.

**Chưa** thêm: Project, Task, Invite, custom roles, soft delete.

## Why this solution?

- **Membership là pattern chuẩn** multi-tenant: tách “không gian” khỏi “người”, role nằm trên quan hệ
- **2 role** đủ cho portfolio MVP (khớp ADR-002)
- **slug unique** phục vụ routing `/w/[slug]` sau này
- **Cascade** giữ DB sạch khi xóa user hoặc workspace
- **Session chỉ schema** → review được foundation trước CRUD/UI

## Alternatives considered

| Phương án | Mô tả ngắn |
|-----------|------------|
| A. `ownerId` trên Workspace, không bảng Membership | Đơn giản hơn |
| B. RBAC đầy đủ (Permission table, custom roles) | Linh hoạt hơn |
| C. Dùng Clerk Organizations / SaaS multi-tenant sẵn | Nhanh về product |
| D. Nhúng members dạng JSON trên Workspace | Ít bảng |

## Why alternatives were rejected

- **A:** Không scale khi nhiều member + role; list “workspace của tôi” khó/query xấu
- **B:** Scope creep Phase 1; mentorship cần độ sâu vừa đủ, không phải IdP enterprise
- **C:** Lệ thuộc vendor, khó kể chuyện “tự build authz” trong portfolio
- **D:** Mất ràng buộc DB, khó index, khó integrity

## Pros

- Rõ ràng, dễ dạy Junior
- Nền tảng authz: “có Membership mới được vào”
- Index + unique đúng chỗ cho query thường gặp

## Cons

- Mọi query sau này phải nhớ join/check Membership (dễ quên nếu thiếu helper)
- Cascade có thể xóa nhiều dữ liệu liên quan khi xóa workspace (cần UX cảnh báo sau)

## Trade-offs

| Được | Mất |
|------|-----|
| Đơn giản, ship được | Chưa có invite/transfer ownership |
| 2 role dễ hiểu | Đổi role model sau sẽ cần migration |
| SQLite local (ADR-006) | Phải cẩn thận khi chuyển Postgres |

## Future impact

- Mọi bảng nghiệp vụ mới **bắt buộc** có `workspaceId` + kiểm tra membership
- Session 02 sẽ thêm Zod + authz helpers dựa trên model này
- Invite / custom role = Future Improvement, không làm lén trong session CRUD

## Related files

- `prisma/schema.prisma` — `WorkspaceRole`, `Workspace`, `Membership`
- `prisma/migrations/20260716062526_workspace_foundation/migration.sql`
- `docs/features/workspace.md`
- `docs/explanations/workspace.md`
- `docs/learning/02-prisma.md`

## Example usage

(Chưa có trong app — chỉ minh họa Client sau này:)

```ts
// Pseudo — Session CRUD sau này
await prisma.membership.findFirst({
  where: { userId, workspace: { slug } },
});
// null → 403/404, không trả data workspace
```

## References

- ADR-002 (MVP scope / OWNER|MEMBER)
- ADR-006 (SQLite local)
- ADR-007 (Phase 0 freeze — workspace chỉ mở khi có session tường minh)
