"use client"

import type { CSSProperties } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CardNav, { type CardNavItem, type CardNavLink } from "@/components/reactbits/CardNav"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { addGameHref } from "./navigation"

// Enlace sin href: CardNav lo renderiza como boton
const LOGOUT_LABEL = "Cerrar sesión"

// Variables de CardNav mapeadas a los tokens del proyecto (siguen tema y acento)
const tokenVars = {
  "--cn-panel": "color-mix(in oklab, var(--surface) 88%, transparent)",
  "--cn-solid": "var(--surface)",
  "--cn-edge": "var(--border)",
  "--cn-highlight": "transparent",
  "--cn-text": "var(--ink)",
  "--cn-muted": "var(--muted)",
  "--cn-hover": "color-mix(in oklab, var(--ink) 7%, transparent)",
  "--cn-ring": "var(--ring)",
  "--cn-tile": "var(--surface-2)",
  "--cn-tile-rim": "inset 0 0 0 1px var(--border)",
  "--cn-cta": "var(--primary)",
  "--cn-cta-ink": "var(--primary-ink)",
  "--cn-cta-shadow": "none",
  "--cn-cta-hover": "brightness(1.1)",
} as CSSProperties

// Barra principal: menu de tarjetas, logo al centro y accion principal a la derecha
export function Navbar() {
  const { logout, userData, user } = useAuth()
  const { theme } = useSettings()
  const router = useRouter()
  const name: string = userData?.name || user?.displayName || "Jugador"

  const items: CardNavItem[] = [
    {
      label: "Biblioteca",
      description: "Tus juegos, tus horas y tu progreso.",
      links: [
        { label: "Inicio", href: "/" },
        { label: "Mis juegos", href: "/games" },
        { label: "Añadir juego", href: addGameHref },
      ],
    },
    {
      label: "Diario y wishlist",
      description: "Lo que ya jugaste y lo que quieres jugar.",
      links: [
        { label: "Diario", href: "/diary" },
        { label: "Nueva entrada", href: "/diary/new" },
        { label: "Wishlist", href: "/wishlist" },
      ],
    },
    {
      label: "Cuenta",
      description: `Sesión iniciada como ${name}.`,
      links: [
        { label: "Perfil", href: "/profile" },
        { label: "Configuración", href: "/settings" },
        { label: LOGOUT_LABEL },
      ],
    },
  ]

  const handleLinkClick = async (link: CardNavLink) => {
    if (link.href || link.label !== LOGOUT_LABEL) return
    await logout()
    router.push("/login")
  }

  return (
    <header className="relative z-40 px-3 pt-3 md:px-8">
      <CardNav
        items={items}
        logo={
          <span className="display-title text-2xl">
            Game<span className="text-primary-text">Track</span>
          </span>
        }
        logoHref="/"
        logoAlt="GameTrack, ir al inicio"
        cta={{ label: "Añadir juego", href: addGameHref }}
        linkComponent={Link}
        onLinkClick={handleLinkClick}
        theme={theme}
        surface="glass"
        cardEffect="rise"
        maxWidth={1216}
        ariaLabel="Principal"
        style={tokenVars}
      />
    </header>
  )
}
