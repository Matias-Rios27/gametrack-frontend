import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  default: "border-primary/70 text-primary-text",
  secondary: "border-transparent bg-surface-2 text-ink",
  outline: "border-border text-muted",
  success: "border-success/50 text-success",
  warning: "border-warning/50 text-warning",
  danger: "border-danger/50 text-danger",
  info: "border-info/50 text-info",
}

// Etiqueta pequeña en mayusculas con borde, como "NEWS" en el diseño
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
