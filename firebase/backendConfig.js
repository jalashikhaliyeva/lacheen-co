// Import necessary functions from the Firebase SDK
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const backendConfig = {
  apiKey: "AIzaSyASUST9_U8t7zqVAgqFpf09fsjnhaJQxc8",
  authDomain: "lacheen-co.firebaseapp.com",
  databaseURL: "https://lacheen-co-default-rtdb.firebaseio.com",
  projectId: "lacheen-co",
  storageBucket: "lacheen-co.firebasestorage.app",
  messagingSenderId: "158928113782",
  appId: "1:158928113782:web:e702cfcf4a3f71cbd58f57",
  measurementId: "G-JGCQF9M69V",
};

const backendApp = !getApps().length
  ? initializeApp(backendConfig)
  : getApps()[0];

// For backward compatibility
const app = backendApp;

const db = getDatabase(backendApp);
const productsRef = ref(db, "products");

get(productsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      // console.log("Products data:", snapshot.val());
    } else {
      // console.log("No data available");
    }
  })
  .catch((error) => {
    console.error("Error retrieving data:", error);
  });

const auth = getAuth(backendApp);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(backendApp);
}

export { backendApp, app, db, auth, analytics };
