"use client"

import { use, useState } from "react"
import { ArrowLeft, Edit, Clock, Trophy, Target, BookText } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import EditGameModal from "@/components/games/EditGameModal"
import AddToWishlistButton from "@/components/wishlist/AddToWishlistButton"

const mockGame = {
  id: 1,
  title: "The Legend of Zelda: Tears of the Kingdom",
  platform: "Nintendo Switch",
  genre: "Aventura, Mundo Abierto",
  status: "jugando",
  progress: 60,
  hours: 45.5,
  startDate: "2023-05-12",
  startTime: "10:30",
  description: "Link's epic adventure continues in the skies above Hyrule and the depths below.",
  tags: ["RPG", "Elegante", "GotY"],
  diaryEntries: [
    { date: "2023-05-15", content: "Llegué a la superficie y conseguí el paravela. El mundo es inmenso." },
    { date: "2023-05-20", content: "Completé el Templo del Viento con Tulin." }
  ]
}

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Badge variant="success" className="uppercase">{mockGame.status}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <AddToWishlistButton gameId={mockGame.id.toString()} />
          <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar/Cover Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="aspect-[3/4] w-full bg-slate-800 rounded-xl relative overflow-hidden ring-1 ring-slate-800">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/40 to-slate-900/60 mix-blend-overlay"></div>
             {/* Text placeholder for cover */}
             <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
               <span className="font-bold text-2xl text-slate-300 opacity-50">{mockGame.title}</span>
             </div>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Horas Jugadas</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-violet-400" />
                  <span className="text-2xl font-bold">{mockGame.hours}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Inicio de la Partida</p>
                <p className="text-sm font-medium text-slate-200">{mockGame.startDate} - {mockGame.startTime}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Plataforma & Género</p>
                <p className="text-sm font-medium text-slate-200">{mockGame.platform}</p>
                <p className="text-sm text-slate-400">{mockGame.genre}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  {mockGame.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">{mockGame.title}</h1>
            <p className="text-lg text-slate-400 leading-relaxed">{mockGame.description}</p>
          </div>

          {/* Progreso */}
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-400" /> Progreso General
                  </h3>
                  <span className="text-xl font-bold text-violet-300">{mockGame.progress}%</span>
               </div>
               <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full" 
                    style={{ width: `${mockGame.progress}%` }}
                  />
               </div>
               <div className="flex gap-6 mt-6 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border border-violet-500 bg-violet-500/20"></div>
                    <span className="text-sm text-slate-300">Historia (Completado)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border border-slate-600"></div>
                    <span className="text-sm text-slate-300">Misiones Secundarias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm border border-slate-600"></div>
                    <span className="text-sm text-slate-300">Logros / Trofeos</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Pestañas (mock visual) */}
          <div className="flex gap-1 border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Resumen
            </button>
            <button 
              onClick={() => setActiveTab('diary')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'diary' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Diario ({mockGame.diaryEntries.length})
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'review' ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Evaluación final
            </button>
          </div>

          <div className="py-2">
            {activeTab === 'overview' && (
               <div className="text-slate-400 text-sm">
                 <p>Estás jugando actualmente a este título. Sigue actualizando el progreso y añadiendo entradas al diario para llevar un mejor registro de tu aventura.</p>
               </div>
            )}
            {activeTab === 'diary' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-200">Entradas del Diario</h4>
                  <Link href="/diary/new">
                    <Button size="sm" variant="outline" className="gap-2">
                      <BookText className="h-4 w-4" /> Añadir Entrada
                    </Button>
                  </Link>
                </div>
                {mockGame.diaryEntries.map((entry, i) => (
                  <Card key={i} className="bg-slate-900/30">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500 mb-2">{entry.date}</p>
                      <p className="text-sm text-slate-300 italic">"{entry.content}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {activeTab === 'review' && (
              <div className="p-6 rounded-xl border border-dashed border-slate-700 text-center">
                 <Trophy className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                 <h4 className="text-slate-200 font-medium mb-1">Aún no has terminado este juego</h4>
                 <p className="text-sm text-slate-500">Termínalo para poder evaluarlo en sus diferentes apartados.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <EditGameModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} game={mockGame} />
    </div>
  )
}
