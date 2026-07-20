# Review Session 05 — Workspace UI + routes `/w/[slug]`

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- Route group `app/(app)/w/[slug]/` — `layout.tsx` (membership gate) + `page.tsx` (shell)
- UI: create form/dialog, switcher, empty state — `components/features/workspace/`
- Shell: sidebar gắn switcher + CTA tạo; Dashboard list / empty state
- `createWorkspace`: `revalidatePath` sau thành công
- Form: `CONFLICT` → toast + gợi ý slug + field error
- Docs: feature, explanation, learning `07-workspace-routes.md`, ARCHITECTURE, SESSION, NEXT

**Không** có: update/delete UI, Dashboard widgets, Profile, Kanban/Calendar, schema/migration, ADR mới.

## Làm tốt

- Gate server ở layout trước `children` — khớp risk “quên authz”
- Tái sử dụng Server Actions Session 04 — không Prisma trong page
- CONFLICT UX đủ rõ (toast description + suggestion), không nuốt lỗi
- `revalidatePath` + `router.refresh` sau create — list/switcher không stale
- Domain UI đúng chỗ (`components/features/workspace`)

## Cải thiện có thể (chưa bắt buộc)

- Dedupe layout + page fetch bằng `React.cache`
- Dialog primitive dùng chung (hiện overlay tối giản)
- `listWorkspaces` gọi cả shell và dashboard — có thể truyền từ một nguồn sau

## Code smells

- Dialog custom (không Radix) — chấp nhận được Phase 1; a11y cơ bản (aria-modal, label)
- Dashboard và AuthenticatedShell đều list — duplicate query có chủ đích theo Design Review

## Architecture quality

**Khớp ADR-010 + ARCHITECTURE planned tree.** Execution vẫn ở actions; UI chỉ gọi actions; URL slug = active workspace.

## Maintainability

Bốn component workspace nhỏ, trách nhiệm rõ (form / dialog / switcher / empty).

## Scalability

List membership trong shell mỗi request authenticated — ổn Phase 1; sau này có thể cache ngắn hoặc pass từ layout RSC duy nhất.

## Performance

Gate + page = 2× get-by-slug trên `/w/[slug]` — chấp nhận MVP.

## Security

- Non-member → `notFound()` (không enumeration UI)
- Mọi đọc/ghi vẫn qua actions + authz
- Không wire delete/rename trên UI (giảm bề mặt nhầm OWNER)

## Testing considerations (thủ công Session 05)

1. **Member:** user A tạo workspace → vào `/w/{slug}` thấy shell; switcher hiện workspace đó.
2. **Non-member:** user B (đã login) mở `/w/{slug}` của A → trang 404 / not found, không lộ nội dung.
3. **CONFLICT:** tạo workspace với slug đã tồn tại → toast + gợi ý + lỗi field slug.
4. **Empty:** user chưa có workspace → Dashboard empty state + CTA create.

## Sống được với 100k users?

Shell + list theo user đủ. Bottleneck chưa phải lúc này.

## Technical debt đã giới thiệu / giữ

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Duplicate get-by-slug layout/page | Thấp | Khi cần cache |
| Custom dialog | Thấp | Khi thêm Dialog primitive |
| Chưa update/delete UI | Chủ đích | Settings session |

## Nên refactor sau?

- Không nâng Clean Architecture
- Có thể gom fetch list một lần ở `(app)/layout` path nếu đo được waste

## Câu hỏi phỏng vấn

1. Vì sao membership gate đặt ở layout thay vì chỉ Client Component?
2. `revalidatePath` khác `router.refresh` thế nào?
3. Vì sao CONFLICT cần gợi ý slug, không chỉ “error”?

## Bài tập cho learner

1. Đọc `w/[slug]/layout.tsx` và giải thích nhánh `UNAUTHORIZED` vs `NOT_FOUND`
2. Thử tạo hai workspace cùng slug và mô tả UX

## Learning summary

Session 05 dạy: **dynamic route + layout gate**, gắn Server Actions vào UI feature-based, xử lý CONFLICT có hướng dẫn, và revalidate sau mutation để shell đồng bộ.
