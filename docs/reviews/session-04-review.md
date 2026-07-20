# Review Session 04 — Workspace CRUD (server)

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `app/actions/workspace/queries.ts` — `listWorkspaces`, `getWorkspaceBySlug`
- `app/actions/workspace/mutations.ts` — `createWorkspace`, `updateWorkspace`, `deleteWorkspace`
- `lib/shared/api-helpers.ts` — map thêm `NOT_FOUND` (404), `CONFLICT` (409)
- Docs: feature, explanation append, learning `06-server-actions.md`, SESSION, NEXT_SESSION

**Không** có: UI, route `/w/[slug]`, đổi schema/migration, ADR mới, `ActionResult`, actions trong `lib/workspace/`.

## Làm tốt

- Tách **domain** (`lib/workspace`) vs **execution** (`app/actions`) — đúng chỉnh sửa Design Review
- Queries / mutations tách file — dễ mở rộng
- Create atomic qua `$transaction` + OWNER membership
- Delete chỉ Workspace — Cascade lo Membership
- Error codes thống nhất với Session 02 (`UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND`)
- Unique slug → `CONFLICT` từ Prisma `P2002`

## Cải thiện có thể (chưa bắt buộc)

- UI session: catch error codes → toast / form message (đặc biệt validation message thô)
- Unit/integration test authz paths khi có test harness
- Cân nhắc mã `VALIDATION` riêng nếu muốn map 400 ổn định qua `api-helpers`

## Code smells

- Validation fail throw **string message** Zod thay vì mã cố định — chấp nhận được khi chưa có UI caller thống nhất
- Chưa có barrel `app/actions/workspace/index.ts` — import path tường minh ổn

## Architecture quality

**Đúng hướng ADR-010.** Domain không bị nhiễm `"use server"`. Execution layer mỏng, ủy quyền cho authz/validators đã có.

## Maintainability

Hai file action, đọc theo use-case. Public surface rõ: 2 query + 3 mutation.

## Scalability

List theo `userId` + include workspace đủ Phase 1. Khi nhiều membership có thể paginate sau — chưa cần.

## Performance

Create = 2 write trong 1 transaction. Get-by-slug = 1 query authz đã tối ưu Session 02. Ổn.

## Security

- Mọi entry gọi `requireUser`
- Slug-scoped đọc/ghi qua `requireWorkspaceContext` / `requireWorkspaceOwner`
- Non-member → `NOT_FOUND` (không enumeration)
- MEMBER không update/delete

**Lưu ý:** chưa có UI/route gắn action — bảo vệ đúng trên hàm; session sau không được bypass bằng Prisma trong page.

## Testing considerations

Nên cover khi có test:

- Create → membership OWNER tồn tại
- List không trả workspace ngoài membership
- Non-member get → `NOT_FOUND`
- MEMBER update/delete → `FORBIDDEN`
- Slug trùng → `CONFLICT`
- Delete workspace → membership biến mất (Cascade)

## Sống được với 100k users?

**Logic: có.** Bottleneck thật ở DB/connection khi UI poll list — chưa phải lúc này.

## Technical debt đã giới thiệu / giữ

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Chưa có UI gắn action | TB (chủ đích) | Session routes/UI |
| Validation error không mã hóa | Thấp | Khi standardize form errors |
| Chưa có test tự động | TB | Khi CRUD có CI test |

## Nên refactor sau?

- Không đổi vị trí actions trừ khi ADR mới
- Không nâng Clean Architecture

## Câu hỏi phỏng vấn

1. Vì sao Server Actions không nằm trong `lib/workspace/`?
2. `NOT_FOUND` vs `FORBIDDEN` khác nhau thế nào với workspace slug?
3. Vì sao delete không xóa Membership thủ công?

## Bài tập cho learner

1. Đọc `mutations.ts` và vẽ sequence create (auth → zod → transaction)
2. Viết pseudo Client form gọi `createWorkspace` và map `CONFLICT` ra message

## Learning summary

Session 04 dạy: **execution layer** (Server Actions) gọi **domain** (validators + authz); tách query/mutation; transaction cho create owner; Cascade cho delete; error bằng throw mã thống nhất — chưa cần `ActionResult`.
