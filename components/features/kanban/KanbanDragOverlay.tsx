"use client";

import { DragOverlay } from "@dnd-kit/core";
import { KanbanTaskCard } from "@/components/features/kanban/KanbanTaskCard";
import { useKanbanDragStore } from "@/stores/useKanbanDragStore";

export function KanbanDragOverlay() {
  const activeTask = useKanbanDragStore((state) => state.activeTask);

  return (
    <DragOverlay dropAnimation={null}>
      {activeTask ? (
        <div className="rotate-2 cursor-grabbing shadow-lg">
          <KanbanTaskCard
            title={activeTask.title}
            priority={activeTask.priority}
            dueDate={activeTask.dueDate}
            assignee={activeTask.assignee}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
}
