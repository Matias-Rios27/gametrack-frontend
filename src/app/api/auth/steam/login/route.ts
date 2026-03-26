import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!adminAuth || !adminDb) {
    return NextResponse.json({ error: "Firebase Admin is not configured on the server." }, { status: 500 });
  }

  try {
    const { steamId } = await request.json();

    if (!steamId) {
      return NextResponse.json({ error: "Missing steamId" }, { status: 400 });
    }

    // 1. Find or create the user in Firebase Auth/Firestore
    // Since Steam doesn't provide an email, we use the SteamID as a unique identifier.
    // We'll search Firestore for a user with this steamId.
    
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("steamId", "==", steamId).limit(1).get();
    
    let uid: string;

    if (snapshot.empty) {
      // Create a new user if not found
      // We'll need to fetch the Steam Profile for the name (optional but nice)
      const userRecord = await adminAuth.createUser({
        displayName: `Steam User ${steamId}`,
      });
      uid = userRecord.uid;
      
      await usersRef.doc(uid).set({
        name: `Steam User ${steamId}`,
        steamId: steamId,
        fecha_creacion: new Date().toISOString(),
      });
    } else {
      uid = snapshot.docs[0].id;
    }

    // 2. Generate a custom token for the Firebase UID
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (error: any) {
    console.error("Error generating custom token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
