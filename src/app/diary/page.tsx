"use client"

import { BookText, PenLine } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const recentEntries = [
  { 
    id: 1, 
    gameTitle: "The Legend of Zelda: Tears of the Kingdom", 
    date: "2023-05-20", 
    content: "Completé el Templo del Viento con Tulin. La batalla contra el jefe volador fue increíble." 
  },
  { 
    id: 2, 
    gameTitle: "Elden Ring", 
    date: "2022-03-15", 
    content: "Por fin logré derrotar a Radahn. Me tomó 15 intentos pero la invocación de NPCs ayudó bastante." 
  },
  { 
    id: 3, 
    gameTitle: "Hollow Knight", 
    date: "2021-08-10", 
    content: "Llegué a la Ciudad de las Lágrimas. Qué atmósfera tan triste y hermosa." 
  }
]

export default function DiaryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookText className="h-8 w-8 text-amber-500" />
            Diario de Juego
          </h1>
          <p className="text-slate-400">Tus bitácoras, notas y memorias de las partidas.</p>
        </div>
        <Link href="/diary/new">
          <Button className="gap-2 bg-amber-600 hover:bg-amber-700 shadow-amber-500/20 text-white">
            <PenLine className="h-5 w-5" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        
        {recentEntries.map((entry, index) => (
          <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-amber-500 text-slate-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
              <BookText className="w-4 h-4" />
            </div>
            
            {/* Content Card */}
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-900/60 border-slate-800 hover:border-amber-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center justify-between">
                     <Link href="#" className="font-bold text-amber-400 hover:underline">{entry.gameTitle}</Link>
                     <span className="text-xs text-slate-500 font-medium">{entry.date}</span>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{entry.content}"</p>
              </CardContent>
            </Card>
          </div>
        ))}
        
      </div>
    </div>
  )
}
