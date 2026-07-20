import type { TaskPriority } from "@prisma/client";
import { KanbanColumn } from "@/components/features/kanban/KanbanColumn";

type KanbanBoardColumn = {
  id: string;
  name: string;
  position: number;
  tasks: {
    id: string;
    title: string;
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
          Add tasks per column — drag and drop lands in a later session.
        </p>
      </div>

      {columns.length === 0 ? (
        <p className="rounded-lg border border-dashed border-stone-200 px-4 py-8 text-center text-sm text-stone-500">
          This project has no columns yet.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              workspaceSlug={workspaceSlug}
              projectId={projectId}
              columnId={column.id}
              name={column.name}
              tasks={column.tasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
