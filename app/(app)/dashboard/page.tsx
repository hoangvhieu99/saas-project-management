import Link from "next/link";
import { redirect } from "next/navigation";
import { WorkspaceRole } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { listWorkspaces } from "@/app/actions/workspace/queries";
import { DashboardSummary } from "@/components/features/dashboard/dashboard-summary";
import { WorkspaceEmptyState } from "@/components/features/workspace/workspace-empty-state";
import { CreateWorkspaceDialog } from "@/components/features/workspace/create-workspace-dialog";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workspaces = await listWorkspaces();

  if (workspaces.length === 0) {
    return <WorkspaceEmptyState />;
  }

  const total = workspaces.length;
  const ownerCount = workspaces.filter(({ role }) => role === WorkspaceRole.OWNER).length;
  const memberCount = total - ownerCount;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500">
            Choose a workspace or create another one.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      <DashboardSummary total={total} ownerCount={ownerCount} memberCount={memberCount} />

      <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
        {workspaces.map(({ workspace, role }) => (
          <li key={workspace.id}>
            <Link
              href={`/w/${workspace.slug}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-stone-50"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">{workspace.name}</p>
                <p className="text-xs text-stone-500">/{workspace.slug}</p>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {role}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
