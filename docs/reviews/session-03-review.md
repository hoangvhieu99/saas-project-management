# Review Session 03 — Domain-Oriented `lib/` refactor

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- Move Auth → `lib/auth/{auth,authz,validators}.ts`
- Move infra → `lib/shared/{db,api-client,api-helpers,utils}.ts`
- Rename `lib/workspace/validation.ts` → `validators.ts`
- Cập nhật mọi import; xóa flat paths + `lib/validations/`
- ADR-010 + ARCHITECTURE / PROJECT / ROADMAP / SESSION / learning / explanations

**Không** đổi: business logic, Prisma, UI, API, routes, CRUD.

## Làm tốt

- Đúng thời điểm: **trước** Workspace CRUD — chi phí import thấp
- Target đơn giản, khớp rule 13 — không Clean/DDD
- `shared/` chỉ infra; domain giữ validators + authz
- Docs + ADR land cùng code — tránh drift

## Cải thiện có thể

- Barrel `lib/auth/index.ts` để import ngắn hơn (`@/lib/auth`) — tùy chọn, chưa bắt buộc
- Map `NOT_FOUND` trong `api-helpers` khi có API workspace

## Code smells

- Không phát hiện logic thay đổi ngoài path
- `cn` có thể annotate return type nhẹ (không ảnh hưởng behavior)

## Architecture quality

**Tốt.** Hybrid đã được đóng. Quy ước sẵn sàng cho `lib/project/`, `lib/task/`.

## Maintainability / Scalability

Discoverability tăng. Review theo folder domain dễ hơn. Scale roadmap Phase 1–2 không cần đổi kiến trúc lần nữa sớm.

## Security

Không đổi surface authz — chỉ path. Vẫn chưa gắn CRUD (nợ có chủ đích).

## Testing

Build/typecheck/lint là gate chính của session. Không cần test behavior mới vì không có behavior mới.

## Technical debt

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Import path dài `@/lib/auth/auth` | Thấp | Optional barrel |
| `NOT_FOUND` chưa map HTTP | Thấp | Session API |
| CRUD chưa enforce authz trên path | Cao (product) | Session CRUD |

## Câu hỏi phỏng vấn

1. Domain module khác Clean Architecture chỗ nào?
2. Vì sao `shared/` không được chứa business rule?
3. Vì sao refactor kiến trúc trước CRUD?

## Learning summary

Session 03 dạy **evolutionary architecture**: flat → hybrid seed → thống nhất domain modules khi pain rõ và chi phí còn thấp. Lightweight đủ cho portfolio; Clean/DDD là lựa chọn bị loại có lý do (ADR-010).
