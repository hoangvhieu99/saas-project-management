import type { Membership, Workspace } from "@prisma/client";
import { WorkspaceRole } from "@prisma/client";
import { prisma } from "@/lib/shared/db";

/**
 * Authenticated access to one workspace for a user.
 * Centered on Workspace — membership is the proof of access, not the primary concept.
 */
export type WorkspaceContext = {
  workspace: Workspace;
  membership: Membership;
};

async function findWorkspaceContext(
  userId: string,
  slug: string,
): Promise<WorkspaceContext | null> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      workspace: { slug },
    },
    include: { workspace: true },
  });

  if (!membership) return null;

  return {
    workspace: membership.workspace,
    membership,
  };
}

/**
 * Require that the user is a member of the workspace identified by slug.
 * Missing workspace and non-member both throw NOT_FOUND (no existence leak).
 */
export async function requireWorkspaceContext(
  userId: string,
  slug: string,
): Promise<WorkspaceContext> {
  const context = await findWorkspaceContext(userId, slug);
  if (!context) {
    throw new Error("NOT_FOUND");
  }
  return context;
}

/**
 * Require membership and OWNER role for the workspace identified by slug.
 * Non-member / missing → NOT_FOUND; member but not OWNER → FORBIDDEN.
 */
export async function requireWorkspaceOwner(
  userId: string,
  slug: string,
): Promise<WorkspaceContext> {
  const context = await requireWorkspaceContext(userId, slug);
  if (context.membership.role !== WorkspaceRole.OWNER) {
    throw new Error("FORBIDDEN");
  }
  return context;
}
