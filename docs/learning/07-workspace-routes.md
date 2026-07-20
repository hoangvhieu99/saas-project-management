# Dynamic route `/w/[slug]` + layout membership gate

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 05 — Workspace UI + routes**.

## Đây là gì?

Trong App Router, `[slug]` là **dynamic segment** — URL như `/w/acme-team` map vào thư mục `app/(app)/w/[slug]/`.

**Layout** của segment đó chạy cho mọi trang con. Đặt **membership gate** ở đây = kiểm tra quyền **trước** khi render nội dung workspace.

## Tại sao tồn tại?

Workspace dùng `slug` làm định danh công khai (ADR-008). User có thể đoán URL của workspace người khác. Gate server ở layout đảm bảo:

- Member → xem được shell
- Non-member / slug không tồn tại → cùng xử lý `notFound()` (không leak “workspace có tồn tại”)

## Pattern trong repo này

```
app/(app)/w/[slug]/
  layout.tsx   # gọi getWorkspaceBySlug → NOT_FOUND → notFound()
  page.tsx     # shell tối thiểu (tên, role)
```

Layout **không** tin UI sidebar. Switcher chỉ là điều hướng; authz thật nằm ở Server Action / authz helpers.

## Duplicate fetch layout + page

Session 05 chấp nhận layout và page đều có thể gọi `getWorkspaceBySlug` (2 query). Đơn giản, đủ MVP. Có thể bọc `React.cache` sau nếu cần.

## UI gắn actions

| UI | Action |
|----|--------|
| Create form/dialog | `createWorkspace` |
| Switcher / dashboard list | `listWorkspaces` |
| Layout gate + page | `getWorkspaceBySlug` |

Sau create: `revalidatePath` (server) + `router.refresh()` (client) để sidebar/list cập nhật.

## CONFLICT slug

Slug trùng → action throw `CONFLICT`. Form phải:

1. Toast rõ (“Slug already taken”) + **gợi ý** slug khác (ví dụ `slug-2`)
2. `setError` trên field slug — không chỉ báo lỗi suông

## Anti-patterns

| Sai | Đúng |
|-----|------|
| Chỉ ẩn link nếu không phải member | Gate layout + action |
| Prisma trong `page.tsx` | Gọi Server Action |
| Nuốt `CONFLICT` bằng toast chung | Toast + suggestion + field error |
| Active workspace trong Zustand | URL `slug` là source of truth |

## File liên quan

- `app/(app)/w/[slug]/layout.tsx`, `page.tsx`
- `components/features/workspace/*`
- `app/actions/workspace/{queries,mutations}.ts`

## Câu hỏi tự kiểm

1. Vì sao non-member nên nhận `notFound` thay vì trang “Forbidden” riêng?
2. Active workspace lấy từ đâu — store hay URL?
3. `revalidatePath` sau create giải quyết vấn đề gì với sidebar?
