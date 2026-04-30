import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey:
    extra.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain:
    extra.firebaseAuthDomain ||
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "",
  projectId:
    extra.firebaseProjectId ||
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    "",
  storageBucket:
    extra.firebaseStorageBucket ||
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "",
  messagingSenderId:
    extra.firebaseMessagingSenderId ||
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "",
  appId: extra.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim().length > 0
);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;
const authActionUrl =
  extra.firebaseAuthActionUrl ||
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_ACTION_URL ||
  (firebaseConfig.authDomain ? `https://${firebaseConfig.authDomain}` : "");

const authActionCodeSettings = authActionUrl
  ? {
      url: authActionUrl,
      handleCodeInApp: true,
    }
  : undefined;

export { auth, db, storage, isFirebaseConfigured, authActionCodeSettings };
