import { notFound, redirect } from "next/navigation";
import { getProjectBySlug } from "@/app/actions/project/queries";
import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug: workspaceSlug, projectSlug } = await params;

  let project;

  try {
    project = await getProjectBySlug(workspaceSlug, projectSlug);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    // Defensive only: middleware + AuthenticatedShell + w/[slug]/layout already gate auth.
    // UNAUTHORIZED here would only come from requireUser() if the session expires mid-render.
    if (message === "UNAUTHORIZED") redirect("/login");
    if (message === "NOT_FOUND") notFound();
    throw error;
  }

  return <KanbanBoard projectName={project.name} columns={project.columns} />;
}
