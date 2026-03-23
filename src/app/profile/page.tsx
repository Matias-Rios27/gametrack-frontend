import React from 'react';
import { User, Settings, Gamepad2, Heart, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-electric-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] z-10">
            <User className="w-16 h-16 text-electric-blue" />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-green">
              PlayerOne
            </h1>
            <p className="text-slate-400 mt-2">player.one@example.com</p>
            <p className="text-sm text-slate-500 mt-1">Member since March 2026</p>
          </div>
          
          <div className="z-10">
            <button className="flex items-center gap-2 px-6 py-3 bg-electric-blue text-slate-900 font-bold rounded-xl hover:bg-electric-blue-dark transition-colors shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              <Settings className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800/50 transition-colors border border-slate-800 hover:border-electric-blue/50">
            <div className="p-4 bg-electric-blue/10 rounded-full">
              <Gamepad2 className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-3xl font-bold">142</h3>
            <p className="text-slate-400">Games Logged</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800/50 transition-colors border border-slate-800 hover:border-neon-green/50">
            <div className="p-4 bg-neon-green/10 rounded-full">
              <Heart className="w-8 h-8 text-neon-green" />
            </div>
            <h3 className="text-3xl font-bold">38</h3>
            <p className="text-slate-400">Wishlist Items</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-slate-800/50 transition-colors border border-slate-800 hover:border-electric-blue/50">
            <div className="p-4 bg-electric-blue/10 rounded-full">
              <BookOpen className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-3xl font-bold">56</h3>
            <p className="text-slate-400">Journal Entries</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-neon-green rounded-full shadow-[0_0_8px_rgba(57,255,20,0.6)]"></span>
            Recent Activity
          </h2>
          <div className="space-y-4 text-slate-300">
            <p className="text-center text-slate-500 py-8">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
