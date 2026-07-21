"use client";

import { useEffect } from "react";
import { TaskPriority } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { updateTask } from "@/app/actions/project/mutations";
import { taskTitleSchema } from "@/lib/project";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { KanbanDragTask } from "@/stores/useKanbanDragStore";

/** UI-only — dueDate as date-input string; payload assembled from dirtyFields. */
const taskDetailFormSchema = z.object({
  title: taskTitleSchema,
  description: z.string().max(5000, "Description must be at most 5000 characters"),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string(),
});

type TaskDetailFormInput = z.infer<typeof taskDetailFormSchema>;

/** Partial update payload — omit key = unchanged; null = clear. dueDate string coerced server-side. */
type TaskDetailUpdatePayload = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
};

type TaskDetailDrawerProps = {
  workspaceSlug: string;
  projectId: string;
  task: KanbanDragTask | null;
  onClose: () => void;
};

function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function TaskDetailDrawer({
  workspaceSlug,
  projectId,
  task,
  onClose,
}: TaskDetailDrawerProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields, isDirty },
  } = useForm<TaskDetailFormInput>({
    resolver: zodResolver(taskDetailFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      dueDate: "",
    },
  });

  useEffect(() => {
    if (!task) return;
    reset({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      dueDate: toDateInputValue(task.dueDate),
    });
  }, [task, reset]);

  async function onSubmit(values: TaskDetailFormInput) {
    if (!task) return;

    const payload: TaskDetailUpdatePayload = {};

    if (dirtyFields.title) {
      payload.title = values.title;
    }
    if (dirtyFields.description) {
      const trimmed = values.description.trim();
      payload.description = trimmed === "" ? null : trimmed;
    }
    if (dirtyFields.priority) {
      payload.priority = values.priority;
    }
    if (dirtyFields.dueDate) {
      payload.dueDate = values.dueDate === "" ? null : values.dueDate;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      await updateTask(workspaceSlug, projectId, task.id, payload);
      toast.success("Task updated");
      onClose();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";

      if (message === "UNAUTHORIZED") {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(message);
    }
  }

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40"
        aria-label="Close task detail"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-lg"
      >
        <header className="flex items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div className="min-w-0 space-y-1">
            <h2 id="task-detail-title" className="text-lg font-semibold text-stone-900">
              Task detail
            </h2>
            <p className="text-sm text-stone-500">Edit fields and save. Unchanged fields are left alone.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" autoComplete="off" disabled={isSubmitting} {...register("title")} />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                rows={5}
                disabled={isSubmitting}
                placeholder="Optional notes…"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <select
                id="task-priority"
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("priority")}
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
              {errors.priority && <p className="text-xs text-red-600">{errors.priority.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due date</Label>
              <Input
                id="task-due-date"
                type="date"
                disabled={isSubmitting}
                {...register("dueDate")}
              />
              <p className="text-xs text-stone-500">Clear the date to remove the due date.</p>
              {errors.dueDate && <p className="text-xs text-red-600">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-2 border-t border-stone-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Assignee</p>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    name={task.assignee.name}
                    image={task.assignee.image}
                    className="h-7 w-7 text-[10px]"
                  />
                  <span className="truncate text-sm text-stone-700">
                    {task.assignee.name ?? "Unnamed"}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-stone-400">Unassigned</p>
              )}
              <p className="text-xs text-stone-400">Read-only until workspace member picker lands.</p>
            </div>
          </div>

          <footer className="flex gap-2 border-t border-stone-200 px-5 py-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
