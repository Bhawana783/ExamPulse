import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    category: { type: String, enum: ['School', 'College', 'Competitive'], required: true },
    eligibilityAge: { type: String },
    syllabus: { type: String },
    formStartDate: { type: Date },
    formEndDate: { type: Date },
    examDate: { type: Date },
    officialLink: { type: String },
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
