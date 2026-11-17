import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// True only once real credentials are supplied. Without this, getAuth() throws
// auth/invalid-api-key on an empty apiKey and takes down any importer.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Prevent re-initialization in Next.js hot-reloading
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Lazy so the module stays importable before credentials exist; the getter runs
// on first property access, by which point the config is expected to be real.
function lazy<T>(factory: () => T): () => T {
  let cached: T | undefined;
  return () => {
    if (cached === undefined) {
      if (!isFirebaseConfigured) {
        throw new Error(
          "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local."
        );
      }
      cached = factory();
    }
    return cached;
  };
}

const getAuthInstance = lazy(() => getAuth(app));
const getDbInstance = lazy(() => getFirestore(app));
const getStorageInstance = lazy(() => getStorage(app));

export const getFirebaseAuth = (): Auth => getAuthInstance();
export const getFirebaseDb = (): Firestore => getDbInstance();
export const getFirebaseStorage = (): FirebaseStorage => getStorageInstance();

export { app };
