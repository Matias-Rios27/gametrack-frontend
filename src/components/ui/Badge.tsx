import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
        {
          "border-transparent bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-500/20": variant === "default",
          "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700": variant === "secondary",
          "text-slate-300 border-slate-700": variant === "outline",
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
