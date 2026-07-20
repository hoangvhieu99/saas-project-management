import type { BoardColumn, Membership, Project, Task, Workspace } from "@prisma/client";
import { prisma } from "@/lib/shared/db";
import { requireWorkspaceContext } from "@/lib/workspace";

export type ProjectContext = {
  workspace: Workspace;
  membership: Membership;
  project: Project;
};

export type TaskContext = {
  workspace: Workspace;
  membership: Membership;
  project: Project;
  task: Task & {
    column: BoardColumn & {
      project: Project;
    };
  };
};

/**
 * Require that the user is a member of the workspace and that the project slug belongs there.
 * Missing workspace, non-member, or bad project slug all resolve to NOT_FOUND.
 */
export async function requireProjectContext(
  userId: string,
  workspaceSlug: string,
  projectSlug: string,
): Promise<ProjectContext> {
  const context = await requireWorkspaceContext(userId, workspaceSlug);

  const project = await prisma.project.findFirst({
    where: {
      workspaceId: context.workspace.id,
      slug: projectSlug,
    },
  });

  if (!project) {
    throw new Error("NOT_FOUND");
  }

  return {
    workspace: context.workspace,
    membership: context.membership,
    project,
  };
}

/**
 * Require that the task belongs to the exact project inside the exact workspace.
 * One nested where-chain closes IDOR across sibling projects in the same workspace.
 */
export async function requireTaskInProject(
  userId: string,
  workspaceSlug: string,
  projectId: string,
  taskId: string,
): Promise<TaskContext> {
  const context = await requireWorkspaceContext(userId, workspaceSlug);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      column: {
        projectId,
        project: {
          workspaceId: context.workspace.id,
        },
      },
    },
    include: {
      column: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  return {
    workspace: context.workspace,
    membership: context.membership,
    project: task.column.project,
    task,
  };
}

/**
 * Nullable assignee is allowed. Non-member assignee is rejected at app-layer before CRUD lands.
 */
export async function assertAssigneeInWorkspace(
  assigneeId: string | null | undefined,
  workspaceId: string,
): Promise<void> {
  if (!assigneeId) {
    return;
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: assigneeId,
      workspaceId,
    },
  });

  if (!membership) {
    throw new Error("FORBIDDEN");
  }
}
