import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { setFcmToken } from "@/redux/slices/userSlice";
import FirebaseData from "@/utils/firebase";

const PushNotification = ({ children }) => {
  const dispatch = useDispatch();
  const { firebaseApp } = FirebaseData();

  // ✅ Register service worker
  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log("✅ Service Worker registered:", registration.scope);
        return registration;
      } catch (err) {
        console.error("❌ Service Worker registration failed:", err);
        return null;
      }
    } else {
      console.warn("⚠️ Service Workers not supported in this browser.");
      return null;
    }
  };

  // ✅ Request permission + get token
  const fetchFcmToken = async () => {
    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn("⚠️ Firebase Messaging not supported in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("⚠️ Notification permission not granted.");
        return;
      }

      const registration = await registerServiceWorker();
      if (!registration) {
        console.error("🚫 No service worker registration available.");
        return;
      }

      const messaging = getMessaging(firebaseApp);

      // ✅ Always pass your own SW registration to getToken
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // optional
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        console.log("🎯 FCM Token:", currentToken);
        dispatch(setFcmToken({ data: currentToken }));
      } else {
        console.warn("⚠️ No registration token available.");
      }
    } catch (err) {
      console.error("❌ Error retrieving FCM token:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchFcmToken();
    }
  }, []);

  return <>{children}</>;
};

export default PushNotification;
