# Project authz trong Kanban workspace-scoped

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 09 — Kanban validation + authz**.

## Đây là gì?

Kanban đã có schema `Project -> BoardColumn -> Task`, nhưng DB **không đủ** để đảm bảo:

1. user hiện tại là member của workspace
2. project đang mở thật sự thuộc workspace đó
3. task đang thao tác thuộc **đúng project**
4. assignee mới là member hợp lệ của workspace

Session 09 thêm `lib/project/` để giải quyết các rule này **trước CRUD**.

## Pattern kế thừa từ Workspace

Workspace Session 02 có:

```ts
requireWorkspaceContext(userId, slug)
```

Kanban Session 09 build tiếp trên pattern đó:

```ts
requireProjectContext(userId, workspaceSlug, projectSlug)
requireTaskInProject(userId, workspaceSlug, projectId, taskId)
assertAssigneeInWorkspace(assigneeId, workspaceId)
```

Ý tưởng: **compose authz theo chain domain**, không copy lại logic membership từ đầu.

## Vì sao `requireTaskInProject` phải nhận `projectId`?

Đây là điểm dễ bị lỗi IDOR.

Ví dụ:

- User là member của workspace `acme`
- Trong `acme` có `project-a` và `project-b`
- User đang ở màn hình `project-a`
- Nếu code chỉ check `taskId` thuộc workspace `acme`, một `taskId` của `project-b` vẫn có thể lọt qua

Vì vậy helper phải verify:

```ts
task.id = taskId
task.column.projectId = projectId
task.column.project.workspaceId = workspace.id
```

## Single nested-where query

`requireTaskInProject` cố ý dùng **một query Prisma** với nested `where`:

```ts
await prisma.task.findFirst({
  where: {
    id: taskId,
    column: {
      projectId,
      project: {
        workspaceId: context.workspace.id,
      },
    },
  },
});
```

Lợi ích:

- đóng lỗ IDOR giữa sibling projects
- caller không phải query task rồi tự so sánh bằng `if`
- rule đọc như một câu business hoàn chỉnh

## Assignee rule

Schema chỉ validate `assigneeId` có dạng cuid hoặc null.

Rule business thật nằm ở authz:

```ts
assertAssigneeInWorkspace(assigneeId, workspaceId)
```

| Case | Kết quả |
|------|---------|
| `null` / empty | OK |
| user có membership workspace | OK |
| user không có membership workspace | `FORBIDDEN` |

Không dùng `NOT_FOUND` ở đây vì đây không phải lookup tài nguyên theo URL; đây là rule “bạn không được gán người ngoài workspace”.

## Anti-patterns

| Sai | Đúng |
|-----|------|
| Chỉ check task thuộc workspace | Check task thuộc **đúng project** và workspace |
| Query task trước, rồi JS `if (task.projectId !== ...)` | Nested where query ngay trong Prisma |
| Validate assignee membership bằng Zod refine query DB | Tách: Zod validate shape, authz validate business rule |
| Đợi đến session CRUD mới nghĩ assignee rule | Đóng helper trước CRUD |

## File liên quan

- `lib/project/validators.ts`
- `lib/project/authz.ts`
- `lib/project/index.ts`
- `lib/workspace/authz.ts`

## Câu hỏi tự kiểm

1. Vì sao `workspaceId` đúng vẫn chưa đủ để xác nhận task đúng project?
2. Khi nào `assigneeId` nên trả `FORBIDDEN` thay vì `NOT_FOUND`?
3. Vì sao Session 09 chỉ làm `lib/project/` mà chưa viết CRUD?
