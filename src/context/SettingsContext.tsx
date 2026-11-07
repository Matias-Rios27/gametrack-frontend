"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

// Acentos disponibles: todos claros, para que el texto oscuro sobre el boton primario cumpla contraste
export const ACCENT_COLORS = [
  { name: "Lima", value: "#a3e635" },
  { name: "Cian", value: "#22d3ee" },
  { name: "Esmeralda", value: "#34d399" },
  { name: "Coral", value: "#fb7185" },
  { name: "Ámbar", value: "#f59e0b" },
] as const

export type AccentColor = (typeof ACCENT_COLORS)[number]["value"]

const DEFAULT_ACCENT: AccentColor = "#a3e635"

const isAccent = (value: string | null): value is AccentColor =>
  ACCENT_COLORS.some((color) => color.value === value)

interface SettingsContextType {
  theme: Theme
  accentColor: AccentColor
  language: string
  // Animacion del muro de juegos de fondo (WCAG 2.2.2: debe poder pausarse)
  backgroundMotion: boolean
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  setLanguage: (lang: string) => void
  setBackgroundMotion: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Lee una preferencia guardada; en el servidor no existe localStorage
const readSaved = (key: string) => {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Inicializadores perezosos: leen la preferencia una sola vez, sin un render extra
  const [theme, setTheme] = useState<Theme>(() => (readSaved("gt-theme") === "light" ? "light" : "dark"))
  // Un acento antiguo que ya no esta en la lista se ignora
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = readSaved("gt-accent")
    return isAccent(saved) ? saved : DEFAULT_ACCENT
  })
  const [language, setLanguage] = useState(() => readSaved("gt-lang") || "es")
  const [backgroundMotion, setBackgroundMotion] = useState(() => readSaved("gt-bg-motion") !== "off")

  // Aplica los cambios al DOM
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
    localStorage.setItem("gt-theme", theme)

    root.style.setProperty("--primary", accentColor)
    localStorage.setItem("gt-accent", accentColor)

    root.lang = language
    localStorage.setItem("gt-lang", language)

    localStorage.setItem("gt-bg-motion", backgroundMotion ? "on" : "off")
  }, [theme, accentColor, language, backgroundMotion])

  return (
    <SettingsContext.Provider
      value={{ theme, accentColor, language, backgroundMotion, setTheme, setAccentColor, setLanguage, setBackgroundMotion }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
