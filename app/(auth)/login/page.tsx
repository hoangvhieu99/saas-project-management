import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-3xl font-semibold tracking-tight text-teal-900">PulseBoard</p>
          <p className="mt-1 text-sm text-stone-600">Project management for focused teams</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
