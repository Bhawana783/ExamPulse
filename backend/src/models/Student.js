import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    class: { type: String },
    preferences: [{ type: String }], // Array of exam categories
    fcmToken: { type: String }, // Store device token for FCM
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
