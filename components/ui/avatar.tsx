import { cn } from "@/lib/shared/utils";

export function Avatar({
  name,
  image,
  className,
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  const initials = (name ?? "?").slice(0, 2).toUpperCase();
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "avatar"}
        className={cn("h-8 w-8 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white",
        className,
      )}
    >
      {initials}
    </div>
  );
}
