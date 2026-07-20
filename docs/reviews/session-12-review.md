# Review Session 12 — Kanban create project + create task UI

> Góc nhìn Senior Engineer / Tech Lead. Ngày: 2026-07-20.

## Đã triển khai gì?

- `components/features/kanban/create-project-form.tsx` — RHF + `createProjectSchema`, CONFLICT mirror workspace
- `components/features/kanban/create-project-dialog.tsx` — overlay trên workspace shell
- `components/features/kanban/create-task-form.tsx` — inline title-only form per column
- `KanbanColumn.tsx` — client boundary + `CreateTaskForm` + position append
- `KanbanBoard.tsx` — pass workspace/project context
- `app/(app)/w/[slug]/page.tsx` — dialog + empty state CTA
- Docs: feature, explanation, ARCHITECTURE, SESSION, NEXT

**Không** có: DnD, `moveTask`, `updateTask` UI, TaskDetail, assignee/due date picker.

## Schema confirmation (Design Review gate)

`createTaskSchema` nullable fields:

| Field | Chấp nhận `null`? | Cơ chế |
|-------|-------------------|--------|
| `description` | Có | `taskDescriptionSchema` union `z.null()` / `z.undefined()` |
| `dueDate` | Có | `nullableDueDateSchema` union `z.null()` / `z.undefined()` |
| `assigneeId` | Có | `nullableAssigneeSchema` union `z.null()` / `z.undefined()` |

→ Payload gửi `null` **hợp lệ**. Omit key **không** dùng được vì các field là required key trong `z.object` (chỉ value nullable).

`createTaskFormSchema` (UI-only, trong component):

```ts
const createTaskFormSchema = z.object({ title: taskTitleSchema });
```

Full payload assemble trong `onSubmit` với `description: null`, `dueDate: null`, `assigneeId: null`, `priority: MEDIUM`, `position: nextPosition`.

## Làm tốt

- Mirror Session 05 workspace form/dialog pattern
- CONFLICT slug handling đầy đủ (toast + field error + suggestion)
- Position append client-side (`max + 1`) — không sửa server
- `disabled={isSubmitting}` trên inputs/buttons (khuyến khích, đã thêm)
- `router.refresh()` sau create task — board RSC refetch

## Risks còn lại

| Risk | Chuyển giao |
|------|-------------|
| Position collision race | Session DnD + normalize |
| Chưa có `moveTask` | Session 13 DnD |
| `revalidatePath` chỉ `/w/{slug}` | Đủ cho MVP — parent path cover nested |

## Testing considerations (manual)

1. Create project dialog → redirect board → 3 cột Todo/Doing/Done
2. Duplicate project slug → CONFLICT toast + field error
3. Add task title ở cột → card xuất hiện sau refresh
4. Task thứ 2 có position > task thứ 1
5. Empty project list → CTA create
6. Không DnD / `moveTask`

## Kết luận

Session đạt goal: member populate board từ UI, sẵn cho DnD session.
