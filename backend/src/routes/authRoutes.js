import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const signToken = (user) => jwt.sign(
    {
        id: user._id,
        role: user.role,
        email: user.email,
    },
    process.env.JWT_SECRET || 'exam-pulse-dev-secret',
    { expiresIn: '7d' },
);

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, class: className } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existing = await Student.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const student = await Student.create({
            name: String(name).trim(),
            email: normalizedEmail,
            passwordHash,
            age,
            class: className,
        });

        const token = signToken(student);
        return res.status(201).json({
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
            },
        });
    } catch (error) {
        if (error?.name === 'MongooseError' || String(error?.message || '').includes('buffering timed out')) {
            return res.status(503).json({
                message: 'Database connection is unavailable. Start MongoDB and verify backend/.env MONGO_URI.',
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const student = await Student.findOne({ email: normalizedEmail });
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, student.passwordHash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(student);
        return res.json({
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
            },
        });
    } catch (error) {
        if (error?.name === 'MongooseError' || String(error?.message || '').includes('buffering timed out')) {
            return res.status(503).json({
                message: 'Database connection is unavailable. Start MongoDB and verify backend/.env MONGO_URI.',
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-passwordHash');
        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(student);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
