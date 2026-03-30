"use client";

import React, { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PostCard, Post } from './PostCard';
import { motion, AnimatePresence } from 'framer-motion';

export function PostFeed() {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setPosting(true);
    try {
      const postData = {
        userId: user.uid,
        userName: userData?.name || user.displayName || "Jugador",
        userPhotoURL: userData?.photoURL || user.photoURL || null,
        content: newPostContent.trim(),
        gameTitle: selectedGame || null,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postData);
      setNewPostContent("");
      setSelectedGame("");
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Hubo un error al crear la publicación.");
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likedBy?.includes(user.uid);
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likes: isLiked ? (post.likes || 1) - 1 : (post.likes || 0) + 1
      });
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Input */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card-bg border border-border-color rounded-2xl p-4 shadow-sm"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-border-color overflow-hidden border border-border-color shrink-0">
               {userData?.photoURL ? (
                 <img src={userData.photoURL} alt="Tú" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-electric-blue/10">
                   <Gamepad2 className="w-5 h-5 text-electric-blue" />
                 </div>
               )}
             </div>
             <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="¿Qué estás jugando hoy?"
                className="flex-1 bg-background/50 border border-border-color rounded-xl px-4 py-3 min-h-[100px] text-sm focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all resize-none"
             />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border-color">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Etiquetar juego..." 
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="text-xs bg-card-bg border border-border-color rounded-full px-3 py-1.5 focus:outline-none focus:border-electric-blue transition-all"
              />
              <button type="button" className="p-2 text-muted hover:text-electric-blue transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
            
            <button
               type="submit"
               disabled={!newPostContent.trim() || posting}
               className="flex items-center gap-2 px-6 py-2 bg-electric-blue text-black font-bold rounded-xl hover:bg-electric-blue/90 disabled:opacity-50 disabled:hover:bg-electric-blue transition-all shadow-lg shadow-electric-blue/20"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {posting ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Feed List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <Loader2 className="w-10 h-10 text-electric-blue animate-spin" />
            <p className="text-sm font-medium">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-card-bg/50 border border-dashed border-border-color rounded-2xl">
            <p className="text-muted">No hay publicaciones todavía.</p>
            <p className="text-sm text-soft">¡Sé el primero en compartir algo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={user?.uid}
                onLike={handleLikePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
