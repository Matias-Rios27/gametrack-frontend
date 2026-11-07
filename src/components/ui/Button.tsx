import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "default" | "outline"
type Size = "sm" | "default" | "lg" | "icon"

const variantClasses: Record<Variant, string> = {
  // Accion principal
  primary: "bg-primary text-primary-ink hover:brightness-110",
  // Accion de apoyo: borde del color primario, como el boton Wishlist del diseño
  secondary: "border border-primary/60 text-ink hover:border-primary hover:bg-primary/10",
  ghost: "text-muted hover:text-ink hover:bg-surface-2",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
  success: "border border-success/40 text-success hover:bg-success/10",
  // Alias legacy para las vistas aun no rediseñadas
  default: "bg-primary text-primary-ink hover:brightness-110",
  outline: "border border-border text-ink hover:border-primary/60 hover:bg-surface-2",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  default: "h-11 px-5 text-[13px]",
  lg: "h-12 px-7 text-sm",
  icon: "h-11 w-11",
}

interface VariantOptions {
  variant?: Variant
  size?: Size
  className?: string
}

// Clases de boton reutilizables tambien en <Link>
export function buttonVariants({ variant = "primary", size = "default", className }: VariantOptions = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-[0.06em]",
    "transition-[transform,background-color,border-color,color,filter] duration-150",
    "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  )
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />
  )
)
Button.displayName = "Button"

export { Button }
