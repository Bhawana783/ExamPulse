import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// In a real production environment, you would download your service account key JSON 
// from the Firebase Console and point to it using an environment variable.
// For now, we initialize with a placeholder/conditional check.

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (serviceAccountPath) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
        });
        console.log('✅ Firebase Admin Initialized');
    } catch (error) {
        console.error('❌ Firebase Admin Initialization Error:', error.message);
    }
} else {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT_PATH not found. Notifications will be mocked.');
}

export default admin;
