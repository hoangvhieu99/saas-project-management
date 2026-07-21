import type { TaskPriority } from "@prisma/client";
import { create } from "zustand";

export type KanbanDragTask = {
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
};

type KanbanDragState = {
  activeTask: KanbanDragTask | null;
  setActiveTask: (task: KanbanDragTask | null) => void;
  clearActiveTask: () => void;
};

export const useKanbanDragStore = create<KanbanDragState>((set) => ({
  activeTask: null,
  setActiveTask: (task) => set({ activeTask: task }),
  clearActiveTask: () => set({ activeTask: null }),
}));
