import { TaskPriority } from "@prisma/client";
import { z } from "zod";

/** Project naming stays aligned with workspace display-name constraints. */
export const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(80, "Name must be at most 80 characters");

/** Project slug mirrors workspace kebab-case rules for future nested routes. */
export const projectSlugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(48, "Slug must be at most 48 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase kebab-case (a-z, 0-9, hyphens)",
  );

export const boardColumnNameSchema = z
  .string()
  .trim()
  .min(1, "Column name is required")
  .max(80, "Column name must be at most 80 characters");

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

export const taskDescriptionSchema = z
  .union([
    z.string().trim().max(5000, "Description must be at most 5000 characters"),
    z.literal(""),
    z.null(),
    z.undefined(),
  ])
  .transform((value) => {
    if (value == null || value === "") return null;
    return value;
  });

export const nonNegativePositionSchema = z.coerce
  .number()
  .int("Position must be an integer")
  .min(0, "Position must be non-negative");

export const cuidSchema = z.string().cuid("Invalid id");

const nullableAssigneeSchema = z
  .union([z.string().cuid("Assignee id must be a valid cuid"), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null));

const nullableDueDateSchema = z
  .union([z.coerce.date(), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value instanceof Date ? value : null));

export const createProjectSchema = z.object({
  name: projectNameSchema,
  slug: projectSlugSchema,
});

/** Session 09 mirrors workspace: rename only, slug changes stay out of scope. */
export const updateProjectSchema = z.object({
  name: projectNameSchema,
});

export const createBoardColumnSchema = z.object({
  name: boardColumnNameSchema,
  position: nonNegativePositionSchema,
});

export const createTaskSchema = z.object({
  columnId: cuidSchema,
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  position: nonNegativePositionSchema,
  dueDate: nullableDueDateSchema,
  priority: z.nativeEnum(TaskPriority),
  assigneeId: nullableAssigneeSchema,
});

export const updateTaskSchema = z.object({
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema.optional(),
  position: nonNegativePositionSchema.optional(),
  dueDate: nullableDueDateSchema.optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: nullableAssigneeSchema.optional(),
});

export const moveTaskSchema = z.object({
  columnId: cuidSchema,
  position: nonNegativePositionSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateBoardColumnInput = z.infer<typeof createBoardColumnSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
