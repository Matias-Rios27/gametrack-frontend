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
  where, 
  orderBy 
} from "firebase/firestore";

const DIARY_COLLECTION = "diario";

export interface DiarioEntry {
  id?: string;
  id_usuario_juego: string; // The ID from USUARIO_JUEGOS_COLLECTION
  fecha: string;
  contenido: string;
}

export const addDiaryEntry = async (entry: Omit<DiarioEntry, 'id'>) => {
  const docRef = await addDoc(collection(db, DIARY_COLLECTION), entry);
  return docRef.id;
};

export const getGameDiary = async (userGameId: string): Promise<DiarioEntry[]> => {
  const q = query(
    collection(db, DIARY_COLLECTION), 
    where("id_usuario_juego", "==", userGameId)
  );
  const querySnapshot = await getDocs(q);
  const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiarioEntry));
  return entries.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

export const updateDiaryEntry = async (entryId: string, content: string) => {
  const docRef = doc(db, DIARY_COLLECTION, entryId);
  await updateDoc(docRef, { contenido: content });
};

export const deleteDiaryEntry = async (entryId: string) => {
  const docRef = doc(db, DIARY_COLLECTION, entryId);
  await deleteDoc(docRef);
};

import { getUserGames } from "./games";

export const getAllUserDiaryEntries = async (userId: string): Promise<(DiarioEntry & { juegoTitulo?: string })[]> => {
  const userGames = await getUserGames(userId);
  if (userGames.length === 0) return [];
  
  const allEntries: (DiarioEntry & { juegoTitulo?: string })[] = [];
  
  await Promise.all(userGames.map(async (ug) => {
    if (!ug.id) return;
    const entries = await getGameDiary(ug.id);
    entries.forEach(e => {
      allEntries.push({
        ...e,
        juegoTitulo: ug.juego?.titulo || "Juego Desconocido"
      });
    });
  }));
  
  return allEntries.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};
