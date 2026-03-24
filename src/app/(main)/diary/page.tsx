"use client"

import { useEffect, useState } from "react"
import { BookText, PenLine, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { getAllUserDiaryEntries, DiarioEntry, deleteDiaryEntry } from "@/lib/services/diary"
import EditDiaryModal from "@/components/diary/EditDiaryModal"

export default function DiaryPage() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<(DiarioEntry & { juegoTitulo?: string })[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<DiarioEntry | null>(null);

  useEffect(() => {
    if (user) {
      getAllUserDiaryEntries(user.uid).then((data) => {
        setEntries(data);
        setDataLoading(false);
      });
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading]);

  const handleDelete = async (entryId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta entrada del diario?")) {
      try {
        await deleteDiaryEntry(entryId);
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar la entrada:", error);
        alert("Hubo un error al eliminar.");
      }
    }
  };

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-slate-400">Cargando tu diario...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-muted">Inicia sesión para ver tu diario.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookText className="h-8 w-8 text-electric-blue" />
            Diario de Juego
          </h1>
          <p className="text-muted">Tus bitácoras, notas y memorias de las partidas.</p>
        </div>
        <Link href="/diary/new">
          <Button className="gap-2 bg-electric-blue hover:bg-electric-blue/90 shadow-electric-blue/20 text-black">
            <PenLine className="h-5 w-5" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-color before:to-transparent">
        
        {entries.length === 0 ? (
          <div className="relative z-10 text-center py-16 bg-card-bg rounded-xl border border-dashed border-border-color w-full mt-8">
            <p className="text-muted mb-4">Aún no has escrito ninguna entrada en tu diario.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-electric-blue text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                <BookText className="w-4 h-4" />
              </div>
              
              {/* Content Card */}
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card-bg border-border-color hover:border-electric-blue transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center justify-between">
                       <Link href={`/games/${entry.id_usuario_juego}`} className="font-bold text-electric-blue hover:underline">{entry.juegoTitulo}</Link>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-soft font-medium mr-2">{entry.fecha}</span>
                         <button 
                           onClick={() => setEditingEntry(entry)} 
                           className="p-1 hover:bg-electric-blue/20 text-muted hover:text-electric-blue rounded transition-colors"
                           title="Editar entrada"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => entry.id && handleDelete(entry.id)} 
                           className="p-1 hover:bg-rose-500/20 text-muted hover:text-rose-400 rounded transition-colors"
                           title="Eliminar entrada"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </div>
                  <p className="text-foreground italic whitespace-pre-wrap">"{entry.contenido}"</p>
                </CardContent>
              </Card>
            </div>
          ))
        )}
        
      </div>

      {editingEntry && (
        <EditDiaryModal
          isOpen={true}
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSaved={() => window.location.reload()}
        />
      )}
    </div>
  )
}
