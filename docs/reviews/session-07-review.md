# Review Session 07 — Profile basics

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- Route `/profile` + `ProfileForm` (RHF + Zod)
- Actions: `getProfile`, `updateProfile` tại `app/actions/profile/`
- `updateProfileFormSchema` — name + image URL với refine **http/https only**
- JWT/session callbacks — merge `user.image` → `token.picture` → `session.user.image`; `trigger: "update"` từ `session.update()`
- Header shell: link avatar/name → `/profile`
- Learning `08-profile-session-update.md` (picture vs image)
- Docs: feature, explanation, SESSION, NEXT

**Không** có: email change, upload, migration, Kanban, workspace settings.

## Làm tốt

- Self-only update qua `requireUser().id` — không userId param
- Protocol refine chặn URL nguy hiểm (`javascript:`, `data:`)
- JWT merge đúng convention Auth.js (`picture`)
- Form gọi `updateSession` + `router.refresh` sau DB save
- Phase 1 ROADMAP hoàn tất

## Cải thiện có thể (chưa bắt buộc)

- Optimistic UI header (hiện đủ với session.update)
- Dedicated profile nav item sidebar

## Code smells

- Không đáng kể

## Architecture quality

Khớp ADR-010: validators trong `lib/auth/`, execution trong `app/actions/profile/`.

## Security

- http(s) only cho avatar URL
- Self-only mutation
- Email không editable

## Testing considerations (thủ công)

1. Sửa name → Save → header đúng ngay trên `/profile`
2. **Điều hướng route khác sau update** (e.g. `/dashboard`) → header vẫn name/avatar mới, không cần re-login
3. Avatar URL https hợp lệ → preview + header
4. Clear URL → initials
5. URL `javascript:alert(1)` hoặc `ftp://` → validation error
6. Email field disabled/read-only
7. Chưa login → `/profile` redirect login

## Kết luận

Session đạt goal Phase 1 Profile; JWT picture merge documented rõ cho junior.
