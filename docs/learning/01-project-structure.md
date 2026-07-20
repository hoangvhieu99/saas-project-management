# Cấu trúc dự án (Project Structure)

> Dành cho Junior Developer. Không giả định bạn đã biết Next.js hay monorepo.

## Đây là gì?

**Cấu trúc dự án** là cách tổ chức thư mục và file trong repo — nơi đặt code UI, database, docs, cấu hình.

Trong dự án này ta dùng **một repo full-stack** (Next.js App Router + Prisma), không tách frontend/backend riêng.

## Tại sao cần quan tâm?

Nếu không biết “file này nên nằm ở đâu”, bạn sẽ:

- Copy-paste lung tung
- Trộn UI với logic DB
- Khó review, khó onboard thành viên mới

Cấu trúc tốt = **tìm đúng chỗ trong vài giây**.

## Khi nào dùng cấu trúc này?

- SaaS portfolio / product nhỏ–vừa trên Next.js
- Team nhỏ, muốn deploy một chỗ (Vercel)

## Khi nào KHÔNG dùng?

- Microservice nhiều team (cần tách service)
- Mobile app riêng + API riêng từ ngày đầu (có thể vẫn share Prisma schema, nhưng repo khác)

## Sơ đồ thư mục (rút gọn)

```
SaaS-Project-Management/
├── app/                 # Next.js App Router (pages, layouts, route handlers)
├── components/
│   ├── features/        # UI theo feature (auth, workspace, …)
│   └── ui/              # primitives
├── lib/                 # Domain modules + shared infra (ADR-010)
│   ├── auth/            # NextAuth, requireUser, login/register Zod
│   ├── workspace/       # WorkspaceContext authz + Zod
│   └── shared/          # db, api-*, utils (cn, slugify) — không business
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/                # SSOT (SESSION, learning, decisions, …)
└── cursor/rules/
```

## `lib/` — Domain vs Shared

| Đặt ở đâu | Ví dụ |
|-----------|--------|
| `lib/<domain>/` | `validators.ts`, `authz.ts` của Auth / Workspace / Project sau này |
| `lib/shared/` | `db.ts`, `api-helpers.ts`, `utils.ts` |
| **Không** đặt | Business rule trong `shared/`; túi `validations/` chung mọi domain |

## Ví dụ trong dự án này

| Muốn làm gì | Đi đâu |
|-------------|--------|
| Thêm bảng Workspace | `prisma/schema.prisma` + migration |
| Schema Zod workspace | `lib/workspace/validators.ts` |
| requireUser | `lib/auth/authz.ts` |
| Biết session đang làm gì | `docs/SESSION.md` |
| Vì sao Domain Modules | `docs/decisions/ADR-010-*.md` |
| Học Prisma | `docs/learning/02-prisma.md` |

## Luồng đọc khi bắt đầu task

```
docs/SESSION.md
       │
       ▼
docs/features/<feature>.md
       │
       ▼
docs/explanations/<feature>.md
       │
       ▼
Chỉ sửa các file trong "Files Allowed"
```

## Ưu điểm

- Một nguồn sự thật (SSOT) cho AI và người
- Junior onboard được qua docs, không chỉ qua chat

## Nhược điểm

- Phải discipline cập nhật docs mỗi session (tốn thời gian ngắn hạn)

## Lỗi thường gặp

1. Code xong rồi “mai viết docs” → docs chết
2. Quét cả repo thay vì đọc SESSION trước
3. Đặt business logic trong component UI

## Câu hỏi phỏng vấn

1. App Router khác Pages Router chỗ nào?
2. Vì sao tách `lib/` khỏi `components/`?
3. Migration khác gì so với chỉ sửa schema?

## Best practices

- Một session = một goal = cập nhật docs trước khi STOP
- Không xóa giải thích cũ trong `explanations/` — chỉ append
- Tên thư mục ổn định; tránh rename hàng loạt không cần thiết

## Đọc thêm

- `docs/ARCHITECTURE.md`
- `docs/decisions/ADR-010-domain-oriented-module-architecture.md`
- `docs/learning/02-prisma.md`
- Next.js App Router docs (chính thức)
