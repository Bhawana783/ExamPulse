import mongoose from 'mongoose';

const syllabusItemSchema = new mongoose.Schema({
    section: { type: String, trim: true, required: true },
    topics: [{ type: String, trim: true }],
    weightage: { type: String, trim: true },
    referenceUrl: { type: String, trim: true },
}, { _id: false });

const officialLinkSchema = new mongoose.Schema({
    label: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
}, { _id: false });

const examSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    category: {
        type: String,
        enum: ['School', 'College', 'Competitive', 'Professional', 'Certification'],
        required: true,
    },
    level: {
        type: String,
        enum: ['National', 'International', 'State', 'University'],
        required: true,
    },
    country: { type: String, required: true, trim: true },
    conductingBody: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
    eligibility: {
        minAge: { type: Number },
        maxAge: { type: Number },
        education: { type: String, trim: true },
        nationality: { type: String, trim: true },
        otherCriteria: [{ type: String, trim: true }],
    },
    syllabus: [syllabusItemSchema],
    registration: {
        startDate: { type: Date },
        endDate: { type: Date, required: true },
        lateFeeEndDate: { type: Date },
        fee: { type: Number },
        currency: { type: String, default: 'INR', trim: true },
        officialApplyUrl: { type: String, trim: true },
    },
    importantDates: {
        examDate: { type: Date },
        admitCardDate: { type: Date },
        resultDate: { type: Date },
    },
    officialLinks: [officialLinkSchema],
    description: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    notificationWindowDays: { type: [Number], default: [30, 7, 1] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

examSchema.pre('validate', function (next) {
    if (!this.slug && this.examName) {
        this.slug = this.examName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    next();
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
