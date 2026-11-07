"use client"

import { useState } from "react"
import { Clock, Gamepad2, Trophy, Wallet, type LucideIcon } from "lucide-react"
import CountUp from "@/components/reactbits/CountUp"
import { cn } from "@/lib/utils"

interface StatsStripProps {
  completed: number
  playing: number
  localHours: number
  steamHours: number
  hasSteam: boolean
  spentUsd: number
  steamGames: number
}

type Currency = "USD" | "CLP"

// Tipo de cambio fijo de referencia (pendiente: obtenerlo de una API)
const CLP_PER_USD = 980

function Stat({ icon: Icon, label, hint, children }: { icon: LucideIcon; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4 bg-surface p-5 md:p-6">
      <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-primary-text" />
      <div className="min-w-0">
        <p className="display-title text-3xl md:text-4xl">{children}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    </li>
  )
}

// Franja de estadisticas con contadores animados
export function StatsStrip({ completed, playing, localHours, steamHours, hasSteam, spentUsd, steamGames }: StatsStripProps) {
  const [currency, setCurrency] = useState<Currency>("USD")
  const spent = currency === "USD" ? spentUsd : spentUsd * CLP_PER_USD

  return (
    <section aria-labelledby="stats-title">
      <h2 id="stats-title" className="sr-only">
        Resumen de tu actividad
      </h2>
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Trophy} label="Juegos completados">
          <CountUp to={completed} duration={1.2} />
        </Stat>
        <Stat icon={Gamepad2} label="Jugando ahora">
          <CountUp to={playing} duration={1.2} />
        </Stat>
        <Stat
          icon={Clock}
          label="Horas totales"
          hint={hasSteam ? `${localHours} en GameTrack + ${steamHours} en Steam` : "Registradas en GameTrack"}
        >
          <CountUp to={localHours + steamHours} separator="." duration={1.4} />
        </Stat>
        <Stat icon={Wallet} label="Gasto estimado en Steam" hint={`Basado en ${steamGames} juegos`}>
          <CountUp to={spent} separator="." prefix={currency === "USD" ? "US$ " : "CLP$ "} duration={1.4} />
          <span role="group" aria-label="Moneda" className="ml-3 inline-flex translate-y-[-4px] rounded-md border border-border p-0.5 align-middle font-sans">
            {(["USD", "CLP"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={currency === option}
                onClick={() => setCurrency(option)}
                className={cn(
                  "h-7 rounded px-2 text-[11px] font-semibold tracking-wider transition-colors",
                  currency === option ? "bg-primary text-primary-ink" : "text-muted hover:text-ink"
                )}
              >
                {option}
              </button>
            ))}
          </span>
        </Stat>
      </ul>
    </section>
  )
}
