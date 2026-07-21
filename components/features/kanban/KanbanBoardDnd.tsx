"use client";

import { useRef, useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { moveTask } from "@/app/actions/project/mutations";
import { KanbanColumn } from "@/components/features/kanban/KanbanColumn";
import { KanbanDragOverlay } from "@/components/features/kanban/KanbanDragOverlay";
import { TaskDetailDrawer } from "@/components/features/kanban/task-detail-drawer";
import {
  isNoOpMove,
  resolveDropTarget,
} from "@/components/features/kanban/kanban-dnd-utils";
import { useKanbanDragStore, type KanbanDragTask } from "@/stores/useKanbanDragStore";

type KanbanBoardColumn = {
  id: string;
  name: string;
  position: number;
  tasks: KanbanDragTask[];
};

type KanbanBoardDndProps = {
  workspaceSlug: string;
  projectId: string;
  columns: KanbanBoardColumn[];
};

function findTask(columns: KanbanBoardColumn[], taskId: string): KanbanDragTask | null {
  for (const column of columns) {
    const task = column.tasks.find((row) => row.id === taskId);
    if (task) {
      return task;
    }
  }
  return null;
}

export function KanbanBoardDnd({ workspaceSlug, projectId, columns }: KanbanBoardDndProps) {
  const router = useRouter();
  const setActiveTask = useKanbanDragStore((state) => state.setActiveTask);
  const clearActiveTask = useKanbanDragStore((state) => state.clearActiveTask);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const suppressOpenRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const selectedTask = selectedTaskId ? findTask(columns, selectedTaskId) : null;

  function armSuppressOpen() {
    suppressOpenRef.current = true;
    setTimeout(() => {
      suppressOpenRef.current = false;
    }, 0);
  }

  function handleTaskOpen(taskId: string) {
    if (suppressOpenRef.current) return;
    setSelectedTaskId(taskId);
  }

  function handleDragStart(event: DragStartEvent) {
    const task = findTask(columns, String(event.active.id));
    setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    clearActiveTask();
    armSuppressOpen();

    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : undefined;
    const target = resolveDropTarget(activeId, overId, columns);

    if (!target || isNoOpMove(columns, activeId, target)) {
      return;
    }

    setIsMoving(true);

    try {
      await moveTask(workspaceSlug, projectId, activeId, {
        columnId: target.columnId,
        position: target.position,
      });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";

      if (message === "UNAUTHORIZED") {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(message);
      router.refresh();
    } finally {
      setIsMoving(false);
    }
  }

  function handleDragCancel() {
    clearActiveTask();
    armSuppressOpen();
  }

  const dragDisabled = isMoving || selectedTaskId !== null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-2">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              workspaceSlug={workspaceSlug}
              projectId={projectId}
              columnId={column.id}
              name={column.name}
              tasks={column.tasks}
              dragDisabled={dragDisabled}
              onTaskOpen={handleTaskOpen}
            />
          ))}
        </div>
        <KanbanDragOverlay />
      </DndContext>

      <TaskDetailDrawer
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  );
}
