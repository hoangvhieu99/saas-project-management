"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectForm } from "@/components/features/kanban/create-project-form";

type CreateProjectDialogProps = {
  workspaceSlug: string;
  triggerLabel?: string;
  triggerVariant?: "default" | "secondary" | "outline" | "ghost";
  triggerClassName?: string;
};

export function CreateProjectDialog({
  workspaceSlug,
  triggerLabel = "New project",
  triggerVariant = "outline",
  triggerClassName,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size="sm"
        className={triggerClassName}
        aria-label={triggerLabel || "New project"}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {triggerLabel ? triggerLabel : null}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/40"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="relative z-10 w-full max-w-md rounded-lg border border-stone-200 bg-white p-5 shadow-lg"
          >
            <div className="mb-4 space-y-1">
              <h2 id="create-project-title" className="text-lg font-semibold text-stone-900">
                Create project
              </h2>
              <p className="text-sm text-stone-500">
                A board with Todo, Doing, and Done columns will be created automatically.
              </p>
            </div>
            <CreateProjectForm workspaceSlug={workspaceSlug} onSuccess={() => setOpen(false)} />
            <Button
              type="button"
              variant="ghost"
              className="mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
