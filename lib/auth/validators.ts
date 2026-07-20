import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const profileImageUrlSchema = z
  .string()
  .max(2048)
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Image URL must use http:// or https://" },
  );

export const updateProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  image: z.union([z.literal(""), profileImageUrlSchema]),
});

export type UpdateProfileFormInput = z.infer<typeof updateProfileFormSchema>;

export type UpdateProfileInput = {
  name: string;
  image: string | null;
};
