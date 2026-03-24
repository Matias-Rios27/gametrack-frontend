"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"
type AccentColor = "#00f0ff" | "#7c3aed" | "#10b981" | "#f43f5e" | "#f59e0b"

interface SettingsContextType {
  theme: Theme
  accentColor: AccentColor
  language: string
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  setLanguage: (lang: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [accentColor, setAccentColor] = useState<AccentColor>("#00f0ff")
  const [language, setLanguage] = useState("es")

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("gt-theme") as Theme
    const savedAccent = localStorage.getItem("gt-accent") as AccentColor
    const savedLang = localStorage.getItem("gt-lang")

    if (savedTheme) setTheme(savedTheme)
    if (savedAccent) setAccentColor(savedAccent)
    if (savedLang) setLanguage(savedLang)
  }, [])

  // Apply changes to DOM
  useEffect(() => {
    const root = window.document.documentElement
    
    // Theme
    if (theme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }
    localStorage.setItem("gt-theme", theme)

    // Accent Color
    root.style.setProperty("--color-electric-blue", accentColor)
    // Derive a dark version for borders/hovers (simplified logic)
    root.style.setProperty("--color-electric-blue-dark", `${accentColor}cc`) 
    localStorage.setItem("gt-accent", accentColor)

    // Language
    root.lang = language
    localStorage.setItem("gt-lang", language)
  }, [theme, accentColor, language])

  return (
    <SettingsContext.Provider value={{ theme, accentColor, language, setTheme, setAccentColor, setLanguage }}>
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
