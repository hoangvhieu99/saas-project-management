# Giải thích feature: Profile

> Lịch sử xây dựng feature theo từng session. **Không xóa** — chỉ append.  
> Hợp đồng trạng thái hiện tại: `docs/features/profile.md`.

---

## Session 07 — Profile basics (2026-07-20)

### Mục tiêu session

User đã đăng nhập **xem và cập nhật** name + avatar URL trên `/profile`. Email read-only. Hoàn tất Phase 1 ROADMAP trước Kanban.

### Đã thêm

```
app/(app)/profile/page.tsx
app/actions/profile/
  queries.ts      # getProfile
  mutations.ts    # updateProfile
components/features/profile/
  profile-form.tsx
lib/auth/validators.ts   # updateProfileFormSchema (http/https refine)
lib/auth/auth.ts         # jwt/session callbacks — token.picture merge
components/layout/app-shell.tsx   # Link header → /profile
```

### Quyết định (Design Review + approve)

1. **Page `/profile`** — không modal.
2. **Server Actions** — không REST PATCH (khớp ADR-010).
3. **Image URL refine** — chỉ `http://` / `https://` (chặn `javascript:`, `data:`, …).
4. **JWT refresh bắt buộc** — sau `updateProfile`, form gọi `session.update()`; jwt callback ghi **`token.picture`** (Auth.js convention), session map → `session.user.image`.
5. **Không migration** — `User.name`, `User.image` đã có.

### Cố ý chưa làm

- Email change, file upload
- Kanban, workspace settings

### Learning liên quan

- `docs/learning/08-profile-session-update.md` — `picture` vs `image`, merge logic, test navigate sau update

---

<!-- Session 08+ sẽ append bên dưới dòng này -->
