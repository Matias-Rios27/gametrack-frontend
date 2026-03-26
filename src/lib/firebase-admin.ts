import admin from "firebase-admin";
import fs from "fs";
import path from "path";

if (!admin.apps.length) {
  try {
    // Attempt to initialize with environment variables
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    let serviceAccount;
    if (serviceAccountKey) {
      serviceAccount = JSON.parse(serviceAccountKey);
    } else {
      // Fallback: check for service-account.json in root
      const localPath = path.join(process.cwd(), "service-account.json");
      if (fs.existsSync(localPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(localPath, "utf-8"));
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY or service-account.json not found. Steam login will not work.");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export default admin;
