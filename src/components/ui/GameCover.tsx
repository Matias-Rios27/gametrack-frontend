"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface GameCoverProps {
  src?: string | null
  title: string
  className?: string
  // Imagen decorativa: el titulo ya se muestra al lado
  decorative?: boolean
}

// Iniciales para el respaldo cuando no hay imagen o falla la carga
const initials = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")

// Portada de juego con respaldo tipografico; el zoom en hover lo activa el padre con la clase "group"
export function GameCover({ src, title, className, decorative = false }: GameCoverProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-surface-2", className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- portadas de dominios arbitrarios (Steam, Firebase, URLs del usuario)
        <img
          src={src!}
          alt={decorative ? "" : `Portada de ${title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : `Portada de ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-2 to-border"
        >
          <span aria-hidden="true" className="display-title text-3xl text-muted">
            {initials(title) || "?"}
          </span>
        </div>
      )}
    </div>
  )
}
