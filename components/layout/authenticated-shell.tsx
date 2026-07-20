import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { listWorkspaces } from "@/app/actions/workspace/queries";
import { AppShell } from "@/components/layout/app-shell";

export async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const workspaces = await listWorkspaces();

  return (
    <AppShell user={session.user} workspaces={workspaces}>
      {children}
    </AppShell>
  );
}
