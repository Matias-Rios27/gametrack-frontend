"use client"

import { useState } from "react"
import Link from "next/link"
import { PenLine, Play, Plus } from "lucide-react"
import SplitText from "@/components/reactbits/SplitText"
import { buttonVariants } from "@/components/ui/Button"
import { GameCover } from "@/components/ui/GameCover"
import { ProgressBar } from "@/components/ui/ProgressBar"
import type { UsuarioJuego } from "@/lib/services/games"
import { steamCoverUrl, steamHeroUrl } from "@/lib/steam"

interface ContinueHeroProps {
  game?: UsuarioJuego
  others: UsuarioJuego[]
}

const titleOf = (game: UsuarioJuego) => game.juego?.titulo || "Juego sin título"
const appidOf = (game: UsuarioJuego) => game.steam_appid ?? game.juego?.steam_appid ?? null
const coverOf = (game: UsuarioJuego) => {
  const appid = appidOf(game)
  return game.juego?.portada_url || (appid ? steamCoverUrl(appid) : null)
}

// Fondo del hero: arte horizontal de Steam o la portada desenfocada
function HeroBackdrop({ src, blur }: { src?: string | null; blur: boolean }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-br from-surface-2 via-surface to-bg" />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arte de Steam o portada del usuario
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className={`absolute inset-0 -z-20 h-full w-full object-cover ${blur ? "scale-110 blur-md" : ""}`}
    />
  )
}

// Hero vacio: invita a la accion principal
function EmptyHero() {
  return (
    <section aria-labelledby="hero-title" className="rounded-2xl border border-border bg-surface p-8 md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-text">Tu backlog</p>
      <h1 id="hero-title" className="display-title mt-4 max-w-2xl text-5xl md:text-6xl">
        No tienes ningún juego en curso
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        Añade un juego o impórtalo desde tu biblioteca de Steam y aquí verás tus horas y tu progreso.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/games/add" className={buttonVariants({ size: "lg" })}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          Añadir juego
        </Link>
        <Link href="/games" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Ver mis juegos
        </Link>
      </div>
    </section>
  )
}

// Hero del dashboard: el juego activo mas reciente a pantalla completa
export function ContinueHero({ game, others }: ContinueHeroProps) {
  if (!game) return <EmptyHero />

  const title = titleOf(game)
  const appid = appidOf(game)
  const background = appid ? steamHeroUrl(appid) : game.juego?.portada_url
  const meta = [game.juego?.plataforma || "PC", `${game.horas_jugadas || 0} h jugadas`, game.juego?.genero].filter(Boolean)

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden rounded-2xl border border-border">
      <HeroBackdrop src={background} blur={!appid} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="flex min-h-[460px] flex-col justify-end gap-10 p-6 text-white md:min-h-[520px] md:p-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Continuar jugando</p>
          <h1 id="hero-title" className="display-title mt-4 text-5xl md:text-7xl">
            <SplitText text={title} tag="span" textAlign="left" trigger="load" splitType="words, chars" delay={25} duration={0.9} />
          </h1>

          <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            {meta.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/50" />}
                {item}
              </li>
            ))}
          </ul>

          {typeof game.progreso === "number" && (
            <div className="mt-6 max-w-sm">
              <div className="mb-2 flex justify-between text-xs uppercase tracking-wider text-white/80">
                <span>Progreso</span>
                <span className="font-semibold text-white">{game.progreso}%</span>
              </div>
              <ProgressBar value={game.progreso} label={`Progreso de ${title}`} className="bg-white/20" />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/games/${game.id}`} className={buttonVariants({ size: "lg" })}>
              <Play aria-hidden="true" className="h-4 w-4" />
              Ver progreso
            </Link>
            <Link href="/diary/new" className={buttonVariants({ variant: "secondary", size: "lg", className: "text-white" })}>
              <PenLine aria-hidden="true" className="h-4 w-4" />
              Escribir en el diario
            </Link>
          </div>
        </div>

        {others.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/75">También jugando</h2>
            <ul className="flex gap-3">
              {others.map((other) => (
                <li key={other.id} className="w-24 md:w-28">
                  <Link href={`/games/${other.id}`} className="group block transition-transform duration-200 hover:-translate-y-0.5">
                    <GameCover
                      src={coverOf(other)}
                      title={titleOf(other)}
                      decorative
                      className="aspect-[3/4] ring-1 ring-white/15 transition-shadow group-hover:ring-2 group-hover:ring-primary"
                    />
                    <span className="mt-2 block truncate text-xs text-white/90">{titleOf(other)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
