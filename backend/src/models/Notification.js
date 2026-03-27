import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    type: {
        type: String,
        enum: ['DEADLINE', 'EXAM_DATE', 'RESULT', 'GENERAL'],
        default: 'GENERAL',
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['Read', 'Unread'], default: 'Unread' },
    dateTime: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
