import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ตรวจสอบว่ามี config ครบหรือไม่
const isConfigValid = Object.values(firebaseConfig).every(
  (value) => value && value !== "undefined" && !value.toString().includes("your_")
);

if (!isConfigValid) {
  console.error("❌ Firebase config is missing or invalid!");
  console.error("Please check your environment variables in Vercel:");
  console.error("- NEXT_PUBLIC_FIREBASE_API_KEY");
  console.error("- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  console.error("- NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.error("- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  console.error("- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  console.error("- NEXT_PUBLIC_FIREBASE_APP_ID");
}

// Initialize Firebase (ป้องกันการ initialize ซ้ำ)
let app;
let db;
let auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);

  if (isConfigValid) {
    console.log("✅ Firebase initialized successfully");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  // Create dummy services to prevent crashes
  app = null as any;
  db = null as any;
  auth = null as any;
}

// Export services
export { db, auth };
export default app;
