# Feature: Profile

> **Trạng thái:** Đã land — Phase 1 (Session 07: name + avatar URL; email read-only)

## Mục tiêu feature

User xem và cập nhật profile (name, avatar URL) dùng trong topbar và assignee sau này.

## User flow

1. Click avatar/name trên header → `/profile`
2. Sửa name / avatar URL (http:// hoặc https://)
3. Save → DB + JWT session cập nhật → header phản ánh ngay

## Business rules

- User chỉ sửa profile của chính mình (`requireUser()` — không nhận `userId` từ client)
- Email read-only Phase 1
- Avatar URL: chỉ `http://` hoặc `https://`; empty → `null` (initials)

## UI requirements

- [x] Profile form (RHF + Zod) tại `/profile`
- [x] Avatar preview live
- [x] Email read-only
- [x] Success / error toast
- [x] Header link → profile

## API requirements

- [x] `getProfile()` — Server Action query
- [x] `updateProfile()` — Server Action mutation (không REST PATCH — ADR-010)
- [x] Auth required

## Database models

- `User.name`, `User.image` — đã có, không migration Session 07

## Validation rules

- Name: bắt buộc, trim, max 80 (khớp register)
- Image: empty hoặc URL max 2048, **refine** protocol `http:` / `https:` only

## Permission rules

- Authenticated; self only

## State management

- Form local (RHF)
- Sau success: `session.update({ name, image })` + `router.refresh()`
- JWT callback map `session.image` → `token.picture` → `session.user.image` (xem learning 08)

## Pending tasks

- [x] Profile page + actions
- [x] Topbar avatar/name link + session sync
- [ ] Avatar file upload (Phase 3)
- [ ] Email change + verification (out of scope MVP)

## Known issues

- Không có

## Future improvements

- Upload file, email change, profile settings tab

## Checklist

- [x] Update name persist sau refresh
- [x] Update avatar URL + clear empty
- [x] Header cập nhật sau save (kể cả navigate route khác)
- [x] Không sửa user khác
- [x] Reject URL non-http(s) (e.g. `javascript:`, `data:`)
