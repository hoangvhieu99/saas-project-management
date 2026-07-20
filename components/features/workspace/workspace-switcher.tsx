"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/shared/utils";
import type { WorkspaceRole } from "@prisma/client";

export type WorkspaceListItem = {
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  role: WorkspaceRole;
};

export function WorkspaceSwitcher({ items }: { items: WorkspaceListItem[] }) {
  const params = useParams();
  const activeSlug = typeof params?.slug === "string" ? params.slug : null;

  if (items.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-stone-500">No workspaces yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map(({ workspace }) => {
        const active = workspace.slug === activeSlug;
        return (
          <li key={workspace.id}>
            <Link
              href={`/w/${workspace.slug}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                active
                  ? "bg-teal-50 text-teal-900"
                  : "text-stone-700 hover:bg-stone-100",
              )}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{workspace.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
