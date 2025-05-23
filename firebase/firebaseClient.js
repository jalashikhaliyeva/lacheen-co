// Client firebase config
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const clientConfig = {
  apiKey: "AIzaSyAEMCBbgPtfJ2bWc3mfrayWUS8LWqIjln8",
  authDomain: "lacheen-co-client.firebaseapp.com",
  projectId: "lacheen-co-client",
  storageBucket: "lacheen-co-client.firebasestorage.app",
  messagingSenderId: "594746444379",
  appId: "1:594746444379:web:8b58c3fc0478b0e1a94d7e",
  measurementId: "G-YLL6BTXQ0B",
};


const clientApp = !getApps().length
  ? initializeApp(clientConfig)
  : getApps()[0];

const db = getDatabase(clientApp);

const auth = getAuth(clientApp);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(clientApp);
}

export { clientApp, db, auth, analytics };
