# Feature: Dashboard

> **Trạng thái:** Đang làm — Phase 1 (Session 06: summary widgets workspace/membership; task widgets hoãn Phase 2)

## Mục tiêu feature

Trang home sau đăng nhập: tóm tắt nhanh workspace + (sau này) task sắp đến hạn — không phải analytics suite.

## User flow

1. Sau login → `/dashboard`
2. Zero workspace → empty state + CTA tạo
3. Có workspace → stat cards + list link `/w/[slug]`
4. (Phase 2) Due-soon tasks khi có model Task

## Business rules

- Chỉ hiển thị dữ liệu workspace user là member
- Empty state ưu tiên hơn chart/widget giả
- **Member count** = `total - ownerCount` (non-owner memberships; chống lệch khi mở rộng role)

## UI requirements

- [x] Summary widgets Phase 1: tổng workspace, OWNER count, Member count (derived)
- [x] List workspace + CTA tạo (Session 05)
- [x] Empty state zero workspaces
- [ ] Due soon / recent projects (Phase 2 — cần Task model)
- [ ] Loading skeleton (chưa cần — RSC đủ nhanh MVP)

## API requirements

- [x] Tái sử dụng `listWorkspaces` — aggregate trong RSC, không query mới
- [ ] Aggregate due tasks (Phase 2)
- [x] Không leak cross-tenant

## Database models

- **Phase 1:** đọc `Membership`, `Workspace` (qua `listWorkspaces`)
- **Phase 2:** thêm `Task` (`dueDate`)

## Validation rules

- N/A cho read aggregate Phase 1

## Permission rules

- Authenticated only; scoped theo membership (`requireUser` trong action)

## State management

- RSC: `listWorkspaces` trong `dashboard/page.tsx`
- Không TanStack Query cho summary MVP

## Pending tasks

- [x] Dashboard list + empty (Session 05)
- [x] Summary widgets workspace/membership (Session 06)
- [ ] Due-soon widget sau Kanban/Task model
- [ ] Optional: dedupe `listWorkspaces` shell + dashboard

## Known issues

- `listWorkspaces` gọi cả `AuthenticatedShell` và dashboard — 2 query/request (chấp nhận MVP)

## Future improvements

- Activity feed, saved filters, per-workspace dashboard
- Task/due-soon widgets khi Phase 2

## Checklist

- [x] Render user mới (empty, không stat cards)
- [x] Render với memberships + stat cards
- [x] Không leak data cross-workspace
- [ ] Due-soon khi có Task
