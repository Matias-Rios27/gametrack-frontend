"use client";

import React, { useState } from 'react';
import { X, Save, Edit3, Loader2 } from 'lucide-react';
import { UsuarioJuego, Estado, updateGameAndUserGame } from '@/lib/services/games';
import { Input } from '@/components/ui/Input';

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: UsuarioJuego;
  onSaved: () => void;
}

export default function EditGameModal({ isOpen, onClose, game, onSaved }: EditGameModalProps) {
  const [loading, setLoading] = useState(false);
  
  // User game fields
  const [estado, setEstado] = useState<Estado>(game.estado || 'jugando');
  const [progreso, setProgreso] = useState<number>(game.progreso || 0);
  const [horasJugadas, setHorasJugadas] = useState<number>(game.horas_jugadas || 0);
  // @ts-ignore
  const [fechaInicio, setFechaInicio] = useState<string>(game.fecha_inicio || "");
  // @ts-ignore
  const [horaInicio, setHoraInicio] = useState<string>(game.hora_inicio || "");
  const [motivoEstado, setMotivoEstado] = useState<string>(game.motivo_estado || "");

  // Game fields
  const [titulo, setTitulo] = useState<string>(game.juego?.titulo || "");
  const [descripcion, setDescripcion] = useState<string>(game.juego?.descripcion || "");
  const [portadaUrl, setPortadaUrl] = useState<string>(game.juego?.portada_url || "");
  const [plataforma, setPlataforma] = useState<string>(game.juego?.plataforma || "");
  const [genero, setGenero] = useState<string>(game.juego?.genero || "");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game.id || !game.id_juego) return;
    
    setLoading(true);
    try {
      await updateGameAndUserGame(
        game.id,
        game.id_juego,
        {
          estado,
          progreso,
          horas_jugadas: horasJugadas,
          fecha_inicio: fechaInicio,
          hora_inicio: horaInicio,
          motivo_estado: motivoEstado
        },
        {
          titulo,
          descripcion,
          portada_url: portadaUrl,
          plataforma,
          genero
        }
      );
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error al actualizar juego:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      
      <div className="glass-panel relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border border-border-color bg-card-bg custom-scrollbar">
        <div className="flex justify-between items-center mb-6 relative z-10 sticky top-0 bg-card-bg/95 py-2 backdrop-blur-md rounded-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit3 className="text-electric-blue w-6 h-6" />
            Editar Juego Completo
          </h2>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Game Info Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border-color pb-2 text-electric-blue opacity-80">Información del Juego</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Título</label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required className="bg-card-bg border-border-color text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">URL Portada</label>
                <Input type="url" value={portadaUrl} onChange={(e) => setPortadaUrl(e.target.value)} className="bg-card-bg border-border-color text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Plataforma</label>
                <Input value={plataforma} onChange={(e) => setPlataforma(e.target.value)} className="bg-card-bg border-border-color text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Género</label>
                <Input value={genero} onChange={(e) => setGenero(e.target.value)} className="bg-card-bg border-border-color text-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Descripción / Notas</label>
              <textarea 
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-card-bg border border-border-color text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1 resize-y min-h-[80px]"
              />
            </div>
          </div>

          {/* Tracking Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold border-b border-border-color pb-2 text-electric-blue opacity-80">Seguimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Estado</label>
                <select 
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as Estado)}
                  className="w-full bg-card-bg border border-border-color text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1 hover:cursor-pointer"
                >
                  <option value="jugando">Jugando</option>
                  <option value="pausado">Pausado</option>
                  <option value="completado">Completado</option>
                  <option value="abandonado">Abandonado</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Progreso (%)</label>
                <input 
                  type="number" min="0" max="100"
                  value={progreso}
                  onChange={(e) => setProgreso(Number(e.target.value))}
                  className="w-full bg-card-bg border border-border-color text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Horas Jugadas</label>
                <input 
                  type="number" min="0"
                  value={horasJugadas}
                  onChange={(e) => setHorasJugadas(Number(e.target.value))}
                  className="w-full bg-card-bg border border-border-color text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Fecha de Inicio</label>
                <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-card-bg border-border-color text-foreground [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Hora de Inicio</label>
                <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="bg-card-bg border-border-color text-foreground [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>

              {(estado === "pausado" || estado === "abandonado") && (
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold text-foreground">
                    ¿Por qué está {estado === "pausado" ? "Pausado" : "Abandonado"}?
                  </label>
                  <textarea 
                    rows={2}
                    value={motivoEstado}
                    onChange={(e) => setMotivoEstado(e.target.value)}
                    placeholder={estado === "pausado" ? "Ej: Esperando DLC, juego muy largo..." : "Ej: No me gustó la historia, muchos bugs..."}
                    className="w-full bg-card-bg border border-border-color text-foreground rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1 resize-y"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 z-10 relative mt-4 border-t border-border-color pt-4">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 text-muted hover:text-foreground transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-electric-blue text-black font-bold rounded-xl hover:bg-electric-blue/90 transition-all shadow-[0_0_15px_rgba(var(--color-electric-blue),0.3)] disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar Todos los Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
