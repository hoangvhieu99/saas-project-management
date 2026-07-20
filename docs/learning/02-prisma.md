# Prisma — ORM và mô hình dữ liệu

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu khái niệm này: **Session 01 — Workspace foundation**.

## Đây là gì?

**Prisma** là ORM (Object-Relational Mapper): bạn mô tả dữ liệu bằng file `schema.prisma`, Prisma sinh:

1. **Migration SQL** — thay đổi database có kiểm soát
2. **Prisma Client** — API TypeScript để đọc/ghi DB an toàn kiểu

Bạn không viết SQL tay cho mọi CRUD cơ bản (vẫn có thể dùng raw SQL khi cần).

## Tại sao tồn tại?

Frontend thường nghĩ “object JSON”. Database nghĩ “bảng + quan hệ + ràng buộc”.

Prisma là cầu nối:

```
Component / Server Action
        │
        ▼
  Prisma Client (TypeScript)
        │
        ▼
     Database (SQLite local / Postgres prod)
```

## Khi nào dùng?

- App Next.js cần Postgres/SQLite
- Muốn type-safe queries
- Team muốn migration review được trên Git

## Khi nào KHÔNG dùng?

- Chỉ static site, không có DB
- Hệ thống đã khóa cứng SQL phức tạp / stored procedure dày đặc (Prisma vẫn dùng được nhưng lợi ích giảm)
- Tooling cực kỳ đặc thù mà team đã chuẩn hóa quanh Knex/Drizzle — không đổi ORM “cho vui”

## Khái niệm cốt lõi

| Khái niệm | Ý nghĩa đơn giản |
|-----------|------------------|
| `model` | Một bảng (hoặc entity) |
| `enum` | Tập giá trị cố định (vd. OWNER / MEMBER) |
| `@id` | Khóa chính |
| `@unique` | Không trùng |
| `@relation` | Quan hệ giữa model |
| `onDelete: Cascade` | Xóa cha → xóa con theo |
| `@@unique([...])` | Unique trên nhiều cột |
| `@@index([...])` | Index để query nhanh hơn |

## Ví dụ THẬT trong dự án này (Session 01)

### Enum vai trò

```prisma
enum WorkspaceRole {
  OWNER
  MEMBER
}
```

**Why:** MVP chỉ cần 2 role. Tránh RBAC phức tạp sớm (xem ADR-002, ADR-008).

### Workspace

```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  memberships Membership[]
}
```

- `slug` unique → URL `/w/acme-corp` không đụng nhau
- `cuid()` → id ổn định, không lộ số thứ tự

### Membership (bảng nối User ↔ Workspace)

```prisma
model Membership {
  id          String        @id @default(cuid())
  userId      String
  workspaceId String
  role        WorkspaceRole
  createdAt   DateTime      @default(now())

  user      User      @relation(..., onDelete: Cascade)
  workspace Workspace @relation(..., onDelete: Cascade)

  @@unique([userId, workspaceId])
  @@index([workspaceId])
}
```

## Sơ đồ quan hệ (ASCII)

```
┌────────┐         ┌────────────┐         ┌───────────┐
│  User  │ 1─────* │ Membership │ *─────1 │ Workspace │
└────────┘         │  role      │         │  slug     │
                   └────────────┘         └───────────┘
```

Một user có thể thuộc nhiều workspace.  
Một workspace có nhiều member.  
Mỗi cặp (user, workspace) chỉ **một** dòng Membership (`@@unique`).

## Flow: thêm model mới (đúng quy trình)

```
1. Sửa prisma/schema.prisma
2. npx prisma migrate dev --name ten_migration
3. Prisma tạo SQL trong prisma/migrations/
4. Client types được cập nhật
5. Viết docs (learning / ADR / explanations / review)
6. STOP — chưa viết CRUD nếu session chưa duyệt CRUD
```

Session 01 **chỉ** làm bước schema + migrate. Chưa có create workspace API.

## Ưu điểm

- Type-safe, IDE gợi ý field
- Migration có lịch sử trên Git
- Quan hệ rõ ràng trong schema

## Nhược điểm

- Phải học DSL Prisma
- Migration sai trên prod rất đau → luôn review SQL
- SQLite local ≠ Postgres prod (ADR-006) — nhớ chuyển provider trước deploy

## Lỗi thường gặp

1. Sửa schema nhưng **không** chạy migrate → DB lệch code
2. Quên `@@unique([userId, workspaceId])` → một user join 2 lần cùng workspace
3. Không có index `workspaceId` → list members chậm khi scale
4. Dùng `@default(autoincrement())` lộ số lượng workspace qua URL id
5. Cascade xóa mà không hiểu → xóa user xóa hết membership (đúng ý Session 01, nhưng phải biết)

## Câu hỏi phỏng vấn

1. N+1 query là gì? Prisma tránh thế nào (`include` / `select`)?
2. `onDelete: Cascade` vs `SetNull` khác nhau ra sao?
3. Vì sao slug unique nhưng id vẫn là cuid?
4. Multi-tenant: cô lập bằng `workspaceId` trên mọi bảng con nghĩa là gì?

## Best practices (dự án này)

- Mọi dữ liệu nghiệp vụ sau này (project, task…) phải gắn `workspaceId`
- Membership là cổng authz — chưa có membership → không đọc workspace
- Session DB foundation **không** kèm UI/API (tránh scope creep)

## Đọc thêm

- `docs/decisions/ADR-008-workspace-membership-model.md`
- `docs/explanations/workspace.md`
- Prisma docs: Schema, Migrate, Client
- `docs/learning/05-authorization.md` (sẽ viết khi có authz helpers)
