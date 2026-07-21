# Review Session 13 — Kanban DnD + `moveTask`

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- `lib/project/positions.ts` — `computeColumnPositions`, `reindexAfterRemove`
- `lib/project/validators.ts` — `moveTaskSchema`
- `app/actions/project/mutations.ts` — `moveTask` (all-in-one interactive transaction)
- `stores/useKanbanDragStore.ts` — drag overlay only
- `components/features/kanban/kanban-dnd-utils.ts` — `resolveDropTarget`, `isNoOpMove`
- DnD UI: `KanbanBoardDnd`, `KanbanSortableTaskCard`, `KanbanDragOverlay`
- Docs: feature, explanation, ARCHITECTURE, SESSION, NEXT

**Không** có: TaskDetail, TanStack optimistic, column DnD, delete.

## Làm tốt

- `moveTask`: verify + read + compute + write trong **một** `prisma.$transaction`
- Nested-where verify task/column **trong tx** (mirror `requireTaskInProject` / `requireColumnInProject`)
- Server reindex positions 0..n-1 — reload-safe
- `resolveDropTarget` cover cột rỗng (`over.id === columnId` → position 0)
- Zustand chỉ drag overlay — không lưu board state

## Testing considerations (manual)

1. Reorder trong cột → reload giữ thứ tự
2. Move Todo → Doing (cột rỗng) → position 0, reload OK
3. Move sang cột có tasks → insert đúng index
4. Drop column body (append) → position = length
5. Create task form vẫn hoạt động sau DnD
6. Không TaskDetail on click

## Kết luận

Session đạt goal: interactive Kanban DnD persist sau reload, sẵn TaskDetail session sau.
