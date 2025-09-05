import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOGGVlKYrIfdiSjwtLTUBc3zjKWmmJjO8",
  authDomain: "finance-tracking-app-166e9.firebaseapp.com",
  projectId: "finance-tracking-app-166e9",
  storageBucket: "finance-tracking-app-166e9.firebasestorage.app",
  messagingSenderId: "444813637392",
  appId: "1:444813637392:web:342aa5e1a6269a45725795",
  measurementId: "G-VZNYL65FLV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
