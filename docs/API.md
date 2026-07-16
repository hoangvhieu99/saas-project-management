# API

Phase 0 endpoints only. Expand when later phases ship.

---

## Auth — Register

| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **Route** | `/api/auth/register` |
| **Request** | `{ name, email, password }` |
| **Response** | `{ id, email, name }` |
| **Validation** | `registerSchema` |
| **Auth** | Public |
| **Errors** | `400` validation; `409` email taken |

## Auth — Session (Auth.js)

| Field | Value |
|-------|-------|
| **Method** | `GET` / `POST` |
| **Route** | `/api/auth/[...nextauth]` |
| **Request** | Auth.js protocol |
| **Response** | Session / CSRF / providers |
| **Validation** | Auth.js + `loginSchema` (credentials) |
| **Auth** | Public (issues session) |
| **Errors** | Auth.js defaults |

---

## Index (deferred)

- [ ] Workspaces — Phase 1
- [ ] Projects / tasks — Phase 2
- [ ] Comments / members — Phase 3
- [ ] Notifications / attachments / settings — Phase 4
