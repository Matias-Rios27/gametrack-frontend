"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { addGameHref, isActivePath, mainNav } from "./navigation"

// Dock inferior en movil: cuatro secciones y la accion principal al centro
export function MobileNav() {
  const pathname = usePathname()
  const [first, second, ...rest] = mainNav
  const addActive = isActivePath(pathname, addGameHref)

  const renderItem = (item: (typeof mainNav)[number]) => {
    const active = isActivePath(pathname, item.href)
    return (
      <li key={item.href} className="flex-1">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors",
            active ? "text-primary-text" : "text-muted hover:text-ink"
          )}
        >
          <item.icon aria-hidden="true" className="h-5 w-5" />
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <nav aria-label="Principal móvil" className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <ul className="flex items-center gap-1 rounded-2xl border border-border bg-surface/95 px-2 py-1 shadow-2xl shadow-black/50 backdrop-blur">
        {renderItem(first)}
        {renderItem(second)}
        <li className="flex-1">
          <Link
            href={addGameHref}
            aria-current={addActive ? "page" : undefined}
            aria-label="Añadir juego"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-ink transition-transform active:scale-95"
          >
            <Plus aria-hidden="true" className="h-6 w-6" />
          </Link>
        </li>
        {rest.map(renderItem)}
      </ul>
    </nav>
  )
}
