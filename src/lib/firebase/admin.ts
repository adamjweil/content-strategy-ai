import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

export function getFirebaseAdminApp() {
  if (getApps().length <= 0) {
    return initializeApp(firebaseAdminConfig);
  }
  return getApps()[0];
}

// Initialize Firebase Admin
const app = getFirebaseAdminApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app); 