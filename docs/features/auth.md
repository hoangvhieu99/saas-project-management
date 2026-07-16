# Feature: Auth

## Feature Goal

Users can register, sign in, sign out, and access protected app routes via Auth.js sessions.

## User Flow

1. Visit `/register` → submit name, email, password
2. Redirect to `/login` or auto sign-in
3. Sign in → land on `/dashboard`
4. Sign out → return to `/login`
5. Optional: Google OAuth button

## Business Rules

- Email unique; password hashed (Auth.js / bcrypt)
- Unauthenticated users cannot access `(app)` routes
- Optional Google OAuth when env keys present

## UI Requirements

- [ ] Login + register forms (RHF + Zod)
- [ ] Error messages for invalid credentials / duplicate email
- [ ] Loading disabled submit state
- [ ] Link between login ↔ register

## API Requirements

- [ ] Register endpoint or Server Action
- [ ] Auth.js credentials + session callbacks
- [ ] Document in `API.md`

## Database Models

- `User` (id, email, name, image, passwordHash?)
- Auth.js `Account` / `Session` / `VerificationToken` as required by adapter

## Validation Rules

- Email: valid format
- Password: min length TBD (TODO: e.g. 8+)
- Name: required, max length TBD

## Permission Rules

- Public: register, login
- Authenticated: logout, session read

## State Management

- Session via Auth.js (server + `useSession` if needed)
- No Zustand for auth identity

## Pending Tasks

- [ ] Scaffold Auth.js + Prisma adapter
- [ ] Register + login pages
- [ ] Middleware protect `(app)`
- [ ] Optional Google provider

## Known Issues

- None yet

## Future Improvements

- Email verification, password reset, 2FA

## Checklist

- [ ] Happy path register → login → dashboard
- [ ] Protected route redirects unauthenticated users
- [ ] Documented in API.md
