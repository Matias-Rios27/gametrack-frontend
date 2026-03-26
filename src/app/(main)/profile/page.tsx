"use client"

import React, { useEffect, useState } from 'react';
import { User, Settings, Gamepad2, Heart, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserGames } from '@/lib/services/games';
import { getUserWishlist } from '@/lib/services/wishlist';
import { getAllUserDiaryEntries } from '@/lib/services/diary';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SteamLinkSection } from '@/components/profile/SteamLinkSection';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();
  
  const [gamesCount, setGamesCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [diaryCount, setDiaryCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserGames(user.uid),
        getUserWishlist(user.uid),
        getAllUserDiaryEntries(user.uid)
      ]).then(([games, wishlist, diary]) => {
        setGamesCount(games.length);
        setWishlistCount(wishlist.length);
        setDiaryCount(diary.length);

        // Aggregate activities
        const activities: any[] = [];

        // 1. New Games
        games.forEach(g => {
            activities.push({
                id: `game-${g.id}`,
                type: 'game',
                title: 'Nuevo juego añadido',
                name: g.juego?.titulo || 'Juego Desconocido',
                date: g.updatedAt || new Date().toISOString(),
                icon: <Gamepad2 className="w-4 h-4 text-electric-blue" />
            });
        });

        // 2. Wishlist
        wishlist.forEach(w => {
            activities.push({
                id: `wish-${w.id}`,
                type: 'wishlist',
                title: 'Añadido a la Wishlist',
                name: w.juego?.titulo || 'Juego Desconocido',
                date: (w as any).createdAt || new Date().toISOString(),
                icon: <Heart className="w-4 h-4 text-rose-500" />
            });
        });

        // 3. Diary
        diary.forEach(d => {
            activities.push({
                id: `diary-${d.id}`,
                type: 'diary',
                title: 'Nueva entrada en el diario',
                name: d.juegoTitulo || 'Juego',
                content: d.contenido.substring(0, 100) + (d.contenido.length > 100 ? '...' : ''),
                date: d.fecha,
                icon: <BookOpen className="w-4 h-4 text-emerald-500" />
            });
        });

        // Sort by date desc
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivities(activities.slice(0, 10)); // Show last 10

        setDataLoading(false);
      });
    } else if (!loading) {
      setDataLoading(false);
    }
  }, [user, loading]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-muted">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-muted">Inicia sesión para ver tu perfil.</div>;
  }

  const creationDate = userData?.fecha_creacion ? new Date(userData.fecha_creacion).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Recientemente';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-card-bg border border-border-color">
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="w-32 h-32 rounded-full bg-card-bg border-2 border-electric-blue flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-electric-blue),0.3)] z-10 shrink-0">
            <User className="w-16 h-16 text-electric-blue" />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-foreground">
              {userData?.name || user?.displayName || "Jugador"}
            </h1>
            <p className="text-muted mt-2">{user?.email}</p>
            <p className="text-sm text-soft mt-1">Miembro desde {creationDate}</p>
          </div>
          
          <div className="z-10 flex flex-col gap-3">
            <Link href="/profile/edit" className="flex items-center justify-center gap-2 px-6 py-3 bg-electric-blue text-black font-medium rounded-xl hover:bg-electric-blue/90 transition-colors shadow-lg shadow-electric-blue/20">
              <Settings className="w-5 h-5" />
              Editar Perfil
            </Link>
            <button 
              onClick={async () => {
                await logout();
                router.push("/login");
              }} 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-card-bg text-muted font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors border border-border-color"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 bg-card-bg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-border-color hover:border-electric-blue/50">
            <div className="p-4 bg-electric-blue/10 rounded-full">
              <Gamepad2 className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-3xl font-bold">{gamesCount}</h3>
            <p className="text-muted text-sm">Juegos Registrados</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 bg-card-bg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-border-color hover:border-electric-blue/50">
            <div className="p-4 bg-electric-blue/10 rounded-full">
              <Heart className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-3xl font-bold">{wishlistCount}</h3>
            <p className="text-muted text-sm">En Wishlist</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 bg-card-bg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-border-color hover:border-electric-blue/50">
            <div className="p-4 bg-electric-blue/10 rounded-full">
              <BookOpen className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="text-3xl font-bold">{diaryCount}</h3>
            <p className="text-muted text-sm">Entradas de Diario</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-8 rounded-2xl bg-card-bg border border-border-color">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-electric-blue rounded-full shadow-[0_0_8px_rgba(var(--color-electric-blue),0.6)]"></span>
            Actividad Reciente
          </h2>
          <div className="space-y-6">
            {recentActivities.length === 0 ? (
                <p className="text-center text-soft py-8">Aún no hay actividad registrada.</p>
            ) : (
                recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 items-start group">
                        <div className="mt-1 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border-color group-hover:border-electric-blue/50 transition-colors">
                            {activity.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-foreground">{activity.title}</p>
                                <span className="text-[10px] text-muted whitespace-nowrap">
                                    {new Date(activity.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/80 mt-1">
                                {activity.name}
                            </p>
                            {activity.type === 'diary' && (
                                <p className="text-xs text-muted italic mt-2 border-l-2 border-emerald-500/30 pl-3 py-1">
                                    "{activity.content}"
                                </p>
                            )}
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Steam Link Section */}
        <SteamLinkSection />
      </div>
    </div>
  );
}

