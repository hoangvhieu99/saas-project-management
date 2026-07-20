# Review Session 06 — Dashboard summary widgets

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `components/features/dashboard/` — `dashboard-summary.tsx`, `summary-stat-card.tsx`
- `app/(app)/dashboard/page.tsx` — derive counts từ `listWorkspaces`, render stat row phía trên list
- Công thức: `ownerCount` = filter `OWNER`; `memberCount` = `total - ownerCount`
- Docs: `dashboard.md`, feature workspace, explanation Session 06, SESSION, NEXT

**Không** có: Profile, Kanban, Task widgets, schema, action mới, dedupe shell fetch.

## Làm tốt

- Dữ liệu thật từ `listWorkspaces` — không bịa task count
- Member count derived — future-proof khi mở rộng role enum
- Empty state không đổi — summary chỉ khi có workspace
- RSC thuần, không Prisma trong client
- UI khớp palette stone hiện có

## Cải thiện có thể (chưa bắt buộc)

- Dedupe `listWorkspaces` giữa shell và dashboard (1 query)
- Loading skeleton nếu dashboard payload nặng hơn sau Phase 2

## Code smells

- Không đáng kể — component nhỏ, logic derive ~3 dòng trong page

## Architecture quality

Khớp ADR-010: aggregate presentation trong RSC; execution vẫn qua action có sẵn.

## Maintainability

Hai component dashboard tách rõ (card vs grid). Dễ thêm stat Phase 2.

## Scalability

O(n) filter trên list membership user — ổn Phase 1.

## Performance

Vẫn 2× `listWorkspaces` mỗi dashboard load (shell + page) — nợ Session 05.

## Security

Scoped qua `listWorkspaces` + `requireUser` — không thay đổi bề mặt authz.

## Testing considerations (thủ công)

1. **Zero workspace:** empty state only, không stat cards.
2. **Mix OWNER/MEMBER:** 3 số khớp list (total, owner, member = total - owner).
3. **Toàn OWNER:** member = 0, owner = total.
4. **Toàn MEMBER:** owner = 0, member = total.
5. List link `/w/[slug]` và role badge không đổi.

## Sống được với 100k users?

Aggregate in-memory trên list user — đủ. Bottleneck vẫn là query membership, không phải reduce.

## Technical debt

| Nợ | Mức | Khi trả |
|----|-----|---------|
| Duplicate listWorkspaces shell/dashboard | Thấp | Layout pass props |
| Task widgets deferred | Chủ đích | Phase 2 Kanban |

## Nên refactor sau?

- Không Clean Architecture
- Có thể `getDashboardSummary` action nếu aggregate phức tạp hơn (join Task)

## Kết luận

Session đạt goal: dashboard có giá trị tóm tắt từ dữ liệu thật, scope giữ chặt.
