"use client"

import { useState } from "react"
import { Heart, Save, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { addGame } from "@/lib/services/games"
import { addWishlistItem, Prioridad } from "@/lib/services/wishlist"

export default function AddToWishlistPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      // 1. Guardar el juego base
      const newGameId = await addGame({
        titulo: formData.get("title") as string,
      })

      // 2. Añadir a wishlist
      await addWishlistItem({
        id_usuario: user.uid,
        id_juego: newGameId,
        prioridad: formData.get("priority") as Prioridad,
      })

      router.push("/wishlist")
    } catch (error) {
      console.error("Error al añadir a la wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/wishlist">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500" />
            Añadir a Wishlist
          </h1>
          <p className="text-slate-400">Añade un juego que deseas a tu lista.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Juego</label>
                <Input name="title" placeholder="Ej. The Last of Us Part III" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Prioridad</label>
                <select 
                  name="priority"
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  defaultValue="media"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
              <Link href="/wishlist">
                <Button variant="ghost" disabled={loading}>Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar en Wishlist
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
