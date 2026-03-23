"use client"

import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"

export default function AddGamePage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/games">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Añadir Nuevo Juego</h1>
          <p className="text-slate-400">Registra un nuevo juego en tu backlog.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <form className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-300">Título</label>
                  <Input id="title" placeholder="Ej: The Witcher 3" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cover" className="text-sm font-medium text-slate-300">URL Portada</label>
                  <Input id="cover" type="url" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="platform" className="text-sm font-medium text-slate-300">Plataforma</label>
                  <Input id="platform" placeholder="Ej: PC, PS5, Switch" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="genre" className="text-sm font-medium text-slate-300">Género</label>
                  <Input id="genre" placeholder="Ej: RPG, Aventura" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-300">Descripción / Notas</label>
                <textarea 
                  id="description" 
                  className="flex w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-all min-h-[100px]"
                  placeholder="Sinopsis o notas adicionales..."
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">Seguimiento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-slate-300">Estado Inicial</label>
                  <select 
                    id="status" 
                    className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    defaultValue="jugando"
                  >
                    <option value="jugando">Jugando</option>
                    <option value="pausado">Pausado</option>
                    <option value="completado">Completado</option>
                    <option value="abandonado">Abandonado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium text-slate-300">Fecha de Inicio</label>
                  <Input id="startDate" type="date" />
                </div>
                {/* 🔥 El campo hora_inicio solicitado por el usuario */}
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium text-slate-300 text-violet-400">Hora de Inicio</label>
                  <Input id="startTime" type="time" className="border-violet-500/30 bg-violet-950/20" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Link href="/games">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Juego
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
