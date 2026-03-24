"use client"

import React, { useState, useEffect } from "react"
import { User, ArrowLeft, Camera, Save, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { updateUserProfile } from "@/lib/services/users"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, userData } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name)
    } else if (user?.displayName) {
      setName(user.displayName)
    }
  }, [userData, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await updateUserProfile(user.uid, { name })
      // Redirigir de vuelta al perfil
      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert("Error al actualizar el perfil.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
          <p className="text-muted">Actualiza tu información personal.</p>
        </div>
      </div>

      <Card className="bg-card-bg shadow-2xl border-border-color overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-electric-blue to-blue-600 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-background rounded-full border-4 border-background shadow-xl">
             <div className="w-24 h-24 bg-card-bg border border-border-color rounded-full flex items-center justify-center relative group">
                <User className="w-12 h-12 text-muted" />
                <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </button>
             </div>
          </div>
        </div>

        <CardContent className="pt-16 pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre de Usuario</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Tu nombre o alias"
                  required
                  className="bg-card-bg text-foreground border-border-color focus-visible:ring-electric-blue"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email (No Editable)</label>
                <Input 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-card-bg/50 border-border-color text-muted cursor-not-allowed"
                />
              </div>

              <div className="p-4 bg-electric-blue/10 border border-electric-blue/20 rounded-xl flex gap-3 items-start mt-4">
                <Info className="h-5 w-5 text-electric-blue mt-0.5" />
                <p className="text-sm text-muted">
                  La personalización de avatar e imagen de fondo estará disponible próximamente en nuevas versiones de GameTrack.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-border-color">
              <Link href="/profile">
                <Button type="button" variant="ghost">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading} className="px-8 shadow-[0_0_20px_rgba(var(--color-electric-blue),0.3)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
