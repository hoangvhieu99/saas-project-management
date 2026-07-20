# ADR-010: Lightweight Domain-Oriented Module Architecture

## Status

Accepted — 2026-07-20 (Session 03)

## Context

Sau Session 02, `lib/` ở trạng thái **hybrid**:

- `lib/workspace/` đã theo domain
- Auth + infra vẫn flat (`auth.ts`, `validations/`, `db.ts`, `utils.ts`, …)

Rule `13-folder-organization` và roadmap (Project, Kanban, Calendar…) đòi một quy ước thống nhất trước khi CRUD bùng nổ.

## Problem

Làm sao tổ chức `lib/` để:

1. Junior/AI biết đặt file mới ở đâu
2. Tránh God folders (`validations/`, `utils` dump)
3. Không over-engineer Clean Architecture / DDD cho portfolio 90 ngày

## Decision

Áp dụng **Lightweight Domain-Oriented Modules**:

```
lib/
  auth/       # auth.ts, authz.ts, validators.ts
  workspace/  # authz.ts, validators.ts (+ index barrel)
  shared/     # db, api-client, api-helpers, utils — infra only
```

Quy tắc:

- Business logic → `lib/<domain>/`
- Shared → chỉ infrastructure
- Không Repository, Service layer, Use Cases, DI, DDD Aggregates, CQRS

## Why this solution?

- Khớp UI đã feature-based (`components/features/<domain>`)
- Scale thêm `lib/project/`, `lib/task/` mà không phình một túi chung
- Đủ dạy SRP / cohesion / coupling cho mentorship
- Chi phí migrate thấp **trước** Workspace CRUD

## Alternatives considered

| Phương án | Mô tả |
|-----------|--------|
| A. Giữ hybrid flat + workspace domain | Zero cost ngắn hạn |
| B. Lightweight Domain Modules | **Chọn** |
| C. Full Clean Architecture / DDD | Layer đầy đủ |

## Why alternatives were rejected

- **A:** Hai quy ước cùng tồn tại → discoverability và review cost tăng mỗi feature
- **C:** Overkill ADR-002; chậm ship Kanban; ceremony thừa cho side-project

## Pros

- Một quy ước rõ; docs/ARCHITECTURE khớp code
- Domain review được độc lập
- `shared/` có ranh giới cứng

## Cons

- Import path dài hơn (`@/lib/auth/auth`)
- Phải kỷ luật không nhét business vào `shared/`

## Trade-offs

| Được | Mất |
|------|-----|
| Nợ hybrid trả một lần | Session không ship feature user-facing |
| Portfolio kể được modular lib | Path breaking (không giữ shim) |

## Future impact

- Mọi domain mới: `lib/<name>/{validators,authz,…}`
- Session CRUD Workspace viết trên nền này
- Không “nâng” sang Clean Architecture trừ khi có ADR mới tường minh

## Related files

- `lib/auth/*`, `lib/workspace/*`, `lib/shared/*`
- `docs/ARCHITECTURE.md`
- Rule: `cursor/rules/13-folder-organization.mdc`

## Example usage

```ts
import { auth } from "@/lib/auth/auth";
import { requireUser } from "@/lib/auth/authz";
import { createWorkspaceSchema } from "@/lib/workspace/validators";
import { prisma } from "@/lib/shared/db";
```

## References

- ADR-002 (MVP scope)
- ADR-007 (Phase 0 freeze — foundation reviewable)
- Session 02 (workspace domain seed)
