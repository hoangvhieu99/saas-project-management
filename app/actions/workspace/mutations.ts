"use server";

import { Prisma, WorkspaceRole } from "@prisma/client";
import { requireUser } from "@/lib/auth/authz";
import {
  createWorkspaceSchema,
  requireWorkspaceOwner,
  updateWorkspaceSchema,
} from "@/lib/workspace";
import { prisma } from "@/lib/shared/db";

/**
 * Create workspace + OWNER membership in one transaction.
 * Unique slug race → CONFLICT.
 */
export async function createWorkspace(input: unknown) {
  const user = await requireUser();

  const parsed = createWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const { name, slug } = parsed.data;

  try {
    return await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: { name, slug },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: WorkspaceRole.OWNER,
        },
      });

      return workspace;
    });
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
 * Rename workspace. OWNER only; MEMBER → FORBIDDEN; non-member → NOT_FOUND.
 */
export async function updateWorkspace(slug: string, input: unknown) {
  const user = await requireUser();
  const { workspace } = await requireWorkspaceOwner(user.id, slug);

  const parsed = updateWorkspaceSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  return prisma.workspace.update({
    where: { id: workspace.id },
    data: { name: parsed.data.name },
  });
}

/**
 * Delete workspace. OWNER only.
 * Membership rows are removed by Prisma `onDelete: Cascade` — do not delete manually.
 */
export async function deleteWorkspace(slug: string) {
  const user = await requireUser();
  const { workspace } = await requireWorkspaceOwner(user.id, slug);

  await prisma.workspace.delete({
    where: { id: workspace.id },
  });
}
