import type { TaskPriority } from "@prisma/client";
import { KanbanBoardDnd } from "@/components/features/kanban/KanbanBoardDnd";

type KanbanBoardColumn = {
  id: string;
  name: string;
  position: number;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    position: number;
    priority: TaskPriority;
    dueDate: Date | null;
    assignee: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  }[];
};

type KanbanBoardProps = {
  workspaceSlug: string;
  projectId: string;
  projectName: string;
  columns: KanbanBoardColumn[];
};

export function KanbanBoard({
  workspaceSlug,
  projectId,
  projectName,
  columns,
}: KanbanBoardProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{projectName}</h1>
        <p className="text-sm text-stone-500">
          Drag tasks between columns — click a card to edit details.
        </p>
      </div>

      {columns.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-200 px-4 py-8 text-center text-sm text-stone-500">
          This project has no columns yet.
        </p>
      ) : (
        <KanbanBoardDnd
          workspaceSlug={workspaceSlug}
          projectId={projectId}
          columns={columns}
        />
      )}
    </div>
  );
}
