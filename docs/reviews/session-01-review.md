# Review Session 01 — Workspace Prisma foundation

> Góc nhìn Senior Engineer / Tech Lead. Ngày review docs: 2026-07-20 (backfill tài liệu tiếng Việt).

## Đã triển khai gì?

- `WorkspaceRole` enum (`OWNER`, `MEMBER`)
- Model `Workspace` (`id`, `name`, `slug` unique, `createdAt`)
- Model `Membership` (FK user + workspace, role, unique cặp user/workspace, index `workspaceId`, cascade)
- Migration `20260716062526_workspace_foundation`

**Không** có: validation Zod, authz helpers, CRUD, UI, routes.

## Làm tốt

- Scope session **rất chặt** — đúng “DB foundation only”
- Multi-tenant mỏng đúng pattern (Membership, không nhét JSON)
- Unique + index đúng cho use case URL slug và list-by-workspace
- Cascade rõ ràng, dễ giải thích cho Junior
- Khớp ADR-002 (chỉ 2 role)

## Cải thiện có thể (chưa bắt buộc ngay)

- Thêm `updatedAt` trên Workspace khi tới session update settings
- Chuẩn hóa slug ở DB bằng check constraint (SQLite hạn chế) → ưu tiên validate ở Zod Session 02
- Document rõ chiến lược 403 vs 404 khi không có membership (tránh user enumeration) — làm ở authz session

## Code smells

- Chưa có smell trong app code vì chưa có application layer — **rủi ro tương lai**: query Workspace by slug mà quên join Membership

## Architecture quality

**Tốt cho Phase 1.** Đây là đúng lớp nền. Chưa có leak kiến trúc vì chưa có API lộ dữ liệu.

## Maintainability

Schema ngắn, đọc được trong < 1 phút. Junior có thể nắm qua `docs/learning/02-prisma.md`.

## Scalability

- Index `workspaceId` đủ cho list members giai quy mô nhỏ–vừa
- Ở ~100k users: cần theo dõi cardinality membership; vẫn ổn nếu mọi query workspace-scoped có `workspaceId` và authz helper bắt buộc
- Bottleneck thật sự chưa xuất hiện (chưa có traffic path)

## Performance

Không có query production. Migration nhẹ. Không concern lúc này.

## Security

- Schema **tạo điều kiện** cho authz đúng, nhưng **chưa enforce** — chưa an toàn ở tầng app
- Cascade delete: xóa workspace sẽ xóa memberships; khi có Project/Task phải thiết kế cascade/soft-delete cẩn thận để không mất dữ liệu oan

## Testing considerations

Session này nên có (sau / khi CRUD vào):

- Migration apply clean trên DB trống
- Không insert được 2 membership trùng `(userId, workspaceId)`
- Không tạo 2 workspace cùng slug

Chưa có test tự động trong session — **nợ kiểm thử** chấp nhận được ở foundation, phải trả khi có Server Actions.

## Sống được với 100k users?

**Schema: có thể.**  
**Hệ thống hiện tại: chưa** — thiếu authz, caching, connection pooling Postgres, v.v.  
100k users không chỉ là số row; là path nóng + index + rate limit + multi-instance.

## Ở hệ thống lớn hơn sẽ đổi gì?

- Soft delete / audit log cho Workspace
- Role model mở rộng hoặc permission table
- Row Level Security (Postgres RLS) bổ sung cho defense in depth
- Invite token, SSO org, billing seat = bảng riêng

## Technical debt đã giới thiệu

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Chưa có authz helpers | Cao (nếu ai đó thêm CRUD sớm) | Session 02 |
| Chưa có Zod slug rules | Trung bình | Session 02 |
| SQLite vs Postgres parity | Đã biết (ADR-006) | Trước deploy |
| Chưa có test migration/constraints | Thấp–TB | Khi có CI test DB |

## Nên refactor sau?

- Không refactor schema Membership trừ khi product đòi custom roles
- Khi thêm Project/Task: **không** quên `workspaceId` + cascade policy

## Câu hỏi phỏng vấn (liên quan session)

1. Vì sao cần bảng Membership thay vì `ownerId`?
2. `@@unique([userId, workspaceId])` bảo vệ invariant nào?
3. Phân biệt authentication vs authorization trong multi-tenant SaaS?
4. Cascade delete nguy hiểm thế nào với dữ liệu nghiệp vụ?

## Bài tập cho learner

1. Vẽ lại ERD User–Membership–Workspace từ memory
2. Viết pseudo-code `assertCanAccessWorkspace(userId, slug)` (chưa cần merge)
3. Liệt kê 3 cách một Junior có thể vô tình leak workspace người khác khi viết API

## Learning summary

Session 01 dạy: **đặt hợp đồng dữ liệu trước khi viết UI**, dùng Membership cho multi-tenant, giữ scope session nhỏ để review được. Nền tảng đúng; an toàn thật sự chỉ đến khi Session authz + CRUD enforce membership trên mọi path.
