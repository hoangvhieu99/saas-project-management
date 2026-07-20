"use server";

import { requireUser } from "@/lib/auth/authz";
import { requireProjectContext } from "@/lib/project";
import { requireWorkspaceContext } from "@/lib/workspace";
import { prisma } from "@/lib/shared/db";

/**
 * List projects in a workspace the current user belongs to.
 */
export async function listProjects(workspaceSlug: string) {
  const user = await requireUser();
  const context = await requireWorkspaceContext(user.id, workspaceSlug);

  return prisma.project.findMany({
    where: { workspaceId: context.workspace.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get one project by slug with columns and tasks ordered for board foundation.
 * Non-member / missing project → NOT_FOUND.
 */
export async function getProjectBySlug(workspaceSlug: string, projectSlug: string) {
  const user = await requireUser();
  const context = await requireProjectContext(user.id, workspaceSlug, projectSlug);

  const project = await prisma.project.findFirst({
    where: { id: context.project.id },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: {
              assignee: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error("NOT_FOUND");
  }

  return project;
}
