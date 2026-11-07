"use client"

import HoloCard from "@/components/reactbits/HoloCard"
import { GameCover } from "@/components/ui/GameCover"
import type { Estado } from "@/lib/services/games"
import { steamCoverUrl } from "@/lib/steam"

interface GameHoloCoverProps {
  title: string
  estado: Estado
  portadaUrl?: string | null
  steamAppid?: number | null
}

// Portada holografica del detalle: dorada para los juegos completados
export function GameHoloCover({ title, estado, portadaUrl, steamAppid }: GameHoloCoverProps) {
  const image = portadaUrl || (steamAppid ? steamCoverUrl(steamAppid) : null)

  // Sin imagen no hay nada que reflejar: portada tipografica
  if (!image) {
    return <GameCover title={title} className="aspect-[3/4] w-full rounded-xl" />
  }

  return (
    <div className="flex justify-center">
      <HoloCard
        image={image}
        alt={`Portada de ${title}`}
        preset={estado === "completado" ? "gold" : "cosmos"}
        width={480}
        radius={12}
        frame={3}
        intensity={0.7}
        tiltMax={10}
      />
    </div>
  )
}
