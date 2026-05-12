import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase 프로젝트 설정 (환경 변수에서 불러옴)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 중복 초기화 방지 (Next.js 핫 리로딩 환경 대응)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore 데이터베이스
const db = getFirestore(app);

// Firebase Authentication
const auth = getAuth(app);

// Analytics (브라우저 환경에서만 초기화)
const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null,
);

export { app, db, auth, analyticsPromise };
