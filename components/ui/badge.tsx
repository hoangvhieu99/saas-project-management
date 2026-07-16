import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-teal-100 text-teal-800",
        variant === "secondary" && "bg-stone-100 text-stone-700",
        variant === "outline" && "border border-stone-300 text-stone-700",
        className,
      )}
      {...props}
    />
  );
}
