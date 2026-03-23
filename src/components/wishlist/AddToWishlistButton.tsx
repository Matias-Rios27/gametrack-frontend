"use client";

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function AddToWishlistButton({ gameId }: { gameId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <button
      onClick={() => setIsWishlisted(!isWishlisted)}
      className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all ${
        isWishlisted 
          ? 'bg-neon-green/10 text-neon-green border border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-transparent'
      }`}
    >
      <Heart className={`w-5 h-5 transition-transform ${isWishlisted ? 'fill-neon-green scale-110' : 'scale-100'}`} />
      {isWishlisted ? 'On Wishlist' : 'Add to Wishlist'}
    </button>
  );
}
