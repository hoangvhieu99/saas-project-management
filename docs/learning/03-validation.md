# Validation với Zod

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 02 — Workspace validation + authz**.

## Đây là gì?

**Zod** là thư viện mô tả và kiểm tra shape của dữ liệu bằng TypeScript schema. Input không hợp lệ → lỗi có cấu trúc; hợp lệ → data đã parse (và thường đã trim/coerce theo rule).

## Tại sao tồn tại?

Browser và API đều gửi “string / object tự do”. Database và business rule cần hợp đồng chặt.

```
Form / Server Action / API body
        │
        ▼
   Zod schema.safeParse()
        │
   OK ──┴── Fail → 400 (khi có API)
        │
        ▼
   Logic nghiệp vụ / Prisma
```

## Vì sao cần trong dự án này?

Workspace có `name` (hiển thị) và `slug` (URL). Sai format slug (chữ hoa, space, ký tự lạ) sẽ làm hỏng routing `/w/[slug]` sau này. Validate **trước** khi viết CRUD.

Schema Workspace nằm tại `lib/workspace/validators.ts` — theo domain (ADR-010), không nhét vào túi validations chung.

## Ưu điểm

- Một schema dùng chung form (RHF) và server
- Infer type (`z.infer`) — ít lệch type tay
- Message lỗi rõ từng field

## Nhược điểm

- Không thay được ràng buộc DB (`@unique` vẫn cần)
- Rule quá phức tạp trong Zod → khó đọc; nên giữ schema mỏng

## Trade-offs

| Được | Mất |
|------|-----|
| Hợp đồng input sớm | Session CRUD vẫn phải bắt lỗi unique slug từ Prisma |
| Domain folder rõ | Auth schemas ở `lib/auth/validators.ts` (Session 03) |

## Ví dụ THẬT — Session 02

```ts
// lib/workspace/validators.ts (rút gọn ý)
createWorkspaceSchema  // { name, slug }
updateWorkspaceSchema  // { name } — chỉ đổi tên; không đổi slug trong session này
```

Slug: kebab-case lowercase, độ dài 3–48. Name: trim, 1–80 ký tự.

## Lỗi thường gặp

1. Chỉ validate ở client → bỏ qua được bằng gọi API trực tiếp  
2. Nhầm Zod unique với DB unique  
3. Cho phép đổi slug sớm mà chưa có redirect/migration URL

## Câu hỏi phỏng vấn

1. Zod và TypeScript type khác nhau chỗ nào?  
2. Vì sao Server Action vẫn cần `safeParse` dù form đã validate?  
3. Khi nào dùng `.trim()` trên schema?

## Bài tập

1. Viết thêm test case mental: `"My Team"` / `"my-team"` / `"My-Team"` — cái nào pass slug schema?  
2. Giải thích vì sao `updateWorkspaceSchema` không có `slug`.
