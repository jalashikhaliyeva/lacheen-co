// Import necessary functions from the Firebase SDK
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyASUST9_U8t7zqVAgqFpf09fsjnhaJQxc8",
  authDomain: "lacheen-co.firebaseapp.com",
  projectId: "lacheen-co",
  databaseURL: "https://lacheen-co-default-rtdb.firebaseio.com",
  storageBucket: "lacheen-co.firebasestorage.app",
  messagingSenderId: "158928113782",
  appId: "1:158928113782:web:e702cfcf4a3f71cbd58f57",
  measurementId: "G-JGCQF9M69V",
};

// Initialize the Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize the Realtime Database
const db = getDatabase(app);
const productsRef = ref(db, "products");
// Retrieve and log the "products" data
get(productsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Products data:", snapshot.val());
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error("Error retrieving data:", error);
  });

// Initialize other Firebase services as needed
const auth = getAuth(app);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics };
