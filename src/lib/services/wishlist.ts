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
import { Juego, getGame } from "./games";

const WISHLIST_COLLECTION = "wishlist";

export type Prioridad = 'alta' | 'media' | 'baja';

export interface WishlistItem {
  id?: string;
  id_usuario: string; // Firebase Auth UID
  id_juego: string;
  prioridad: Prioridad;
  juego?: Juego; // populated locally
  createdAt?: string;
}

export const addWishlistItem = async (item: Omit<WishlistItem, 'id'>) => {
  const dataToSave = {
    ...item,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, WISHLIST_COLLECTION), dataToSave);
  return docRef.id;
};

export const getUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  const q = query(collection(db, WISHLIST_COLLECTION), where("id_usuario", "==", userId));
  const querySnapshot = await getDocs(q);
  const wishlist: WishlistItem[] = [];
  
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as WishlistItem;
    const game = await getGame(data.id_juego);
    wishlist.push({
      id: docSnap.id,
      ...data,
      juego: game || undefined
    });
  }
  return wishlist;
};

export const updateWishlistPriority = async (wishlistId: string, priority: Prioridad) => {
  const docRef = doc(db, WISHLIST_COLLECTION, wishlistId);
  await updateDoc(docRef, { prioridad: priority });
};

export const removeFromWishlist = async (wishlistId: string) => {
  const docRef = doc(db, WISHLIST_COLLECTION, wishlistId);
  await deleteDoc(docRef);
};
