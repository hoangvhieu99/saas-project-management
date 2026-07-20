"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/authz";
import { updateProfileFormSchema } from "@/lib/auth/validators";
import { prisma } from "@/lib/shared/db";

/**
 * Update the signed-in user's name and avatar URL. Self only — no userId param.
 */
export async function updateProfile(input: unknown) {
  const user = await requireUser();

  const parsed = updateProfileFormSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation failed");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image === "" ? null : parsed.data.image,
    },
    select: { id: true, name: true, email: true, image: true },
  });

  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return updated;
}
