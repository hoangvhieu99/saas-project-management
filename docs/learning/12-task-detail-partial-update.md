# Learning 12 — Partial update form + click-sau-kéo

> Session 14 — TaskDetail drawer. Ngôn ngữ: tiếng Việt.

## Vấn đề 1: Omit vs null trên `updateTask`

`updateTaskSchema` dùng field **optional** + value **nullable**:

- **Omit key** → Prisma không đụng cột đó
- **`null`** → xoá giá trị (description / dueDate)

Nếu form gửi full `values` sau khi user chỉ sửa title, ô description trống dễ thành `""` → schema transform thành `null` → **xoá nhầm**.

### Cách làm

React Hook Form `dirtyFields`: chỉ đưa field user đã đụng vào payload.

```ts
const payload = {};
if (dirtyFields.description) {
  payload.description = values.description.trim() === "" ? null : values.description.trim();
}
```

## Vấn đề 2: Click mở drawer sau khi kéo thả

`PointerSensor` `activationConstraint: { distance: 8 }` chỉ tránh bắt đầu drag khi pointer gần như đứng yên. Sau `dragEnd`, trình duyệt thường còn bắn **click** — lúc đó `isDragging` đã `false`.

### Cách làm

```ts
const suppressOpenRef = useRef(false);

function armSuppressOpen() {
  suppressOpenRef.current = true;
  setTimeout(() => {
    suppressOpenRef.current = false;
  }, 0);
}

// onDragEnd / onDragCancel → armSuppressOpen()
// onOpen → if (suppressOpenRef.current) return;
```

**Chốt `setTimeout(0)`** (macrotask): chạy **sau** click synthetic cùng gesture. `queueMicrotask` / `requestAnimationFrame` có thể clear cờ **trước** click → drawer vẫn mở nhầm.

## Liên quan

- `docs/features/kanban.md`
- `docs/explanations/kanban.md` — Session 14
- `components/features/kanban/task-detail-drawer.tsx`
- `components/features/kanban/KanbanBoardDnd.tsx`
