import { CreateWorkspaceDialog } from "@/components/features/workspace/create-workspace-dialog";

export function WorkspaceEmptyState() {
  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-dashed border-stone-300 bg-white px-6 py-10 text-center">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-stone-900">No workspaces yet</h2>
        <p className="text-sm text-stone-500">
          Create your first workspace to start organizing projects. You will become the owner.
        </p>
      </div>
      <CreateWorkspaceDialog triggerLabel="Create workspace" triggerVariant="default" />
    </div>
  );
}
