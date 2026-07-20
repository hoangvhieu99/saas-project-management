# Review Session 02 — Workspace validation + authz

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `lib/workspace/validation.ts` — Zod: name, slug, create, update (name only)
- `lib/workspace/authz.ts` — `WorkspaceContext`, `requireWorkspaceContext`, `requireWorkspaceOwner`
- `lib/workspace/index.ts` — barrel exports
- Docs: SESSION, learning 03 + 05, explanations append, features cập nhật

**Không** có: ADR mới, CRUD, UI, API, routes, sửa `api-helpers`, migrate Auth/shared.

## Làm tốt

- Scope session **chặt** — đúng “domain seed only”, không kéo architecture refactor
- API authz **Workspace-centric** (`WorkspaceContext`) thay vì lộ `getMembership*` — đúng mental model caller
- Update schema chỉ `name` — tránh nợ đổi slug chưa có redirect
- Authz nhận `userId` từ ngoài — tách AuthN/AuthZ, dễ test sau
- NOT_FOUND cho non-member/missing — đúng hướng chống enumeration (map HTTP để session API)

## Cải thiện có thể (chưa bắt buộc)

- Session API: map `NOT_FOUND` / `FORBIDDEN` trong `handleApiError`
- Session refactor: đưa Auth vào `lib/auth/`, shared vào `lib/shared/` (hybrid hiện tại chấp nhận được)
- Khi có CRUD: unit test schema + authz với DB test

## Code smells

- Chưa có smell nghiêm trọng trong module mới
- **Rủi ro quy ước:** Junior vẫn có thể thêm schema Workspace vào `lib/validations` cũ — docs đã nhắc dùng `lib/workspace`

## Architecture quality

**Tốt cho bước chuyển tiếp.** Seed domain đúng hướng rule folder-by-domain mà không phá Phase 0 tree. Hybrid Auth-flat / Workspace-domain là nợ có chủ đích, không phải tai nạn.

## Maintainability

Ba file, đọc nhanh. Public surface nhỏ (`requireWorkspaceContext`, `requireWorkspaceOwner` + schemas).

## Scalability

Helper theo slug đủ cho Phase 1. Sau này có thể thêm `requireWorkspaceContextById` nếu hot path dùng id nội bộ — chưa cần.

## Performance

Một query `membership.findFirst` + include workspace — ổn. Tránh N+1 bằng trả đủ context.

## Security

- Nền tảng authz **có**, nhưng **chưa gắn** request path → chưa bảo vệ end-to-end
- Chiến lược lỗi đúng hướng; chưa expose qua HTTP trong session này (cố ý)

## Testing considerations

Nên có khi CRUD vào:

- Slug `"My-Team"` / `"ab"` / `"a".repeat(49)` fail schema
- Non-member → `NOT_FOUND`
- MEMBER gọi `requireWorkspaceOwner` → `FORBIDDEN`
- OWNER → ok

## Sống được với 100k users?

**Helpers: có.** Bottleneck thật ở session/DB connection khi có traffic path — chưa phải lúc này.

## Technical debt đã giới thiệu / giữ

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Hybrid flat Auth + domain Workspace | Thấp–TB | Session architecture refactor |
| `NOT_FOUND` chưa map trong api-helpers | Thấp | Session API |
| Chưa có test tự động | TB | Khi CRUD/CI |

## Nên refactor sau?

- Có: session riêng migrate Auth/shared — **không** nhét vào CRUD
- Không: đổi `WorkspaceContext` trừ khi product đòi permission matrix

## Câu hỏi phỏng vấn

1. Vì sao API authz nên trả WorkspaceContext thay vì chỉ Membership?
2. AuthN (`requireUser`) và AuthZ (`requireWorkspaceContext`) tách thế nào?
3. Vì sao Session 02 cố ý không sửa `api-helpers`?

## Bài tập cho learner

1. Đọc `lib/workspace/authz.ts` và giải thích đường đi của một slug không tồn tại
2. Viết pseudo Server Action create workspace dùng `createWorkspaceSchema` + tạo Membership OWNER (không merge)

## Learning summary

Session 02 dạy: **đặt validation + authz trước CRUD**, group theo domain folder khi có business logic mới, giữ session nhỏ bằng cách **hoãn** architecture migrate. An toàn thật sự chỉ đến khi mọi path dữ liệu gọi `requireWorkspaceContext` / `requireWorkspaceOwner`.
