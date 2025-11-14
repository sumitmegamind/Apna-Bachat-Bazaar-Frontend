// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:'AIzaSyDUs5pVtSAayR3NVZyj4nzISqJzuJdvNs0',
  authDomain: 'apna-bachat-bazaar-c6e97.firebaseapp.com',
  projectId: 'apna-bachat-bazaar-c6e97',
  storageBucket: 'apna-bachat-bazaar-c6e97.firebasestorage.app',
  messagingSenderId: '149537280273',
  appId: '1:149537280273:web:8ddb41b1bfcefc9e467cb0',
  measurementId: 'G-YNWZBPNQ5F',
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message ", payload);

  const notificationTitle = payload.notification?.title || "Background Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/firebase-logo.png", // optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
