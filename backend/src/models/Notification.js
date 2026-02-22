import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Read', 'Unread'], default: 'Unread' },
    dateTime: { type: Date, default: Date.now },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
