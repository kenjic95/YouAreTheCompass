import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { Platform } from "react-native";

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

const toBooleanFlag = (value) => String(value ?? "").toLowerCase() === "true";
const shouldUseFirebaseEmulators = toBooleanFlag(
  process.env.EXPO_PUBLIC_FIREBASE_USE_EMULATORS
);
const emulatorHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const authEmulatorPort = Number(
  process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT ?? 9099
);
const firestoreEmulatorPort = Number(
  process.env.EXPO_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT ?? 8080
);
const storageEmulatorPort = Number(
  process.env.EXPO_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT ?? 9199
);

if (shouldUseFirebaseEmulators && auth && db && storage) {
  const emulatorConnectionKey = "__firebaseEmulatorsConnected";
  if (!globalThis[emulatorConnectionKey]) {
    connectAuthEmulator(auth, `http://${emulatorHost}:${authEmulatorPort}`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
    connectStorageEmulator(storage, emulatorHost, storageEmulatorPort);
    globalThis[emulatorConnectionKey] = true;
  }
}

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
