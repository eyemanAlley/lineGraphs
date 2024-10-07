import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdn27Jhz2DkJ1KgjDaW2pgP7gQ2V25MaE",
  authDomain: "team3-43394.firebaseapp.com",
  projectId: "team3-43394",
  storageBucket: "team3-43394.appspot.com",
  messagingSenderId: "345065109069",
  appId: "1:345065109069:web:d9ad300e0601281947ce04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);

export const auth = getAuth();

export default app;