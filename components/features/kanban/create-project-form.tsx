"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/app/actions/project/mutations";
import { createProjectSchema, type CreateProjectInput } from "@/lib/project";
import { slugify } from "@/lib/shared/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateProjectFormProps = {
  workspaceSlug: string;
  onSuccess?: () => void;
};

export function CreateProjectForm({ workspaceSlug, onSuccess }: CreateProjectFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", slug: "" },
  });

  const name = watch("name");

  useEffect(() => {
    if (dirtyFields.slug) return;
    setValue("slug", slugify(name), { shouldValidate: name.trim().length > 0 });
  }, [name, dirtyFields.slug, setValue]);

  async function onSubmit(values: CreateProjectInput) {
    try {
      const project = await createProject(workspaceSlug, values);
      toast.success("Project created");
      onSuccess?.();
      router.push(`/w/${workspaceSlug}/projects/${project.slug}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";

      if (message === "CONFLICT") {
        const suggestion = `${values.slug}-2`;
        toast.error("Slug already taken", {
          description: `Try a different URL slug — for example “${suggestion}” or “${values.slug}-team”.`,
        });
        setError("slug", {
          message: `Already in use. Suggestion: ${suggestion}`,
        });
        return;
      }

      if (message === "UNAUTHORIZED") {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Name</Label>
        <Input id="project-name" autoComplete="off" {...register("name")} disabled={isSubmitting} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-slug">Slug</Label>
        <Input id="project-slug" autoComplete="off" {...register("slug")} disabled={isSubmitting} />
        <p className="text-xs text-stone-500">
          Used in the URL: /w/{workspaceSlug}/projects/{watch("slug") || "…"}
        </p>
        {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create project"}
      </Button>
    </form>
  );
}
