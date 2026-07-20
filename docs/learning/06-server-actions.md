# Server Actions trong App Router

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 04 — Workspace CRUD (server)**.

## Đây là gì?

**Server Action** là hàm JavaScript chạy **trên server**, được đánh dấu `"use server"`, và có thể gọi từ Server Component hoặc Client Component (form / event).

Khác Route Handler (`app/api/.../route.ts`): không bắt buộc HTTP method + URL công khai; gọi như hàm TypeScript.

## Tại sao tồn tại?

Form và mutation trong Next.js App Router cần một cách **an toàn** để đổi dữ liệu mà không tự viết REST cho mọi thao tác nội bộ. Server Actions là execution layer mặc định cho use-case đó.

## Vì sao cần trong dự án này?

Session 04 land CRUD Workspace **chưa có UI**. Đặt mutation/query ở Server Actions để:

1. UI session sau (`dialog` tạo workspace, switcher) gọi thẳng hàm — không phải viết `fetch('/api/...')` rồi mới wire form
2. Giữ `lib/workspace/` chỉ chứa **domain** (Zod, authz) — không nhét `"use server"` vào domain module

## Quy ước trong repo này

| Tầng | Ví dụ | Trách nhiệm |
|------|--------|-------------|
| Domain | `lib/workspace/validators.ts`, `authz.ts` | Hợp đồng input + cửa quyền |
| Execution | `app/actions/workspace/queries.ts`, `mutations.ts` | `requireUser` → validate/authz → Prisma |
| HTTP helper | `lib/shared/api-helpers.ts` | Map `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` / `CONFLICT` → status (khi dùng Route Handler) |

**Không** đặt Server Actions trong `lib/workspace/` — đó là domain, không phải execution.

## Queries vs Mutations

Session 04 tách cố ý:

- **Queries** — `listWorkspaces`, `getWorkspaceBySlug` (đọc)
- **Mutations** — `createWorkspace`, `updateWorkspace`, `deleteWorkspace` (ghi)

Dễ review, dễ mở rộng (thêm query/mutation mà không phình một file God).

## Error model (thống nhất project)

Không dùng `ActionResult`. Giống authz:

```ts
throw new Error("UNAUTHORIZED"); // chưa login
throw new Error("FORBIDDEN");    // member nhưng không đủ role
throw new Error("NOT_FOUND");    // thiếu resource / non-member (không leak)
throw new Error("CONFLICT");     // ví dụ slug trùng (Prisma P2002)
```

Caller (UI sau này, hoặc `handleApiError`) quyết định toast / redirect / JSON status.

## Create atomic

`createWorkspace` dùng `prisma.$transaction()`:

1. Tạo `Workspace`
2. Tạo `Membership` role `OWNER` cho user hiện tại

Hỏng giữa chừng → rollback cả hai.

## Delete và Cascade

`deleteWorkspace` **chỉ** `prisma.workspace.delete(...)`.  
Membership biến mất nhờ `onDelete: Cascade` trên schema — không xóa membership thủ công.

## Ưu điểm

- Type-safe call site; ít boilerplate HTTP
- Chạy server-only → secret / Prisma không lộ client
- Khớp form Next.js (`action={createWorkspace}`)

## Nhược điểm / lưu ý

- Khó `curl` như REST — smoke test bằng code hoặc UI
- Phải nhớ mọi action vẫn là **public entry** nếu export — luôn `requireUser` + authz
- Validation fail hiện throw message Zod (chưa có mã `VALIDATION` riêng)

## Anti-patterns

| Sai | Đúng |
|-----|------|
| Prisma trực tiếp trong Client Component | Gọi Server Action |
| Authz chỉ ở UI (ẩn nút) | `requireWorkspaceOwner` trên mutation |
| Nhét `"use server"` vào `lib/workspace/` | `app/actions/workspace/...` |
| Xóa Membership rồi mới xóa Workspace | Chỉ xóa Workspace (Cascade) |

## File liên quan

- `app/actions/workspace/queries.ts`
- `app/actions/workspace/mutations.ts`
- `lib/workspace/authz.ts`, `validators.ts`
- `lib/shared/api-helpers.ts`

## Câu hỏi tự kiểm

1. Domain và execution layer khác nhau thế nào trong repo này?
2. Vì sao create phải transaction?
3. Non-member gọi `getWorkspaceBySlug` nên nhận lỗi gì — và vì sao không `FORBIDDEN`?
