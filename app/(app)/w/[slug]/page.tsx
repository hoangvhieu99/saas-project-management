import { getWorkspaceBySlug } from "@/app/actions/workspace/queries";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { workspace, role } = await getWorkspaceBySlug(slug);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        {workspace.name}
      </h1>
      <p className="text-sm text-stone-500">
        Workspace shell — boards and calendar land in later phases.
      </p>
      <p className="text-sm text-stone-600">
        Slug <span className="font-medium text-stone-800">{workspace.slug}</span>
        {" · "}
        Role <span className="font-medium text-stone-800">{role}</span>
      </p>
    </div>
  );
}
