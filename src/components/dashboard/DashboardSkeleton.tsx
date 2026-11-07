import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton"

// Esqueleto con la misma forma que el dashboard real
export function DashboardSkeleton() {
  return (
    <LoadingRegion label="Cargando tu dashboard" className="flex flex-col gap-12">
      <Skeleton className="h-[460px] w-full rounded-2xl md:h-[520px]" />

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-surface p-6">
            <Skeleton className="h-6 w-6" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-5 h-7 w-64" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-36 shrink-0 md:w-44">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-5 h-7 w-56" />
        <div className="divide-y divide-border rounded-xl border border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-16 w-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoadingRegion>
  )
}
