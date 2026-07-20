"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/authz";
import {
  assertAssigneeInWorkspace,
  createProjectSchema,
  createTaskSchema,
  requireColumnInProject,
  requireTaskInProject,
  updateTaskSchema,
} from "@/lib/project";
import { requireWorkspaceContext } from "@/lib/workspace";
import { prisma } from "@/lib/shared/db";

const DEFAULT_COLUMNS = [
  { name: "Todo", position: 0 },
  { name: "Doing", position: 1 },
  { name: "Done", position: 2 },
] as const;

/**
 * Create project + default board columns (Todo / Doing / Done) in one transaction.
 * Unique slug within workspace → CONFLICT.
 */
export async function createProject(workspaceSlug: string, input: unknown) {
  const user = await requireUser();
  const context = await requireWorkspaceContext(user.id, workspaceSlug);

  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const { name, slug } = parsed.data;

  try {
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          name,
          slug,
          workspaceId: context.workspace.id,
        },
      });

      await tx.boardColumn.createMany({
        data: DEFAULT_COLUMNS.map((column) => ({
          projectId: created.id,
          name: column.name,
          position: column.position,
        })),
      });

      return created;
    });

    revalidatePath(`/w/${workspaceSlug}`);

    return project;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("CONFLICT");
    }
    throw error;
  }
}

/**
 * Create task in a column. Column must belong to projectId and workspace (nested verify).
 * Invalid assignee → FORBIDDEN.
 */
export async function createTask(
  workspaceSlug: string,
  projectId: string,
  input: unknown,
) {
  const user = await requireUser();
  const context = await requireWorkspaceContext(user.id, workspaceSlug);

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const { columnId, title, description, position, dueDate, priority, assigneeId } =
    parsed.data;

  await requireColumnInProject(context.workspace.id, projectId, columnId);
  await assertAssigneeInWorkspace(assigneeId, context.workspace.id);

  const task = await prisma.task.create({
    data: {
      columnId,
      title,
      description,
      position,
      dueDate,
      priority,
      assigneeId,
    },
  });

  revalidatePath(`/w/${workspaceSlug}`);

  return task;
}

/**
 * Update task fields. Task must belong to projectId in workspace (IDOR guard).
 * Assignee update runs through assertAssigneeInWorkspace when assigneeId is present in payload.
 */
export async function updateTask(
  workspaceSlug: string,
  projectId: string,
  taskId: string,
  input: unknown,
) {
  const user = await requireUser();
  const { task, workspace } = await requireTaskInProject(
    user.id,
    workspaceSlug,
    projectId,
    taskId,
  );

  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  if (parsed.data.assigneeId !== undefined) {
    await assertAssigneeInWorkspace(parsed.data.assigneeId, workspace.id);
  }

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: parsed.data,
  });

  revalidatePath(`/w/${workspaceSlug}`);

  return updated;
}
