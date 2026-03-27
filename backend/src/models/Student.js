import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    age: { type: Number },
    class: { type: String },
    preferences: [{ type: String }], // Array of exam categories
    levels: [{ type: String }],
    countries: [{ type: String }],
    trackedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    notificationChannels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
    },
    fcmToken: { type: String }, // Store device token for FCM
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
