"use client";

import { TaskPriority } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { createTask } from "@/app/actions/project/mutations";
import { taskTitleSchema } from "@/lib/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** UI-only schema — title field. Full payload assembled in onSubmit. */
const createTaskFormSchema = z.object({
  title: taskTitleSchema,
});

type CreateTaskFormInput = z.infer<typeof createTaskFormSchema>;

type CreateTaskFormProps = {
  workspaceSlug: string;
  projectId: string;
  columnId: string;
  nextPosition: number;
};

export function CreateTaskForm({
  workspaceSlug,
  projectId,
  columnId,
  nextPosition,
}: CreateTaskFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormInput>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: { title: "" },
  });

  async function onSubmit(values: CreateTaskFormInput) {
    try {
      await createTask(workspaceSlug, projectId, {
        columnId,
        title: values.title,
        description: null,
        position: nextPosition,
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        assigneeId: null,
      });
      toast.success("Task created");
      reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="min-w-0 flex-1">
        <Input
          placeholder="Task title…"
          autoComplete="off"
          disabled={isSubmitting}
          {...register("title")}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>
      <Button type="submit" size="sm" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? "Adding…" : "Add"}
      </Button>
    </form>
  );
}
