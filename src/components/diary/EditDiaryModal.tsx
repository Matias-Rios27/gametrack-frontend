"use client";

import React, { useState } from 'react';
import { X, Save, Edit3, Loader2 } from 'lucide-react';
import { DiarioEntry, updateDiaryEntry } from '@/lib/services/diary';

interface EditDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DiarioEntry;
  onSaved: () => void;
}

export default function EditDiaryModal({ isOpen, onClose, entry, onSaved }: EditDiaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [contenido, setContenido] = useState(entry.contenido || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.id) return;
    
    setLoading(true);
    try {
      await updateDiaryEntry(entry.id, contenido);
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error al actualizar entrada de diario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="glass-panel relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-electric-blue/30 overflow-hidden bg-slate-900 border-electric-blue/20">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit3 className="text-electric-blue w-6 h-6" />
            Editar Entrada
          </h2>
          <button onClick={onClose} disabled={loading} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="text-sm font-semibold text-slate-300">Contenido</label>
            <textarea 
              rows={6}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1 resize-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 z-10 relative">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors font-semibold">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-electric-blue text-black font-bold rounded-xl hover:bg-electric-blue/90 transition-all shadow-[0_0_15px_rgba(var(--color-electric-blue),0.3)] disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
