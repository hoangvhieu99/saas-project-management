import type { TaskPriority } from "@prisma/client";
import { Avatar } from "@/components/ui/avatar";

type KanbanTaskCardProps = {
  title: string;
  priority: TaskPriority;
  dueDate: Date | null;
  assignee: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

const priorityLabel: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityClass: Record<TaskPriority, string> = {
  LOW: "bg-stone-100 text-stone-600",
  MEDIUM: "bg-stone-200 text-stone-700",
  HIGH: "bg-amber-100 text-amber-800",
};

export function KanbanTaskCard({ title, priority, dueDate, assignee }: KanbanTaskCardProps) {
  return (
    <article className="rounded-md border border-stone-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-medium text-stone-900">{title}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityClass[priority]}`}
        >
          {priorityLabel[priority]}
        </span>

        {dueDate ? (
          <time className="text-xs text-stone-500" dateTime={dueDate.toISOString()}>
            {dueDate.toLocaleDateString()}
          </time>
        ) : (
          <span className="text-xs text-stone-400">No due date</span>
        )}
      </div>

      {assignee ? (
        <div className="mt-3 flex items-center gap-2">
          <Avatar name={assignee.name} image={assignee.image} className="h-6 w-6 text-[10px]" />
          <span className="truncate text-xs text-stone-600">{assignee.name ?? "Unnamed"}</span>
        </div>
      ) : null}
    </article>
  );
}
