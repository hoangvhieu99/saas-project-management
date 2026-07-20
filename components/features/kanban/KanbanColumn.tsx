"use client";

import type { TaskPriority } from "@prisma/client";
import { CreateTaskForm } from "@/components/features/kanban/create-task-form";
import { KanbanTaskCard } from "@/components/features/kanban/KanbanTaskCard";

type KanbanColumnTask = {
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
};

type KanbanColumnProps = {
  workspaceSlug: string;
  projectId: string;
  columnId: string;
  name: string;
  tasks: KanbanColumnTask[];
};

function nextTaskPosition(tasks: KanbanColumnTask[]): number {
  if (tasks.length === 0) return 0;
  return Math.max(...tasks.map((task) => task.position)) + 1;
}

export function KanbanColumn({
  workspaceSlug,
  projectId,
  columnId,
  name,
  tasks,
}: KanbanColumnProps) {
  return (
    <section className="flex w-72 shrink-0 flex-col rounded-lg border border-stone-200 bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-stone-800">{name}</h2>
        <span className="text-xs font-medium tabular-nums text-stone-500">{tasks.length}</span>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-stone-200 px-3 py-6 text-center text-xs text-stone-400">
            No tasks in this column
          </p>
        ) : (
          tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              title={task.title}
              priority={task.priority}
              dueDate={task.dueDate}
              assignee={task.assignee}
            />
          ))
        )}

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
