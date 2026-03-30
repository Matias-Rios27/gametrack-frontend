"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithCustomToken,
  updateProfile 
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithSteam: (steamId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch additional user data from Firestore if needed
        try {
          const userDocRecord = await getDoc(doc(db, "users", currentUser.uid));
          if (userDocRecord.exists()) {
            setUserData(userDocRecord.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email,
      fecha_creacion: new Date().toISOString()
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loginWithSteam = async (steamId: string) => {
    const res = await fetch("/api/auth/steam/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamId }),
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    
    await signInWithCustomToken(auth, data.token);
  };

  const updateAvatar = async (file: File) => {
    if (!user) throw new Error("Debes estar autenticado");

    // 1. Upload to Storage
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    // 2. Update Auth Profile
    await updateProfile(user, { photoURL });

    // 3. Update Firestore User Doc
    await setDoc(doc(db, "users", user.uid), { photoURL }, { merge: true });

    // 4. Update local state
    setUserData((prev: any) => ({ ...prev, photoURL }));
    
    return photoURL;
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, register, loginWithSteam, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
