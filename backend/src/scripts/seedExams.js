import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from '../models/Exam.js';

dotenv.config();

const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const seedData = [
    {
        examName: 'UPSC Civil Services Examination',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'Union Public Service Commission',
        mode: 'Offline',
        eligibility: {
            minAge: 21,
            maxAge: 32,
            education: 'Bachelor degree from recognized university',
            nationality: 'Indian',
            otherCriteria: ['Age relaxations as per category norms'],
        },
        syllabus: [
            {
                section: 'Prelims',
                topics: ['General Studies', 'CSAT'],
                weightage: 'Objective screening',
            },
            {
                section: 'Mains',
                topics: ['Essay', 'General Studies I-IV', 'Optional Subject'],
            },
        ],
        registration: {
            startDate: addDays(-10),
            endDate: addDays(18),
            fee: 100,
            currency: 'INR',
            officialApplyUrl: 'https://upsc.gov.in',
        },
        importantDates: {
            examDate: addDays(70),
        },
        officialLinks: [
            { label: 'Official Website', url: 'https://upsc.gov.in' },
            { label: 'Apply Online', url: 'https://upsconline.nic.in' },
        ],
        description: 'Premier national exam for IAS, IPS, IFS and allied services.',
        tags: ['government', 'civil services', 'india'],
    },
    {
        examName: 'Graduate Record Examination (GRE)',
        category: 'Professional',
        level: 'International',
        country: 'Global',
        conductingBody: 'ETS',
        mode: 'Hybrid',
        eligibility: {
            education: 'Graduation or final-year student',
            nationality: 'Open to all nationalities',
        },
        syllabus: [
            {
                section: 'Verbal Reasoning',
                topics: ['Reading Comprehension', 'Text Completion'],
            },
            {
                section: 'Quantitative Reasoning',
                topics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Analysis'],
            },
        ],
        registration: {
            startDate: addDays(-30),
            endDate: addDays(120),
            fee: 220,
            currency: 'USD',
            officialApplyUrl: 'https://www.ets.org/gre',
        },
        importantDates: {
            examDate: addDays(45),
        },
        officialLinks: [
            { label: 'Official Website', url: 'https://www.ets.org/gre' },
            { label: 'Test Booking', url: 'https://ereg.ets.org' },
        ],
        description: 'Standardized exam for graduate school admissions worldwide.',
        tags: ['masters', 'abroad', 'graduate'],
    },
    {
        examName: 'GATE',
        category: 'Competitive',
        level: 'National',
        country: 'India',
        conductingBody: 'IITs and IISc',
        mode: 'Online',
        eligibility: {
            education: 'Engineering or science undergraduate/final year',
            nationality: 'Indian and international candidates from approved countries',
        },
        syllabus: [
            {
                section: 'General Aptitude',
                topics: ['Verbal Ability', 'Numerical Ability'],
            },
            {
                section: 'Core Subject',
                topics: ['Discipline-specific technical topics'],
            },
        ],
        registration: {
            startDate: addDays(-15),
            endDate: addDays(25),
            lateFeeEndDate: addDays(35),
            fee: 1800,
            currency: 'INR',
            officialApplyUrl: 'https://gate2026.iitr.ac.in',
        },
        importantDates: {
            admitCardDate: addDays(60),
            examDate: addDays(85),
            resultDate: addDays(130),
        },
        officialLinks: [
            { label: 'Official Website', url: 'https://gate2026.iitr.ac.in' },
        ],
        description: 'National level exam for M.Tech admissions and PSU recruitment.',
        tags: ['engineering', 'postgraduate', 'psu'],
    },
];

const seedExams = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Exam.deleteMany({});
    await Exam.insertMany(seedData);
    console.log(`Seeded ${seedData.length} exams`);
    await mongoose.disconnect();
};

seedExams().catch((error) => {
    console.error(error);
    process.exit(1);
});
