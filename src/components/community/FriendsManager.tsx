"use client";

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X, MessageSquare, Loader2, User as UserIcon, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  or
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { DirectChat } from './DirectChat';

interface GameTrackUser {
  uid: string;
  name: string;
  photoURL?: string;
}

interface Friendship {
  id: string;
  from: string;
  fromName: string;
  fromPhotoURL?: string;
  to: string;
  toName: string;
  toPhotoURL?: string;
  status: 'pending' | 'accepted';
}

export function FriendsManager() {
  const { user, userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GameTrackUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatFriend, setActiveChatFriend] = useState<{uid: string, name: string, photoURL?: string} | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen for friendships where user is either 'from' or 'to'
    const q = query(
      collection(db, "friendships"),
      or(
        where("from", "==", user.uid),
        where("to", "==", user.uid)
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const frs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Friendship[];
      setFriendships(frs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !user) return;

    setSearching(true);
    try {
      // Basic search (case sensitive unfortunately, but better than nothing without specialized index)
      const q = query(
        collection(db, "users"),
        where("name", ">=", searchQuery),
        where("name", "<=", searchQuery + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() } as GameTrackUser))
        .filter(u => u.uid !== user.uid); // Exclude self
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (targetUser: GameTrackUser) => {
    if (!user) return;
    
    // Check if request already exists
    const exists = friendships.some(f => 
      (f.from === user.uid && f.to === targetUser.uid) || 
      (f.from === targetUser.uid && f.to === user.uid)
    );
    
    if (exists) {
      alert("Ya existe una solicitud o amistad con este usuario.");
      return;
    }

    try {
      await addDoc(collection(db, "friendships"), {
        from: user.uid,
        fromName: userData?.name || user.displayName || "Jugador",
        fromPhotoURL: userData?.photoURL || user.photoURL || null,
        to: targetUser.uid,
        toName: targetUser.name,
        toPhotoURL: targetUser.photoURL || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      alert("Solicitud enviada correctamente.");
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
    }
  };

  const acceptRequest = async (friendshipId: string) => {
    try {
      await updateDoc(doc(db, "friendships", friendshipId), {
        status: 'accepted'
      });
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const removeFriendship = async (friendshipId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta amistad/solicitud?")) return;
    try {
      await deleteDoc(doc(db, "friendships", friendshipId));
    } catch (error) {
      console.error("Error al eliminar amistad:", error);
    }
  };

  const friends = friendships.filter(f => f.status === 'accepted');
  const pendingRequests = friendships.filter(f => f.status === 'pending' && f.to === user?.uid);
  const sentRequests = friendships.filter(f => f.status === 'pending' && f.from === user?.uid);

  if (activeChatFriend) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setActiveChatFriend(null)}
          className="flex items-center gap-2 text-sm font-bold text-electric-blue hover:underline mb-4"
        >
          <X className="w-4 h-4" /> Volver a mis amigos
        </button>
        <DirectChat 
          friendId={activeChatFriend.uid} 
          friendName={activeChatFriend.name} 
          friendPhotoURL={activeChatFriend.photoURL}
          onClose={() => setActiveChatFriend(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Users */}
      <div className="bg-card-bg border border-border-color rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-electric-blue" />
          Buscar jugadores
        </h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Introduce el nombre del jugador..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-background/50 border border-border-color rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-electric-blue transition-all"
          />
          <button 
            type="submit"
            disabled={searching}
            className="px-6 py-2.5 bg-electric-blue text-black font-bold rounded-xl hover:bg-electric-blue/90 disabled:opacity-50 transition-all shadow-lg shadow-electric-blue/20"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-3 pt-6 border-t border-border-color"
          >
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Resultados de búsqueda</p>
            {searchResults.map(u => (
              <div key={u.uid} className="flex items-center justify-between p-3 border border-border-color rounded-xl bg-background/30 group hover:border-electric-blue/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-border-color overflow-hidden border border-border-color">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-electric-blue/10">
                        <UserIcon className="w-4 h-4 text-electric-blue" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-foreground">{u.name}</span>
                </div>
                <button 
                  onClick={() => sendFriendRequest(u)}
                  className="p-2 text-electric-blue hover:bg-electric-blue/10 rounded-lg transition-colors"
                  title="Añadir amigo"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Friends List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 px-2">
            Mis Amigos ({friends.length})
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center p-8 opacity-50"><Loader2 className="w-6 h-6 animate-spin text-electric-blue" /></div>
            ) : friends.length === 0 ? (
              <div className="p-8 text-center bg-card-bg/30 border border-dashed border-border-color rounded-2xl text-muted text-sm">
                Aún no tienes amigos en GameTrack.
              </div>
            ) : (
              friends.map(f => {
                const isFrom = f.from === user?.uid;
                const friendName = isFrom ? f.toName : f.fromName;
                const friendPhoto = isFrom ? f.toPhotoURL : f.fromPhotoURL;
                const friendUid = isFrom ? f.to : f.from;
                
                return (
                  <div key={f.id} className="flex items-center justify-between p-4 bg-card-bg border border-border-color rounded-2xl group hover:border-electric-blue transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-border-color overflow-hidden border border-border-color">
                        {friendPhoto ? (
                          <img src={friendPhoto} alt={friendName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-electric-blue/10">
                            <UserIcon className="w-5 h-5 text-electric-blue" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-foreground">{friendName}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setActiveChatFriend({ uid: friendUid, name: friendName, photoURL: friendPhoto })}
                        className="p-2 text-muted hover:text-electric-blue transition-colors" 
                        title="Chatear"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => removeFriendship(f.id)}
                        className="p-2 text-muted hover:text-rose-500 transition-colors" 
                        title="Eliminar amigo"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Requests Management */}
        <div className="space-y-6">
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 px-2">
                 Solicitudes recibidas ({pendingRequests.length})
              </h3>
              <div className="space-y-2">
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-border-color overflow-hidden">
                        {req.fromPhotoURL && <img src={req.fromPhotoURL} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-sm font-bold text-foreground">{req.fromName}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => acceptRequest(req.id)}
                        className="p-1.5 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeFriendship(req.id)}
                        className="p-1.5 bg-black/10 dark:bg-white/10 text-muted rounded-lg hover:text-rose-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sentRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted uppercase tracking-widest flex items-center gap-2 px-2">
                 Solicitudes enviadas ({sentRequests.length})
              </h3>
              <div className="space-y-2">
                {sentRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-card-bg border border-border-color rounded-xl opacity-80">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-foreground">{req.toName}</span>
                    </div>
                    <button 
                      onClick={() => removeFriendship(req.id)}
                      className="text-xs text-soft hover:text-rose-500 underline"
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
