import * as React from "react";
import { cn } from "@/lib/shared/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium text-stone-700", className)} {...props} />
  );
}
