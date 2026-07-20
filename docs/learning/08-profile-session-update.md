# Profile: cập nhật session JWT sau khi sửa name / avatar

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 07 — Profile basics**.

## Vấn đề

App dùng Auth.js với **`session: { strategy: "jwt" }`**. JWT được ký và lưu cookie — **không tự đọc lại DB** mỗi request.

Luồng login:

1. User đăng nhập → `authorize` / OAuth trả `user` (có `name`, `image`).
2. Callback **`jwt`** ghi vào token.
3. Callback **`session`** map token → `session.user` cho client và RSC (`auth()`).

Khi user sửa profile trong DB qua Server Action, **JWT cũ vẫn còn name/image cũ** cho đến khi login lại — trừ khi ta cập nhật token có chủ đích.

## Auth.js: `image` vs `token.picture`

Đây là chỗ dễ nhầm:

| Layer | Field avatar | Ghi chú |
|-------|----------------|---------|
| Prisma `User` | `image` | Source of truth DB |
| OAuth / `authorize` return | `user.image` | Credentials provider trả field này |
| **JWT token** | **`token.picture`** | Auth.js/OAuth convention — avatar trong JWT là `picture`, **không phải** `token.image` |
| **Session** | **`session.user.image`** | Session callback map **từ `token.picture`** |

Nếu bạn chỉ set `token.image` mà quên `token.picture`, `session.user.image` và header shell **sẽ không đổi** dù DB đã update.

### Merge logic trong repo (Session 07)

```typescript
// lib/auth/auth.ts — rút gọn

async jwt({ token, user, trigger, session }) {
  // 1) Login lần đầu: copy từ user → token
  if (user) {
    token.sub = user.id;
    token.name = user.name;
    token.picture = user.image ?? null;  // DB image → JWT picture
  }

  // 2) Sau profile save: client gọi session.update({ name, image })
  if (trigger === "update" && session) {
    if ("name" in session && session.name !== undefined) {
      token.name = session.name;
    }
    if ("image" in session) {
      token.picture = session.image ?? null;  // client gửi image → ghi picture
    }
  }

  return token;
}

async session({ session, token }) {
  if (session.user && token.sub) {
    session.user.id = token.sub;
    session.user.name = token.name ?? null;
    session.user.image = token.picture ?? null;  // picture → session.image
  }
  return session;
}
```

**Quy tắc nhớ:** mọi đường đi avatar đều **đi qua `token.picture`** trước khi ra `session.user.image`.

## Luồng sau khi Save profile

```
ProfileForm submit
  → updateProfile()           // DB: prisma.user.update
  → updateSession({ name, image })  // next-auth/react — trigger jwt "update"
  → router.refresh()          // RSC layout re-fetch auth()
  → AppShell header hiện name/avatar mới
```

`updateProfile` **không** tự sửa JWT — form client **bắt buộc** gọi `updateSession` sau action thành công.

## Vì sao vẫn cần `getProfile()` từ DB?

- Form `/profile` lấy default từ DB (`getProfile`) — truth khi mở trang, kể cả JWT stale hiếm.
- Header/shell dùng `auth()` → session JWT — cần `updateSession` để sync sau save.

## Test case quan trọng: điều hướng route khác sau update

1. Vào `/profile`, đổi name, Save.
2. **Không** refresh thủ công — click **Dashboard** hoặc workspace khác.
3. Header vẫn phải hiện name mới.

Nếu thiếu bước `updateSession` hoặc map sai `picture`, bug chỉ lộ khi **navigate** (layout remount / session đọc lại) hoặc sau hard refresh — test này bắt lỗi JWT merge sớm.

## Anti-patterns

| Sai | Đúng |
|-----|------|
| Chỉ `router.refresh()` sau update DB | `updateSession` + `router.refresh()` |
| Ghi `token.image` trong jwt callback | Ghi `token.picture`; session đọc `token.picture` |
| Tin session tự sync DB | JWT strategy = explicit merge |
| Cho client gửi `userId` để update | `requireUser()` — chỉ self |

## File liên quan

- `lib/auth/auth.ts` — jwt + session callbacks
- `app/actions/profile/mutations.ts` — DB update
- `components/features/profile/profile-form.tsx` — `useSession().update`
- `lib/auth/validators.ts` — `updateProfileFormSchema` (http/https URL)

## Câu hỏi tự kiểm

1. Avatar trong JWT field tên gì — `image` hay `picture`?
2. Sau `updateProfile`, bước nào cập nhật cookie session?
3. Vì sao test navigate sang `/dashboard` sau save quan trọng hơn chỉ đứng yên trên `/profile`?
