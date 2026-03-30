"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Loader2, X, MessageSquare } from 'lucide-react';
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
  chatId: string;
}

interface DirectChatProps {
  friendId: string;
  friendName: string;
  friendPhotoURL?: string;
  onClose?: () => void;
}

export function DirectChat({ friendId, friendName, friendPhotoURL, onClose }: DirectChatProps) {
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Deterministic chatId for 1:1 chat
  const chatId = user ? [user.uid, friendId].sort().join("_") : "";

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "direct_messages"),
      where("chatId", "==", chatId),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort locally to avoid composite index
      const sortedMsgs = msgs.sort((a, b) => {
        const getTime = (ca: any) => {
          if (!ca) return Date.now();
          if (ca.seconds) return ca.seconds * 1000 + (ca.nanoseconds / 1000000);
          return 0;
        };
        return getTime(a.createdAt) - getTime(b.createdAt);
      });

      setMessages(sortedMsgs);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    const messageData = {
      text: newMessage.trim(),
      userId: user.uid,
      userName: userData?.name || user.displayName || "Jugador",
      userPhotoURL: userData?.photoURL || user.photoURL || null,
      createdAt: serverTimestamp(),
      chatId: chatId
    };

    setNewMessage("");
    try {
      await addDoc(collection(db, "direct_messages"), messageData);
    } catch (error) {
      console.error("Error al enviar mensaje directo:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex flex-col h-[600px] border border-electric-blue/30 rounded-2xl bg-card-bg shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color bg-card-bg flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full border border-electric-blue/40 overflow-hidden">
             {friendPhotoURL ? (
               <img src={friendPhotoURL} alt={friendName} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-electric-blue/10">
                 <UserIcon className="w-5 h-5 text-electric-blue" />
               </div>
             )}
           </div>
           <div>
             <h3 className="font-bold text-foreground leading-none">{friendName}</h3>
             <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">En línea ahora</span>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-black/10 rounded-full transition-colors text-muted hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/20 scrollbar-thin scrollbar-thumb-border-color">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-electric-blue animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted space-y-4 text-center p-8 opacity-40">
            <MessageSquare className="w-12 h-12 mb-2" />
            <p className="text-sm font-medium">Di hola a {friendName}. vuestros mensajes son privados y seguros.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMe = msg.userId === user?.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm
                    ${isMe 
                      ? 'bg-electric-blue text-black rounded-tr-none shadow-electric-blue/10 font-medium' 
                      : 'bg-card-bg border border-border-color text-foreground rounded-tl-none'}
                  `}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1.5 opacity-60 ${isMe ? 'text-black/80' : 'text-muted'}`}>
                      {msg.createdAt instanceof Timestamp 
                        ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : 'Enviando...'}
                    </p>
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
            placeholder={`Escribe a ${friendName}...`}
            className="w-full bg-background/50 border border-border-color rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-electric-blue text-black rounded-xl hover:bg-electric-blue/90 disabled:opacity-30 disabled:hover:bg-electric-blue transition-all shadow-md shadow-electric-blue/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
