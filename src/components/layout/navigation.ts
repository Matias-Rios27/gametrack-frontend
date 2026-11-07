import { BookText, Heart, Home, Library, type LucideIcon } from "lucide-react"

export interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

// Secciones principales: compartidas por la barra superior y el dock movil
export const mainNav: NavItem[] = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Mis juegos", href: "/games", icon: Library },
  { name: "Diario", href: "/diary", icon: BookText },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
]

// Accion principal de la app
export const addGameHref = "/games/add"

// "/games/add" no debe marcar "Mis juegos" como activo
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (pathname.startsWith(addGameHref)) return href === addGameHref
  return pathname === href || pathname.startsWith(`${href}/`)
}
