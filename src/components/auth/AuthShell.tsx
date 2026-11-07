"use client"

import Link from "next/link"
import LightRays from "@/components/reactbits/LightRays"
import { useSettings } from "@/context/SettingsContext"

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

// Estructura comun de login y registro: rayos de luz de fondo y panel centrado
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const { accentColor } = useSettings()

  return (
    <div className="relative isolate h-full w-full overflow-y-auto bg-bg">
      {/* Unico efecto de la vista: rayos desde arriba en el color de acento */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <LightRays raysOrigin="top-center" raysColor={accentColor} raysSpeed={0.6} lightSpread={0.7} rayLength={2.2} intensity={0.8} cursorShadow={false} clickPulse={false} mouseInfluence={0.05} />
      </div>

      <main className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-12">
        <Link href="/login" aria-label="GameTrack" className="display-title text-3xl">
          Game<span className="text-primary-text">Track</span>
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-border bg-surface/90 p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-8">
          <h1 className="display-title text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
