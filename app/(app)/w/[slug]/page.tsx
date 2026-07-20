import Link from "next/link";
import { getWorkspaceBySlug } from "@/app/actions/workspace/queries";
import { listProjects } from "@/app/actions/project/queries";
import { CreateProjectDialog } from "@/components/features/kanban/create-project-dialog";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { workspace, role } = await getWorkspaceBySlug(slug);
  const projects = await listProjects(slug);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          {workspace.name}
        </h1>
        <p className="text-sm text-stone-500">
          Open a project board or create a new one.
        </p>
        <p className="text-sm text-stone-600">
          Slug <span className="font-medium text-stone-800">{workspace.slug}</span>
          {" · "}
          Role <span className="font-medium text-stone-800">{role}</span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Projects</h2>
          <CreateProjectDialog workspaceSlug={slug} />
        </div>

        {projects.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed border-stone-200 px-4 py-6 text-center">
            <p className="text-sm text-stone-500">No projects yet. Create one to get a Kanban board.</p>
            <CreateProjectDialog workspaceSlug={slug} triggerLabel="Create first project" />
          </div>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/w/${slug}/projects/${project.slug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-stone-50"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">{project.name}</p>
                    <p className="text-xs text-stone-500">/{project.slug}</p>
                  </div>
                  <span className="text-xs font-medium text-stone-400">Open board</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
