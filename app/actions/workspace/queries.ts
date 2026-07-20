"use server";

import { requireUser } from "@/lib/auth/authz";
import { requireWorkspaceContext } from "@/lib/workspace";
import { prisma } from "@/lib/shared/db";

/**
 * List workspaces the current user belongs to (any role).
 */
export async function listWorkspaces() {
  const user = await requireUser();

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { createdAt: "desc" },
  });

  return memberships.map((membership) => ({
    workspace: membership.workspace,
    role: membership.role,
  }));
}

/**
 * Get one workspace by slug. Non-member / missing → NOT_FOUND (no leak).
 */
export async function getWorkspaceBySlug(slug: string) {
  const user = await requireUser();
  const context = await requireWorkspaceContext(user.id, slug);

  return {
    workspace: context.workspace,
    role: context.membership.role,
  };
}
