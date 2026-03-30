"use client";

import React, { useState, useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AvatarUploadProps {
  currentPhotoURL?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AvatarUpload({ currentPhotoURL, size = "lg" }: AvatarUploadProps) {
  const { updateAvatar } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 2MB.");
      return;
    }

    try {
      setUploading(true);
      // Local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Firebase
      await updateAvatar(file);
    } catch (error) {
      console.error("Error al subir avatar:", error);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <div 
        className={`${sizeClasses[size]} rounded-full bg-card-bg border-2 border-electric-blue flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-electric-blue),0.3)] overflow-hidden transition-all duration-300 group-hover:border-electric-blue/80`}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Avatar" 
            className={`w-full h-full object-cover ${uploading ? 'opacity-50' : 'opacity-100'}`} 
          />
        ) : (
          <User className={`${iconSizes[size]} text-electric-blue opacity-50`} />
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="w-8 h-8 text-electric-blue animate-spin" />
          </div>
        )}

        {/* Hover Overlay */}
        {!uploading && (
          <button
            onClick={triggerFileInput}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform"
          >
            <Camera className="w-8 h-8 text-white mb-2" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Cambiar</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
