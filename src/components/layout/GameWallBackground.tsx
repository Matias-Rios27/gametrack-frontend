"use client"

import { useEffect, useState } from "react"
import GridMotion, { type GridMotionItem } from "@/components/reactbits/GridMotion"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { FEATURED_APPIDS, fetchSteamLibrary, steamCoverUrl } from "@/lib/steam"

// Portadas que se muestran en el muro
const WALL_SIZE = 24
// Con menos juegos propios que esto, se completa con juegos populares
const MIN_OWN_GAMES = 8

const toItems = (appids: number[]): GridMotionItem[] => appids.map((appid) => ({ src: steamCoverUrl(appid), alt: "" }))

const FEATURED_ITEMS = toItems(FEATURED_APPIDS)

// Fondo de la app: muro de portadas de los juegos del usuario (o populares si no tiene Steam)
export function GameWallBackground() {
  const { userData } = useAuth()
  const { theme, backgroundMotion } = useSettings()
  const steamId: string | undefined = userData?.steamId ?? undefined
  const [ownItems, setOwnItems] = useState<GridMotionItem[] | null>(null)

  useEffect(() => {
    if (!steamId) return
    let cancelled = false

    fetchSteamLibrary(steamId).then((library) => {
      if (cancelled) return
      // Los juegos con mas horas primero
      const own = [...library]
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, WALL_SIZE)
        .map((game) => game.appid)
      if (own.length < MIN_OWN_GAMES) return
      setOwnItems(toItems(own))
    })

    return () => {
      cancelled = true
    }
  }, [steamId])

  const items = steamId && ownItems ? ownItems : FEATURED_ITEMS

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <GridMotion
        items={items}
        rows={4}
        aspectRatio={2 / 3}
        gap={14}
        radius={10}
        angle={-10}
        speed={backgroundMotion ? 16 : 0}
        parallax={backgroundMotion ? 0.3 : 0}
        spotlight={0.35}
        dim={0.55}
        grayscale
        fade={0.4}
        theme={theme}
      />
      {/* Velo con el color de fondo: mantiene el contraste AA del texto encima */}
      <div className="absolute inset-0 bg-bg/80" />
    </div>
  )
}
