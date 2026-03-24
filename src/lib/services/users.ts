import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const USERS_COLLECTION = "users";

export const updateUserProfile = async (userId: string, data: { name?: string; photoURL?: string }) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const getUserData = async (userId: string) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
};
