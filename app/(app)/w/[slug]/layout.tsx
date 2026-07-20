import { notFound, redirect } from "next/navigation";
import { getWorkspaceBySlug } from "@/app/actions/workspace/queries";

export default async function WorkspaceSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    await getWorkspaceBySlug(slug);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") redirect("/login");
    if (message === "NOT_FOUND") notFound();
    throw error;
  }

  return children;
}
