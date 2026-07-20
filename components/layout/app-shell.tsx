"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/features/workspace/create-workspace-dialog";
import {
  WorkspaceSwitcher,
  type WorkspaceListItem,
} from "@/components/features/workspace/workspace-switcher";

type ShellUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function AppShell({
  user,
  workspaces,
  children,
}: {
  user: ShellUser;
  workspaces: WorkspaceListItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      <aside className="flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
        <div className="border-b border-stone-100 px-4 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-teal-900">
            PulseBoard
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between px-3">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Workspaces
              </p>
              <CreateWorkspaceDialog
                triggerLabel=""
                triggerVariant="ghost"
                triggerClassName="h-7 w-7 shrink-0 p-0"
              />
            </div>
            <WorkspaceSwitcher items={workspaces} />
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-2 border-b border-stone-200 bg-white px-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-stone-50"
          >
            <Avatar name={user.name} image={user.image} />
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.name ?? "User"}</p>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4 text-stone-600" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
