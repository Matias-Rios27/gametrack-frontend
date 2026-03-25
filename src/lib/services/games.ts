import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

const JUEGOS_COLLECTION = "juegos";
const USUARIO_JUEGOS_COLLECTION = "usuario_juego";

export interface Juego {
  id?: string;
  titulo: string;
  descripcion?: string;
  portada_url?: string;
  plataforma?: string;
  genero?: string;
  steam_appid?: number | null;
}

export type Estado = 'jugando' | 'pausado' | 'completado' | 'abandonado';

export interface UsuarioJuego {
  id?: string;
  id_usuario: string; // Firebase Auth UID
  id_juego: string;
  estado: Estado;
  horas_jugadas?: number;
  progreso?: number;
  juego?: Juego; // populated locally
  fecha_inicio?: string;
  hora_inicio?: string;
  motivo_estado?: string | null;
  steam_appid?: number | null;
  updatedAt?: string;
}

// -- JUEGOS GLOBALES --
export const addGame = async (gameData: Omit<Juego, 'id'>) => {
  const docRef = await addDoc(collection(db, JUEGOS_COLLECTION), gameData);
  return docRef.id;
};

export const getGame = async (gameId: string): Promise<Juego | null> => {
  const docRef = doc(db, JUEGOS_COLLECTION, gameId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Juego;
  }
  return null;
};

export const getAllGames = async (): Promise<Juego[]> => {
  const q = collection(db, JUEGOS_COLLECTION);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Juego));
};

// -- RELACION JUEGO - USUARIO --
export const addUserGame = async (userGameData: Omit<UsuarioJuego, 'id'>) => {
  const dataToSave = {
    ...userGameData,
    updatedAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, USUARIO_JUEGOS_COLLECTION), dataToSave);
  return docRef.id;
};

export const getUserGame = async (userGameId: string): Promise<UsuarioJuego | null> => {
  const docRef = doc(db, USUARIO_JUEGOS_COLLECTION, userGameId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as UsuarioJuego;
    const game = await getGame(data.id_juego);
    return { id: docSnap.id, ...data, juego: game || undefined };
  }
  return null;
};

export const getUserGames = async (userId: string): Promise<UsuarioJuego[]> => {
  const q = query(collection(db, USUARIO_JUEGOS_COLLECTION), where("id_usuario", "==", userId));
  const querySnapshot = await getDocs(q);
  const userGames: UsuarioJuego[] = [];
  
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as UsuarioJuego;
    const game = await getGame(data.id_juego);
    userGames.push({
      id: docSnap.id,
      ...data,
      juego: game || undefined
    });
  }
  return userGames;
};

export const updateUserGameStatus = async (userGameId: string, status: Estado, progress?: number, hours?: number) => {
  const docRef = doc(db, USUARIO_JUEGOS_COLLECTION, userGameId);
  const updateData: any = { 
    estado: status,
    updatedAt: new Date().toISOString()
  };
  if (progress !== undefined) updateData.progreso = progress;
  if (hours !== undefined) updateData.horas_jugadas = hours;
  
  await updateDoc(docRef, updateData);
};

export const updateGameAndUserGame = async (
  userGameId: string, 
  gameId: string, 
  userData: Partial<UsuarioJuego> & any, 
  gameData: Partial<Juego>
) => {
  if (userGameId && Object.keys(userData).length > 0) {
    const userDocRef = doc(db, USUARIO_JUEGOS_COLLECTION, userGameId);
    userData.updatedAt = new Date().toISOString();
    await updateDoc(userDocRef, userData);
  }
  if (gameId && Object.keys(gameData).length > 0) {
    const gameDocRef = doc(db, JUEGOS_COLLECTION, gameId);
    await updateDoc(gameDocRef, gameData);
  }
};
