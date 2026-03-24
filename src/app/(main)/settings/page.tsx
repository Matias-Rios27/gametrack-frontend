"use client"

import React from "react"
import { Globe, Palette, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import Link from "next/link"
import { useSettings } from "@/context/SettingsContext"

export default function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor, language, setLanguage } = useSettings()

  const accentColors = [
    { name: "Cyan", value: "#00f0ff" },
    { name: "Violeta", value: "#7c3aed" },
    { name: "Esmeralda", value: "#10b981" },
    { name: "Rosa", value: "#f43f5e" },
    { name: "Ámbar", value: "#f59e0b" },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-slate-400">Personaliza tu experiencia en GameTrack.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card-bg shadow-xl border-border-color">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-electric-blue" />
                Apariencia
              </CardTitle>
              <CardDescription>Ajusta el estilo visual de la aplicación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-card-bg rounded-xl border border-border-color">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Modo Oscuro</p>
                  <p className="text-xs text-muted">Alterna entre tema oscuro y claro.</p>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`h-6 w-11 rounded-full relative transition-colors duration-200 focus:outline-none ring-2 ring-electric-blue/10 ${theme === 'dark' ? 'bg-electric-blue' : 'bg-card-bg border border-border-color text-foreground'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${theme === 'dark' ? 'right-1 bg-black' : 'left-1 bg-electric-blue'}`}></div>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Color de Acento</p>
                  <p className="text-xs text-muted">Cambia el color principal del sistema.</p>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-lg ${accentColor === color.value ? 'ring-2 ring-white ring-offset-4 ring-offset-background scale-105' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {accentColor === color.value && <Check className="h-6 w-6 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg shadow-xl border-border-color">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-electric-blue" />
                Idioma y Región
              </CardTitle>
              <CardDescription>Configura tu idioma preferido para la interfaz.</CardDescription>
            </CardHeader>
            <CardContent>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-card-bg border border-border-color text-foreground rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-electric-blue transition-all outline-none"
              >
                <option value="es">Español (Castellano)</option>
                <option value="en">English (Global)</option>
                <option value="pt">Português</option>
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-1">
          <Card className="bg-card-bg border-border-color sticky top-24">
             <CardHeader>
               <CardTitle className="text-lg">Info de Sistema</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-sm text-muted">
                <div className="flex justify-between">
                  <span>Versión</span>
                  <span className="text-foreground">0.2.5-beta</span>
                </div>
                <div className="flex justify-between">
                  <span>Plataforma</span>
                  <span className="text-foreground">Web App</span>
                </div>
                <div className="pt-4 border-t border-border-color">
                  <p className="italic">"Tus ajustes se guardan automáticamente en tu navegador."</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
