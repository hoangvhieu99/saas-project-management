# ADR-009: Bộ tài liệu mentorship bằng tiếng Việt

## Status

Accepted — 2026-07-20

## Context

Dự án vừa là SaaS portfolio vừa là môi trường mentorship cho Junior Frontend. Trước đây docs chủ yếu tiếng Anh, rải rác (`SESSION`, `features`, `DECISIONS.md` một file). Dễ thiếu “vì sao”, khó onboard nếu không có người giải thích.

## Problem

Làm sao để mỗi session vừa ship code vừa **để lại kiến thức**, đủ để Junior hiểu toàn bộ kiến trúc từ đầu — không phụ thuộc chat AI.

## Decision

1. **Ngôn ngữ:** mọi giải thích trong `docs/` viết **tiếng Việt** (giữ nguyên thuật ngữ kỹ thuật: Prisma, slug, OWNER…).
2. **Bốn trụ cột + SESSION + features:**
   - `docs/SESSION.md` — trạng thái session
   - `docs/learning/` — dạy khái niệm
   - `docs/decisions/ADR-XXX-*.md` — một quyết định = một file
   - `docs/explanations/` — lịch sử feature (append only)
   - `docs/reviews/` — review Senior sau mỗi session
   - `docs/features/` — hợp đồng / checklist feature
3. **Definition of Done** không hoàn thành nếu thiếu docs.
4. **Không xóa** giải thích cũ — chỉ append.

## Why this solution?

- Junior đọc tiếng Việt nhanh hơn khi học khái niệm mới
- Tách “học” / “quyết định” / “lịch sử” / “review” tránh một file khổng lồ
- Append-only giữ ngữ cảnh theo thời gian (giống changelog của tư duy)

## Alternatives considered

- Chỉ cập nhật `SESSION.md`
- Docs tiếng Anh “chuẩn quốc tế”
- Wiki ngoài repo (Notion)

## Why alternatives were rejected

- Chỉ SESSION → mất chiều sâu teaching
- Chỉ tiếng Anh → rào cản mentorship local audience
- Notion ngoài repo → lệch khỏi Git, AI/agent khó đọc SSOT

## Pros

- Onboarding và review session có checklist rõ
- ADR file dễ tìm, dễ link từ code review

## Cons

- Mỗi session tốn thêm thời gian viết docs
- Có nguy cơ trùng lặp giữa `features/` và `explanations/` nếu không giữ vai trò tách biệt

## Trade-offs

| Được | Mất |
|------|-----|
| Knowledge compound | Velocity code/session chậm hơn một chút |
| SSOT trong Git | Phải discipline append, không rewrite history ẩu |

## Future impact

- Session sau (Zod, authz, CRUD…) phải tạo/ cập nhật learning tương ứng
- Có thể dần chuyển ADR-001…007 từ `DECISIONS.md` sang file riêng khi cần mở rộng

## Related files

- `cursor/rules/04-documentation.mdc`
- `cursor/rules/99-definition-of-done.mdc`
- `cursor/rules/01-workflow.mdc`
- `docs/learning/`, `docs/decisions/`, `docs/explanations/`, `docs/reviews/`

## Example usage

Kết thúc Session 02 → bắt buộc có:

- Cập nhật `SESSION.md`
- `learning/03-validation.md` và/hoặc `05-authorization.md`
- ADR mới nếu đổi hướng kiến trúc
- Append `explanations/workspace.md`
- `reviews/session-02-review.md`
- Cập nhật `features/workspace.md`

## References

- Yêu cầu mentorship của product owner (session rules)
- ADR-007 (one-session rule / freeze)
