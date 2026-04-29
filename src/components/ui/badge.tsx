import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-brand text-gray-900",
        variant === "secondary" && "bg-muted text-muted-foreground",
        variant === "destructive" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        variant === "outline" && "border border-input",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
