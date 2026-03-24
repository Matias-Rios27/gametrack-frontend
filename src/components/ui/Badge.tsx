import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2",
        {
          "border-transparent bg-electric-blue text-black hover:bg-electric-blue/90 shadow-sm shadow-electric-blue/20": variant === "default",
          "border-transparent bg-black/10 dark:bg-white/10 text-foreground hover:bg-black/20 dark:hover:bg-white/20": variant === "secondary",
          "text-foreground border-border-color": variant === "outline",
          "border-transparent bg-emerald-500/15 text-emerald-400": variant === "success",
          "border-transparent bg-amber-500/15 text-amber-400": variant === "warning",
          "border-transparent bg-red-500/15 text-red-400": variant === "danger",
          "border-transparent bg-blue-500/15 text-blue-400": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
