"use server";

import { requireUser } from "@/lib/auth/authz";
import { prisma } from "@/lib/shared/db";

/**
 * Current user's profile from DB (source of truth for the profile form).
 */
export async function getProfile() {
  const user = await requireUser();

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true },
  });

  if (!profile) {
    throw new Error("NOT_FOUND");
  }

  return profile;
}
