"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUserGames, type UsuarioJuego } from "@/lib/services/games"
import { getUserWishlist, type WishlistItem } from "@/lib/services/wishlist"
import { fetchSteamLibrary, toHours, type SteamOwnedGame } from "@/lib/steam"

export interface DashboardData {
  loading: boolean
  activeGames: UsuarioJuego[]
  completedCount: number
  localHours: number
  steamHours: number
  steamLibrary: SteamOwnedGame[]
  priorityWishlist: WishlistItem[]
  spentUsd: number
}

const initialState: DashboardData = {
  loading: true,
  activeGames: [],
  completedCount: 0,
  localHours: 0,
  steamHours: 0,
  steamLibrary: [],
  priorityWishlist: [],
  spentUsd: 0,
}

// Precio promedio estimado por juego cuando no hay gasto real guardado
const AVERAGE_GAME_PRICE_USD = 15

const lastActivity = (game: UsuarioJuego) => new Date(game.updatedAt || game.fecha_inicio || 0).getTime()

export function useDashboardData(): DashboardData {
  const { user, userData } = useAuth()
  const steamId: string | undefined = userData?.steamId ?? undefined
  const spentSteam: number | undefined = userData?.spent_steam
  const [data, setData] = useState<DashboardData>(initialState)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    const load = async () => {
      try {
        // Las tres fuentes se piden en paralelo
        const [games, wishlist, steamLibrary] = await Promise.all([
          getUserGames(user.uid),
          getUserWishlist(user.uid),
          steamId ? fetchSteamLibrary(steamId) : Promise.resolve([]),
        ])
        if (cancelled) return

        setData({
          loading: false,
          activeGames: games.filter((g) => g.estado === "jugando").sort((a, b) => lastActivity(b) - lastActivity(a)),
          completedCount: games.filter((g) => g.estado === "completado").length,
          localHours: games.reduce((acc, g) => acc + (g.horas_jugadas || 0), 0),
          steamHours: toHours(steamLibrary.reduce((acc, g) => acc + (g.playtime_forever || 0), 0)),
          steamLibrary: [...steamLibrary].sort((a, b) => b.playtime_forever - a.playtime_forever),
          priorityWishlist: wishlist.filter((w) => w.prioridad === "alta"),
          spentUsd: spentSteam || steamLibrary.length * AVERAGE_GAME_PRICE_USD,
        })
      } catch (error) {
        console.error("Error al cargar el dashboard", error)
        if (!cancelled) setData((prev) => ({ ...prev, loading: false }))
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user, steamId, spentSteam])

  return data
}
