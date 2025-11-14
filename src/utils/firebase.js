
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { isSupported, getMessaging, onMessage } from "firebase/messaging";

const FirebaseData = async () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // ✅ Initialize Firebase only once (compat + modular safe)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  const auth = getAuth(firebaseApp);

  let messaging = null;

  // ✅ Only execute on client and when supported
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window
  ) {
    try {
      const supported = await isSupported(); // <- check browser support
      console.log('-------------------->',supported);
      
      if (supported) {
        messaging = getMessaging(firebaseApp);

        onMessage(messaging, (payload) => {
          const data = payload?.data;
          console.log("🔥 Front Notification:", data);

          if (Notification.permission === "granted") {
            new Notification(data?.title || "Notification", {
              body: data?.message || "",
              // icon: data?.image || setting?.setting?.web_settings?.web_logo,
            });
          }
        });
      } else {
        console.log("⚠️ Firebase Messaging not supported in this browser.");
      }
    } catch (err) {
      console.log("❌ Messaging init error:", err.message);
    }
  } else {
    console.log("⚠️ Window/Notification APIs not available — skipping FCM init.");
  }

  return { auth, firebaseApp, messaging };
};

export default FirebaseData;
