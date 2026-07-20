# Giải thích feature: Workspace

> Lịch sử xây dựng feature theo từng session. **Không xóa** — chỉ append.  
> Hợp đồng trạng thái hiện tại: `docs/features/workspace.md`.

---

## Session 01 — Database model (2026-07-16)

### Mục tiêu session

Chỉ đặt **nền tảng dữ liệu** cho multi-workspace. Không UI, không API, không validation app-level.

### Đã thêm vào schema

1. **`WorkspaceRole`** — `OWNER` | `MEMBER`
2. **`Workspace`** — không gian làm việc; định danh công khai bằng `slug` unique
3. **`Membership`** — quan hệ User ↔ Workspace + role

### Vì sao làm DB trước?

```
Sai:  UI create workspace → rồi mới nghĩ schema
Đúng: Schema + quy tắc nghiệp vụ → validation → authz → CRUD → UI
```

UI phụ thuộc hợp đồng dữ liệu. Làm ngược dễ phải đập form/API.

### Quy tắc nghiệp vụ đã “khắc” vào DB

| Quy tắc | Cách thể hiện trong schema |
|---------|----------------------------|
| Slug không trùng | `slug String @unique` |
| User chỉ join 1 lần / workspace | `@@unique([userId, workspaceId])` |
| Xóa user/workspace → dọn membership | `onDelete: Cascade` |
| List member theo workspace nhanh hơn | `@@index([workspaceId])` |

### Migration

- Tên: `workspace_foundation`
- Thư mục: `prisma/migrations/20260716062526_workspace_foundation/`

### Cố ý chưa làm

- Zod validate name/slug
- Helper `requireMembership`
- Server Action create workspace
- Route `/w/[slug]`
- UI switcher

→ Để Session 02+ với scope tường minh (tránh scope creep).

### Sơ đồ sau Session 01

```
User ──< Membership >── Workspace
              │
           role: OWNER | MEMBER
```

### Quyết định liên quan

- `docs/decisions/ADR-008-workspace-membership-model.md`

### Bài học liên quan

- `docs/learning/02-prisma.md`

---

## Session 02 — Validation + authz helpers (2026-07-20)

### Mục tiêu session

Đặt **hợp đồng input (Zod)** và **cửa authz** cho Workspace trước khi viết CRUD/UI. Không API, không route, không move Auth/shared.

### Đã thêm

```
lib/workspace/
  validation.ts   # name, slug, createWorkspaceSchema, updateWorkspaceSchema (name only)
  authz.ts        # WorkspaceContext, requireWorkspaceContext, requireWorkspaceOwner
  index.ts
```

### Quyết định trong session (không đủ lớn cho ADR riêng)

1. **Domain seed:** chỉ tạo `lib/workspace/`; Auth vẫn flat (`lib/auth.ts`, `lib/validations`) — tránh scope creep; refactor Domain-Oriented toàn `lib/` = session riêng sau.
2. **API công khai theo WorkspaceContext** — không export `getMembership*` làm mặt tiền; membership nằm trong context.
3. **Không sửa `lib/api-helpers.ts`** — chưa có endpoint; map `NOT_FOUND` để session API sau.
4. **`updateWorkspaceSchema` chỉ `name`** — đổi slug ngoài scope Session 02.

### Cố ý chưa làm

- CRUD / Server Actions / UI / routes `/w/[slug]`
- Đổi slug
- Migrate Auth → `lib/auth/`, shared → `lib/shared/`
- ADR kiến trúc Domain-Oriented (chờ session refactor)

### Learning liên quan

- `docs/learning/03-validation.md`
- `docs/learning/05-authorization.md`

---

---

## Session 03 — Architecture refactor Domain Modules (2026-07-20)

### Mục tiêu session

Thống nhất `lib/` theo **Lightweight Domain-Oriented Modules** (ADR-010). Không CRUD, không đổi business logic.

### Đã đổi (liên quan Workspace)

- `lib/workspace/validation.ts` → `lib/workspace/validators.ts` (rename quy ước)
- `lib/workspace/authz.ts` import `prisma` từ `@/lib/shared/db`
- Auth/infra flat đã chuyển: `lib/auth/*`, `lib/shared/*`

### Cố ý chưa làm

- Workspace CRUD / UI / routes

### ADR

- `docs/decisions/ADR-010-domain-oriented-module-architecture.md`

---

<!-- Session 04+ sẽ append bên dưới dòng này -->
