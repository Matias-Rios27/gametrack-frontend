"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  createdAt: any;
  gameId: string;
}

interface GameChatProps {
  gameId: string; // 'global' or a specific game document ID
  title?: string;
}

export function GameChat({ gameId, title = "Chat de la Comunidad" }: GameChatProps) {
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("gameId", "==", gameId),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort locally by createdAt to avoid needing a composite index
      const sortedMsgs = msgs.sort((a, b) => {
        const getTime = (ca: any) => {
          if (!ca) return Date.now(); // If it's a new message still pending
          if (ca.seconds) return ca.seconds * 1000 + (ca.nanoseconds / 1000000);
          if (ca instanceof Date) return ca.getTime();
          return 0;
        };
        return getTime(a.createdAt) - getTime(b.createdAt);
      });

      setMessages(sortedMsgs);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      text: newMessage.trim(),
      userId: user.uid,
      userName: userData?.name || user.displayName || "Jugador",
      userPhotoURL: userData?.photoURL || user.photoURL || null,
      createdAt: serverTimestamp(),
      gameId: gameId
    };

    setNewMessage("");
    try {
      await addDoc(collection(db, "messages"), messageData);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-border-color rounded-2xl bg-card-bg/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-color bg-card-bg flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          {title}
        </h3>
        <span className="text-xs text-muted">
          {messages.length} mensajes
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border-color">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-electric-blue animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted space-y-2 opacity-50">
            <p>No hay mensajes aún.</p>
            <p className="text-xs">¡Sé el primero en decir algo!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMe = msg.userId === user?.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* User Avatar */}
                  <div className="shrink-0 mt-1">
                    {msg.userPhotoURL ? (
                      <img 
                        src={msg.userPhotoURL} 
                        alt={msg.userName} 
                        className="w-8 h-8 rounded-full border border-border-color object-cover" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-border-color flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-soft" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[10px] font-bold text-electric-blue mb-1 ml-1 px-1">
                        {msg.userName}
                      </span>
                    )}
                    <div className={`
                      px-4 py-2 rounded-2xl text-sm
                      ${isMe 
                        ? 'bg-electric-blue text-black rounded-tr-none shadow-[0_0_15px_rgba(var(--color-electric-blue),0.2)]' 
                        : 'bg-background/80 border border-border-color text-foreground rounded-tl-none'}
                    `}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-muted mt-1 px-1">
                      {msg.createdAt instanceof Timestamp 
                        ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Enviando...'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-card-bg border-t border-border-color">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="w-full bg-background/50 border border-border-color rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-electric-blue text-black rounded-lg hover:bg-electric-blue/90 disabled:opacity-50 disabled:hover:bg-electric-blue transition-colors shadow-lg shadow-electric-blue/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
