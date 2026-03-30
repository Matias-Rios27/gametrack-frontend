"use client";

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal, User } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  content: string;
  createdAt: any;
  likes: number;
  likedBy?: string[]; // Array of user IDs
  gameTitle?: string;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: (postId: string) => void;
}

export function PostCard({ post, currentUserId, onLike }: PostCardProps) {
  const isLiked = currentUserId && post.likedBy?.includes(currentUserId);
  const formattedDate = post.createdAt?.seconds 
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'Recién publicado';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg border border-border-color rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-border-color overflow-hidden border border-border-color shrink-0">
               {post.userPhotoURL ? (
                 <img src={post.userPhotoURL} alt={post.userName} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-electric-blue/10">
                   <User className="w-5 h-5 text-electric-blue" />
                 </div>
               )}
             </div>
             <div>
               <h4 className="font-bold text-foreground text-sm leading-tight">{post.userName}</h4>
               <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">{formattedDate}</p>
             </div>
          </div>
          <button className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className="space-y-3">
          {post.gameTitle && (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-[10px] font-bold uppercase tracking-wide border border-electric-blue/20">
                🎮 {post.gameTitle}
             </span>
          )}
          <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>

      {/* Interactions */}
      <div className="px-5 py-3 border-t border-border-color bg-black/5 dark:bg-white/5 flex items-center gap-6">
        <button 
          onClick={() => onLike?.(post.id)}
          className={`flex items-center gap-2 text-xs font-bold transition-all transition-colors ${isLiked ? 'text-rose-500' : 'text-muted hover:text-rose-500'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {post.likes || 0}
        </button>
        <button className="flex items-center gap-2 text-xs font-bold text-muted hover:text-electric-blue transition-colors">
          <MessageSquare className="w-4 h-4" />
          Comentar
        </button>
        <button className="ml-auto text-muted hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
