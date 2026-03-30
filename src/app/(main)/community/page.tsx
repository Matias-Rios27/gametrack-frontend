"use client";

import React, { useState } from 'react';
import { GameChat } from '@/components/games/GameChat';
import { Users, Info, MessageSquare, Newspaper, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostFeed } from '@/components/community/PostFeed';
import { FriendsManager } from '@/components/community/FriendsManager';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'chat'>('feed');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 bg-electric-blue/10 rounded-lg shadow-[0_0_15px_rgba(var(--color-electric-blue),0.2)]">
                <Users className="w-8 h-8 text-electric-blue" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Comunidad</h1>
            </motion.div>
            <p className="text-muted max-w-xl">
              Comparte tus juegos, haz nuevos amigos y chatea en tiempo real con la comunidad de GameTrack.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-card-bg/50 backdrop-blur-sm p-1 rounded-xl border border-border-color self-start md:self-end">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'feed' ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/20' : 'text-muted hover:text-foreground'}`}
            >
              <Newspaper className="w-4 h-4" />
              Feed
            </button>
            <button 
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'friends' ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/20' : 'text-muted hover:text-foreground'}`}
            >
              <UserPlus className="w-4 h-4" />
              Amigos
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/20' : 'text-muted hover:text-foreground'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Global
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
                {activeTab === 'feed' && (
                  <motion.div 
                    key="feed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PostFeed />
                  </motion.div>
                )}
                {activeTab === 'friends' && (
                  <motion.div 
                    key="friends"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FriendsManager />
                  </motion.div>
                )}
                {activeTab === 'chat' && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                     <GameChat gameId="global" title="Chat Global de Jugadores" />
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Sidebar / Rules Panel */}
          <div className="space-y-6 hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl bg-card-bg border border-border-color shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-electric-blue" />
                Explora
              </h3>
              <p className="text-sm text-soft mb-4">
                ¡Dale "Me gusta" a las publicaciones de otros y agrégalos como amigos para chatear en privado!
              </p>
              <div className="h-[2px] w-full bg-border-color mb-4"></div>
              <ul className="space-y-3 text-sm text-soft">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Comparte tus progresos.
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Pide recomendaciones.
                </li>
              </ul>
            </motion.div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-electric-blue/10 to-transparent border border-electric-blue/20">
               <h4 className="font-bold text-electric-blue mb-2 italic">Tip de Juego</h4>
               <p className="text-sm text-muted">
                 Mantén tu diario actualizado para que otros vean qué tan lejos has llegado en tus juegos favoritos.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
