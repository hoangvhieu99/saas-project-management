# Authorization (membership) trong multi-tenant mỏng

> Audience: Junior Frontend (< 2 năm kinh nghiệm).  
> Session giới thiệu: **Session 02 — Workspace validation + authz**.

## Đây là gì?

**Authentication** = “bạn là ai?” (session / `requireUser`).  
**Authorization** = “bạn được làm gì trên tài nguyên nào?”

Trong app này, tài nguyên workspace chỉ mở khi user có **Membership**. Helper authz kiểm tra điều đó trên server.

## Tại sao tồn tại?

Biết `slug` không có nghĩa là được vào. User đoán URL workspace người khác phải bị chặn — không leak dữ liệu, tốt nhất không leak cả “workspace có tồn tại”.

## Vì sao cần trong dự án này?

Mọi dữ liệu sau (project, task…) sẽ scope theo workspace. Nếu quên check membership trên một path → lỗ hổng multi-tenant cổ điển.

Session 02 đặt helper tại `lib/workspace/authz.ts` **trước** CRUD, để mọi Server Action sau bắt buộc đi qua cùng một cửa.

## Abstraction: WorkspaceContext (không phải “get membership”)

API công khai tập trung vào **workspace đang truy cập**, kèm bằng chứng member:

```ts
type WorkspaceContext = {
  workspace: Workspace;
  membership: Membership;
};

requireWorkspaceContext(userId, slug)  // member → context; else NOT_FOUND
requireWorkspaceOwner(userId, slug)    // OWNER → context; member thường → FORBIDDEN
```

**Why không export `getMembership…` làm API chính?**  
Caller nghĩ theo “workspace tôi đang mở”, không nghĩ theo bảng join. Membership là chi tiết triển khai bên trong context.

## Ưu điểm

- Một chỗ query + rule → khó quên check  
- Trả về cả `workspace` và `membership` → CRUD không query lại  
- Phân biệt NOT_FOUND (ẩn tồn tại) vs FORBIDDEN (đã vào nhưng thiếu role)

## Nhược điểm

- Helper chưa gắn API/UI — chưa “an toàn end-to-end” cho đến session CRUD  
- Map HTTP status (`NOT_FOUND` → 404) để session API sau (cố ý chưa sửa `api-helpers` ở Session 02)

## Trade-offs

| Được | Mất |
|------|-----|
| Authz sẵn sàng trước UI | Hybrid: `requireUser` vẫn ở `lib/authz.ts` flat |
| Context-centric API | Junior phải học AuthN vs AuthZ |

## Lỗi thường gặp

1. Query `workspace.findUnique({ where: { slug } })` **không** join membership  
2. Trả 403 khi không phải member → có thể tiết lộ workspace tồn tại  
3. Gọi `requireUser` bên trong mọi helper domain → khó test; nên nhận `userId` từ ngoài

## Câu hỏi phỏng vấn

1. AuthN vs AuthZ khác gì?  
2. Vì sao non-member và “slug không tồn tại” nên cùng một mã lỗi?  
3. OWNER vs MEMBER enforce ở đâu trong stack?

## Ví dụ THẬT — Session 02

```ts
import { requireWorkspaceOwner } from "@/lib/workspace";

// Pseudo — Session CRUD sau này
const user = await requireUser();
const { workspace } = await requireWorkspaceOwner(user.id, slug);
// chỉ OWNER mới tới đây
```

## Bài tập

1. Viết bảng: action × role × helper nào (`requireWorkspaceContext` vs `requireWorkspaceOwner`).  
2. Nêu 2 cách Junior vô tình leak workspace khi viết API.
