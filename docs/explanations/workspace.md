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

## Session 04 — Workspace CRUD server (2026-07-20)

### Mục tiêu session

Thêm **CRUD Workspace phía server** (create / list / get-by-slug / update name / delete). Không UI, không route `/w/[slug]`.

### Đã thêm

```
app/actions/workspace/
  queries.ts     # listWorkspaces, getWorkspaceBySlug
  mutations.ts   # createWorkspace, updateWorkspace, deleteWorkspace
```

- `lib/shared/api-helpers.ts` — map `NOT_FOUND` (404), `CONFLICT` (409)
- Learning: `docs/learning/06-server-actions.md`

### Quyết định trong session (Design Review đã duyệt)

1. **Execution vs domain:** Server Actions ở `app/actions/workspace/`; `lib/workspace/` chỉ validators + authz + barrel.
2. **Không `ActionResult`:** throw `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` (+ `CONFLICT` cho slug trùng).
3. **Tách queries / mutations** — dễ mở rộng.
4. **Create** bắt buộc `prisma.$transaction()` — Workspace + Membership `OWNER`.
5. **Delete** chỉ xóa `Workspace`; Membership nhờ `onDelete: Cascade`.

### Cố ý chưa làm

- UI dialog / switcher / empty state
- Route group `/w/[slug]` + layout
- Đổi slug, invite, schema mới

### Learning liên quan

- `docs/learning/06-server-actions.md`

---

## Session 05 — Workspace UI + routes `/w/[slug]` (2026-07-20)

### Mục tiêu session

Gắn CRUD server vào **UI tối thiểu** và route group `/w/[slug]` với membership gate ở layout.

### Đã thêm

```
app/(app)/w/[slug]/
  layout.tsx   # getWorkspaceBySlug → NOT_FOUND → notFound()
  page.tsx     # shell (name, slug, role)

components/features/workspace/
  create-workspace-form.tsx
  create-workspace-dialog.tsx
  workspace-switcher.tsx
  workspace-empty-state.tsx
```

- AppShell: switcher + CTA tạo
- Dashboard: empty state hoặc list link vào `/w/[slug]`
- `createWorkspace`: `revalidatePath` sau thành công
- CONFLICT: toast + gợi ý slug (`slug-2`) + field error

### Quyết định (Design Review + approve có điều kiện)

1. **Không** wire `updateWorkspace` / `deleteWorkspace` UI (settings sau).
2. Duplicate fetch layout + page — chấp nhận MVP.
3. Switcher: list từ `AuthenticatedShell` (server) pass vào AppShell.
4. CONFLICT phải có gợi ý — không chỉ báo lỗi suông.
5. Manual test member / non-member nằm trong DoD / review.

### Cố ý chưa làm

- Dashboard widgets, Profile, Kanban, Calendar
- Đổi slug, invite, schema mới
- `React.cache` dedupe

### Learning liên quan

- `docs/learning/07-workspace-routes.md`

---

## Session 06 — Dashboard summary widgets (2026-07-20)

### Mục tiêu session

Thêm **widget tóm tắt tối thiểu** trên `/dashboard` từ dữ liệu Workspace/Membership hiện có. Không Profile, Kanban, Task model.

### Đã thêm

```
components/features/dashboard/
  dashboard-summary.tsx
  summary-stat-card.tsx

app/(app)/dashboard/page.tsx   # derive counts + render summary row
```

- Stat cards: **Workspaces** (total), **Owner** (count `OWNER`), **Member** (`total - ownerCount`)
- Empty state giữ nguyên — không render summary khi zero workspace
- Tái sử dụng `listWorkspaces()` — không action/query mới

### Quyết định (Design Review + approve)

1. **Member count = total - ownerCount** — không đếm riêng `MEMBER`; chống lệch khi role model mở rộng.
2. **Không** widget task/due-soon placeholder — chỉ aggregate thật.
3. **Không** dedupe fetch shell + dashboard trong session này.

### Cố ý chưa làm

- Profile, Kanban, Calendar, settings workspace UI
- Schema/migration, action summary riêng

### Feature liên quan

- `docs/features/dashboard.md` — cập nhật contract Phase 1

---

<!-- Session 07+ sẽ append bên dưới dòng này -->
