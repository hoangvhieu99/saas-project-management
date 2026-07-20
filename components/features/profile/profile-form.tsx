"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/profile/mutations";
import { updateProfileFormSchema, type UpdateProfileFormInput } from "@/lib/auth/validators";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormProps = {
  defaultValues: {
    name: string;
    email: string;
    image: string;
  };
};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormInput>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: defaultValues.name,
      image: defaultValues.image,
    },
  });

  const name = watch("name");
  const image = watch("image");

  async function onSubmit(values: UpdateProfileFormInput) {
    try {
      const updated = await updateProfile(values);
      await updateSession({ name: updated.name, image: updated.image });
      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";

      if (message === "UNAUTHORIZED") {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <Avatar name={name} image={image || null} className="h-16 w-16 text-base" />
        <p className="text-sm text-stone-500">Avatar preview updates as you type a valid image URL.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input id="profile-name" autoComplete="name" {...register("name")} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={defaultValues.email} readOnly disabled className="bg-stone-50" />
        <p className="text-xs text-stone-500">Email cannot be changed in this version.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-image">Avatar URL</Label>
        <Input
          id="profile-image"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          autoComplete="off"
          {...register("image")}
        />
        <p className="text-xs text-stone-500">Must be http:// or https://. Leave empty to use initials.</p>
        {errors.image && <p className="text-xs text-red-600">{errors.image.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
