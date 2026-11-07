"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CoverRailProps {
  label: string
  children: React.ReactNode
}

// Fila horizontal de portadas con scroll-snap y flechas en escritorio
export function CoverRail({ label, children }: CoverRailProps) {
  const scrollerRef = useRef<HTMLUListElement>(null)

  const scroll = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" })
  }

  const arrowClass =
    "absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-bg/90 text-ink transition-colors hover:border-primary hover:text-primary-text md:flex"

  return (
    <div className="relative">
      <button type="button" onClick={() => scroll(-1)} aria-label={`Desplazar ${label} a la izquierda`} className={`${arrowClass} -left-4`}>
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <ul
        ref={scrollerRef}
        aria-label={label}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:thin]"
      >
        {children}
      </ul>
      <button type="button" onClick={() => scroll(1)} aria-label={`Desplazar ${label} a la derecha`} className={`${arrowClass} -right-4`}>
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  )
}
