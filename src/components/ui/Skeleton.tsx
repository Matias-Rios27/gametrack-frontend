import { cn } from "@/lib/utils"

// Bloque de carga: se oculta a lectores de pantalla, el contenedor anuncia el estado
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-surface-2", className)} />
}

// Contenedor que anuncia la carga una sola vez
export function LoadingRegion({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
