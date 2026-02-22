import express from 'express';
import Exam from '../models/Exam.js';

const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new exam
router.post('/', async (req, res) => {
    const exam = new Exam(req.body);
    try {
        const newExam = await exam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
