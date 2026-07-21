"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CreateTaskForm } from "@/components/features/kanban/create-task-form";
import { KanbanSortableTaskCard } from "@/components/features/kanban/KanbanSortableTaskCard";
import type { KanbanDragTask } from "@/stores/useKanbanDragStore";

type KanbanColumnProps = {
  workspaceSlug: string;
  projectId: string;
  columnId: string;
  name: string;
  tasks: KanbanDragTask[];
  dragDisabled?: boolean;
  onTaskOpen?: (taskId: string) => void;
};

function nextTaskPosition(tasks: KanbanDragTask[]): number {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map((task) => task.position)) + 1;
}

export function KanbanColumn({
  workspaceSlug,
  projectId,
  columnId,
  name,
  tasks,
  dragDisabled = false,
  onTaskOpen,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <section className="flex w-72 shrink-0 flex-col rounded-lg border border-stone-200 bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-stone-800">{name}</h2>
        <span className="text-xs font-medium tabular-nums text-stone-500">{tasks.length}</span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex min-h-[120px] flex-1 flex-col gap-2 p-3 transition-colors ${
          isOver ? "bg-stone-100/80" : ""
        }`}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="rounded-md border border-dashed border-stone-200 px-3 py-6 text-center text-xs text-stone-400">
              No tasks in this column
            </p>
          ) : (
            tasks.map((task) => (
              <KanbanSortableTaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                position={task.position}
                priority={task.priority}
                dueDate={task.dueDate}
                assignee={task.assignee}
                dragDisabled={dragDisabled}
                onOpen={() => onTaskOpen?.(task.id)}
              />
            ))
          )}
        </SortableContext>

        <CreateTaskForm
          workspaceSlug={workspaceSlug}
          projectId={projectId}
          columnId={columnId}
          nextPosition={nextTaskPosition(tasks)}
        />
      </div>
    </section>
  );
}
