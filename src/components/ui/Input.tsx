import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-ink",
      "placeholder:text-muted transition-colors",
      "hover:border-muted/60 focus-visible:border-primary",
      "aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:opacity-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
