# Server Actions Kanban — reuse domain authz

> Audience: Junior Frontend (< 2 năm kinh niệm).  
> Session giới thiệu: **Session 10 — Kanban CRUD Server Actions**.

## Pattern

```
app/actions/project/*     ← execution ("use server")
lib/project/validators    ← Zod shape
lib/project/authz         ← membership + IDOR guards
lib/workspace/authz       ← workspace gate
```

Session 04 Workspace đã làm tương tự. Session 10 lặp pattern cho Kanban.

## Queries

| Action | Authz |
|--------|-------|
| `listProjects(workspaceSlug)` | `requireWorkspaceContext` |
| `getProjectBySlug(ws, projectSlug)` | `requireProjectContext` + include columns/tasks ordered |

## Mutations

| Action | Guards bắt buộc |
|--------|------------------|
| `createProject` | workspace member; slug unique → `CONFLICT`; seed 3 columns |
| `createTask` | `requireColumnInProject(workspaceId, projectId, columnId)`; `assertAssigneeInWorkspace` |
| `updateTask` | `requireTaskInProject(..., projectId, taskId)`; assignee check nếu payload có `assigneeId` |

## Vì sao `createTask` cần nested verify column?

Chỉ check `column.projectId === projectId` **chưa đủ** nếu caller gửi:

- `projectId` của project A
- `columnId` của project B (cùng workspace)

Helper `requireColumnInProject` dùng **một query**:

```ts
await prisma.boardColumn.findFirst({
  where: {
    id: columnId,
    projectId,
    project: { workspaceId },
  },
});
```

Sai bất kỳ link → `NOT_FOUND`.

## Error throw convention

Giống workspace actions:

- Validation Zod → `Error(message)`
- Authz → `NOT_FOUND`, `FORBIDDEN`
- Unique slug → `CONFLICT`

Không `ActionResult` wrapper (ADR-010 execution pattern).

## Anti-patterns

| Sai | Đúng |
|-----|------|
| Prisma trong Client Component | Server Actions |
| Verify column rời project rồi mới check workspace | `requireColumnInProject` một query |
| Bỏ qua `assertAssigneeInWorkspace` | Gọi sau parse, trước create/update |
| Seed columns ở UI | Seed trong `createProject` transaction |

## File liên quan

- `app/actions/project/queries.ts`, `mutations.ts`
- `lib/project/authz.ts`, `validators.ts`
- `app/actions/workspace/` (pattern tham chiếu)
