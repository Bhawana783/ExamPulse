import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Web app's Firebase configuration
// These values should be provided via environment variables in a real app.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Get this from Firebase Console
            });
            if (currentToken) {
                console.log('FCM Token:', currentToken);
                return currentToken;
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export default app;
