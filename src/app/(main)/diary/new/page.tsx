"use client"

import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Calendar, Gamepad2, Star, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserGames, UsuarioJuego } from '@/lib/services/games';
import { addDiaryEntry } from '@/lib/services/diary';
import Link from 'next/link';

export default function NewDiaryEntryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [games, setGames] = useState<UsuarioJuego[]>([])
  const [gamesLoading, setGamesLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getUserGames(user.uid).then(data => {
        setGames(data)
        setGamesLoading(false)
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const idUsuarioJuego = formData.get("id_usuario_juego") as string
    
    if (!idUsuarioJuego) {
      alert("Por favor selecciona un juego.")
      return
    }

    setLoading(true)

    try {
      await addDiaryEntry({
        id_usuario_juego: idUsuarioJuego,
        fecha: formData.get("fecha") as string,
        contenido: formData.get("contenido") as string,
      })
      router.push("/diary")
    } catch (error) {
      console.error("Error al guardar la entrada del diario:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 relative flex items-center gap-4">
          <Link href="/diary">
            <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-400" />
            </button>
          </Link>
          <div>
            <div className="absolute -left-4 top-0 w-2 h-full bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-electric-blue" />
              Nueva Entrada de Diario
            </h1>
            <p className="text-slate-400 mt-2 ml-1">Documenta tu aventura de juego</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6 relative overflow-hidden bg-slate-900/40 border border-slate-800">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-blue/5 rounded-full blur-3xl"></div>
          
          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1">Título de la bitácora (opcional)</label>
            <input 
              type="text" 
              name="titulo_opcional"
              placeholder="Ej. ¡Por fin derroté al jefe final!"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-neon-green" /> Juego
              </label>
              <select 
                name="id_usuario_juego"
                required
                className="w-full h-[50px] bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Selecciona un juego...</option>
                {gamesLoading ? (
                  <option disabled>Cargando juegos...</option>
                ) : games.length === 0 ? (
                  <option disabled>No tienes juegos en tu lista.</option>
                ) : (
                  games.map((g) => (
                    <option key={g.id} value={g.id}>{g.juego?.titulo || "Desconocido"}</option>
                  ))
                )}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-electric-blue" /> Fecha
              </label>
              <input 
                type="date" 
                name="fecha"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full h-[50px] bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1">Detalles de la Entrada</label>
            <textarea 
              name="contenido"
              rows={6}
              required
              placeholder="¿Qué pasó en tu sesión de hoy? ¿Algún descubrimiento genial?"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all resize-none"
            ></textarea>
          </div>

          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Valoración de la Sesión
            </label>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <button type="button" key={i} className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
                  <Star className="w-8 h-8 text-slate-600 group-hover:text-yellow-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 z-10 relative border-t border-slate-800">
            <Link href="/diary">
              <button type="button" disabled={loading} className="px-6 py-3 text-slate-400 hover:text-white transition-colors font-semibold">
                Cancelar
              </button>
            </Link>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-electric-blue to-electric-blue-dark text-slate-900 font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Guardar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
