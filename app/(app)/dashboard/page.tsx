import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Dashboard</h1>
      <p className="text-sm text-stone-500">
        Phase 0 foundation is ready. Workspace and boards land in later phases.
      </p>
      <p className="text-sm text-stone-600">
        Signed in as <span className="font-medium">{session.user.email}</span>
      </p>
    </div>
  );
}
