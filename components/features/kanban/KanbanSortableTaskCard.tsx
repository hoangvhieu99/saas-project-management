"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanTaskCard } from "@/components/features/kanban/KanbanTaskCard";
import type { KanbanDragTask } from "@/stores/useKanbanDragStore";

type KanbanSortableTaskCardProps = KanbanDragTask & {
  dragDisabled?: boolean;
};

export function KanbanSortableTaskCard({
  id,
  title,
  priority,
  dueDate,
  assignee,
  dragDisabled = false,
}: KanbanSortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanTaskCard title={title} priority={priority} dueDate={dueDate} assignee={assignee} />
    </div>
  );
}
