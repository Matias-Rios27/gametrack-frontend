"use client"

import { useState } from "react"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { addGame, addUserGame, Estado } from "@/lib/services/games"

export default function AddGamePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Estado>("jugando")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      // 1. Guardar el juego en la colección global
      const newGameId = await addGame({
        titulo: formData.get("title") as string,
        descripcion: formData.get("description") as string,
        portada_url: formData.get("cover") as string,
        plataforma: formData.get("platform") as string,
        genero: formData.get("genre") as string,
      })

      // 2. Asociar el juego al usuario actual
      await addUserGame({
        id_usuario: user.uid,
        id_juego: newGameId,
        estado: formData.get("status") as Estado,
        horas_jugadas: 0,
        progreso: 0,
        // @ts-ignore - Guardado flexible
        fecha_inicio: formData.get("startDate") as string,
        // @ts-ignore
        hora_inicio: formData.get("startTime") as string,
        motivo_estado: formData.get("reason") as string || undefined,
      })

      router.push("/games")
    } catch (error) {
      console.error("Error al guardar el juego:", error)
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-muted">Registra un nuevo juego en tu backlog.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border-color pb-2">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-foreground">Título</label>
                  <Input id="title" name="title" placeholder="Ej: The Witcher 3" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cover" className="text-sm font-medium text-foreground">URL Portada</label>
                  <Input id="cover" name="cover" type="url" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label htmlFor="platform" className="text-sm font-medium text-foreground">Plataforma</label>
                  <Input id="platform" name="platform" placeholder="Ej: PC, PS5, Switch" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="genre" className="text-sm font-medium text-foreground">Género</label>
                  <Input id="genre" name="genre" placeholder="Ej: RPG, Aventura" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">Descripción / Notas</label>
                <textarea 
                  id="description" 
                  name="description"
                  className="flex w-full rounded-lg border border-border-color bg-card-bg px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-all min-h-[100px]"
                  placeholder="Sinopsis o notas adicionales..."
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold border-b border-border-color pb-2">Seguimiento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-foreground">Estado Inicial</label>
                  <select 
                    id="status" 
                    name="status"
                    className="flex h-10 w-full rounded-lg border border-border-color bg-card-bg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-all shadow-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as Estado)}
                  >
                    <option value="jugando">Jugando</option>
                    <option value="pausado">Pausado</option>
                    <option value="completado">Completado</option>
                    <option value="abandonado">Abandonado</option>
                  </select>
                </div>

                {(selectedStatus === "pausado" || selectedStatus === "abandonado") && (
                  <div className="space-y-2 lg:col-span-2">
                    <label htmlFor="reason" className="text-sm font-medium text-foreground">
                      ¿Por qué está {selectedStatus}?
                    </label>
                    <Input 
                      id="reason" 
                      name="reason" 
                      placeholder={selectedStatus === "pausado" ? "Ej: Demasiado largo, esperando un parche..." : "Ej: No me gustó el combate, bugs..."} 
                      className="border-electric-blue/20 focus:border-electric-blue"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium text-foreground">Fecha de Inicio</label>
                  <Input id="startDate" name="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium text-electric-blue">Hora de Inicio</label>
                  <Input id="startTime" name="startTime" type="time" className="border-electric-blue/30 bg-electric-blue/10" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Link href="/games">
                <Button variant="ghost" disabled={loading}>Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar Juego
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

