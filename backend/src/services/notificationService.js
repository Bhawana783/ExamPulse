import admin from '../config/firebaseAdmin.js';
import Student from '../models/Student.js';

/**
 * Service to handle sending push notifications.
 */
export const sendNotificationToStudent = async (studentId, title, body) => {
    try {
        const student = await Student.findById(studentId);
        if (!student || !student.fcmToken) {
            console.log(`Student ${studentId} has no FCM token.`);
            return;
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: student.fcmToken,
        };

        // If Firebase is not initialized (e.g., local dev without key), we mock the send
        if (!admin.apps.length) {
            console.log(`[MOCK] Sending Notification to ${student.name}: ${title} - ${body}`);
            return { success: true, mock: true };
        }

        const response = await admin.messaging().send(message);
        console.log('Successfully sent notification:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

/**
 * Send notification to all students subscribed to a category.
 */
export const sendBroadcastNotification = async (category, title, body) => {
    try {
        const students = await Student.find({ preferences: category, fcmToken: { $exists: true } });
        const tokens = students.map(s => s.fcmToken);

        if (tokens.length === 0) return;

        const message = {
            notification: { title, body },
            tokens: tokens,
        };

        if (!admin.apps.length) {
            console.log(`[MOCK] Broadcasting to ${tokens.length} students in ${category}: ${title}`);
            return;
        }

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`${response.successCount} messages were sent successfully`);
    } catch (error) {
        console.error('Broadcast notification failed:', error);
    }
};
