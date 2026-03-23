import React from 'react';
import { BookOpen, Save, Calendar, Gamepad2, Star } from 'lucide-react';

export default function NewDiaryEntryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-2 h-full bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-electric-blue" />
            Nueva Entrada de Diario
          </h1>
          <p className="text-slate-400 mt-2 ml-1">Documenta tu aventura de juego</p>
        </div>

        <form className="glass-panel p-8 rounded-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-electric-blue/5 rounded-full blur-3xl"></div>
          
          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1">Título</label>
            <input 
              type="text" 
              placeholder="Ej. ¡Por fin derroté al jefe final!"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-neon-green" /> Juego
              </label>
              <input 
                type="text" 
                placeholder="Buscar juegos..."
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-electric-blue" /> Fecha
              </label>
              <input 
                type="date" 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1">Detalles de la Entrada</label>
            <textarea 
              rows={6}
              placeholder="¿Qué pasó en tu sesión de hoy? ¿Algún descubrimiento genial?"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all resize-none"
            ></textarea>
          </div>

          <div className="space-y-2 z-10 relative">
            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Valoración de la Sesión
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} className="p-2 hover:bg-slate-800 rounded-lg transition-colors group">
                  <Star className="w-8 h-8 text-slate-600 group-hover:text-yellow-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 z-10 relative border-t border-slate-800">
            <button type="button" className="px-6 py-3 text-slate-400 hover:text-white transition-colors font-semibold">
              Cancelar
            </button>
            <button type="button" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-electric-blue to-electric-blue-dark text-slate-900 font-bold rounded-xl hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
              <Save className="w-5 h-5" />
              Guardar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
