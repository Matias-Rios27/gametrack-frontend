import { CoverRail } from "@/components/ui/CoverRail"
import { GameCover } from "@/components/ui/GameCover"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { steamCoverUrl, steamStoreUrl, toHours, type SteamOwnedGame } from "@/lib/steam"

const VISIBLE = 15

// Carril con los juegos de Steam con más horas
export function SteamLibraryRail({ games }: { games: SteamOwnedGame[] }) {
  const visible = games.slice(0, VISIBLE)
  const remaining = games.length - visible.length

  return (
    <section aria-labelledby="steam-library-title">
      <SectionHeader id="steam-library-title" title="Mi biblioteca de Steam" action={{ label: "Importar juegos", href: "/games/add" }} />
      <CoverRail label="Juegos de Steam con más horas">
        {visible.map((game) => (
          <li key={game.appid} className="w-36 shrink-0 snap-start md:w-44">
            <a href={steamStoreUrl(game.appid)} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                <GameCover
                  src={steamCoverUrl(game.appid)}
                  title={game.name}
                  decorative
                  className="aspect-[2/3] border border-border transition-colors group-hover:border-primary/70"
                />
                {game.playtime_forever > 0 && (
                  <span className="absolute bottom-2 right-2 rounded-sm border border-primary/70 bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                    {toHours(game.playtime_forever)} h
                  </span>
                )}
              </div>
              <span className="mt-2 block truncate text-sm font-medium">{game.name}</span>
              <span className="sr-only">(abre la tienda de Steam en otra pestaña)</span>
            </a>
          </li>
        ))}
        {remaining > 0 && (
          <li className="w-36 shrink-0 snap-start md:w-44">
            <div className="flex aspect-[2/3] items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted">
              y {remaining} juegos más en tu biblioteca
            </div>
          </li>
        )}
      </CoverRail>
    </section>
  )
}
