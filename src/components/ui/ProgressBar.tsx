import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  label: string
  className?: string
}

// Barra de progreso accesible (0 a 100)
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safe = Math.min(100, Math.max(0, Math.round(value)))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/15", className)}
    >
      <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${safe}%` }} />
    </div>
  )
}
