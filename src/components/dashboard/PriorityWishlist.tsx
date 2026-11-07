import Link from "next/link"
import { ExternalLink, Heart } from "lucide-react"
import { buttonVariants } from "@/components/ui/Button"
import { GameCover } from "@/components/ui/GameCover"
import { SectionHeader } from "@/components/ui/SectionHeader"
import type { WishlistItem } from "@/lib/services/wishlist"
import { steamCoverUrl, steamStoreUrl } from "@/lib/steam"

const VISIBLE = 5

// Lista de la wishlist de prioridad alta, en filas como "Upcoming releases"
export function PriorityWishlist({ items }: { items: WishlistItem[] }) {
  return (
    <section aria-labelledby="wishlist-title">
      <SectionHeader id="wishlist-title" title="Wishlist prioritaria" action={{ label: "Ver wishlist", href: "/wishlist" }} />

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted">No tienes juegos con prioridad alta en tu wishlist.</p>
          <Link href="/wishlist/new" className={buttonVariants({ variant: "secondary", size: "sm", className: "mt-4" })}>
            <Heart aria-hidden="true" className="h-4 w-4" />
            Añadir a la wishlist
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {items.slice(0, VISIBLE).map((item) => {
            const title = item.juego?.titulo || "Juego sin título"
            const appid = item.juego?.steam_appid ?? null
            const cover = item.juego?.portada_url || (appid ? steamCoverUrl(appid) : null)
            const tags = [item.juego?.genero, item.juego?.plataforma].filter(Boolean).join(" / ")

            return (
              <li key={item.id} className="flex items-center gap-4 p-4 md:gap-6 md:px-6">
                <GameCover src={cover} title={title} decorative className="h-16 w-12 shrink-0 rounded-md md:h-20 md:w-[60px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{title}</p>
                  <p className="mt-1 truncate text-xs uppercase tracking-wider text-muted">{tags || "Sin género ni plataforma"}</p>
                </div>
                {appid && (
                  <a
                    href={steamStoreUrl(appid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "secondary", size: "sm", className: "shrink-0" })}
                  >
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver en Steam</span>
                    <span className="sr-only sm:hidden">Ver {title} en Steam</span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
