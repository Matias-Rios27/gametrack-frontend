"use client";

import React from 'react';
import { X, Save, Edit3 } from 'lucide-react';

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: any;
}

export default function EditGameModal({ isOpen, onClose, game }: EditGameModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-panel relative w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-electric-blue/30 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-electric-blue/10 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Edit3 className="text-electric-blue w-6 h-6" />
            Edit Game
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="text-sm font-semibold text-slate-300">Status</label>
            <select className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1">
              <option>Playing</option>
              <option>Completed</option>
              <option>Dropped</option>
              <option>Plan to Play</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-300">Platform</label>
            <input 
              type="text" 
              defaultValue="PC"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300">Personal Rating (1-10)</label>
            <input 
              type="number" 
              min="1" max="10" defaultValue={8}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue mt-1"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 z-10 relative">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors font-semibold">
              Cancel
            </button>
            <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-electric-blue text-slate-900 font-bold rounded-xl hover:bg-electric-blue-dark transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
