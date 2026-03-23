"use client"

import { Heart, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"

export default function AddToWishlistPage() {
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
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Juego</label>
                <Input placeholder="Buscar juegos..." required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Prioridad</label>
                <select 
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
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button type="submit" className="gap-2 bg-rose-600 hover:bg-rose-700 text-white">
                <Save className="h-4 w-4" />
                Guardar en Wishlist
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
