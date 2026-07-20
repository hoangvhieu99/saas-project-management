import { z } from "zod";

/** Display name — required, trimmed, aligned with auth name length. */
export const workspaceNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(80, "Name must be at most 80 characters");

/**
 * Public URL segment: kebab-case, lowercase, URL-safe.
 * Uniqueness is enforced by the database, not this schema.
 */
export const workspaceSlugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(48, "Slug must be at most 48 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase kebab-case (a-z, 0-9, hyphens)",
  );

export const createWorkspaceSchema = z.object({
  name: workspaceNameSchema,
  slug: workspaceSlugSchema,
});

/** Session 02: rename only — slug changes are out of scope. */
export const updateWorkspaceSchema = z.object({
  name: workspaceNameSchema,
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
