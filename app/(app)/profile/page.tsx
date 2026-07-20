import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/profile/queries";
import { ProfileForm } from "@/components/features/profile/profile-form";

export default async function ProfilePage() {
  let profile;

  try {
    profile = await getProfile();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") redirect("/login");
    throw error;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Profile</h1>
        <p className="text-sm text-stone-500">Update your display name and avatar URL.</p>
      </div>

      <ProfileForm
        defaultValues={{
          name: profile.name ?? "",
          email: profile.email,
          image: profile.image ?? "",
        }}
      />
    </div>
  );
}
