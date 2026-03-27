import express from 'express';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { searchLiveExamWorkspace } from '../services/liveExamSearchService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {
            search,
            category,
            level,
            country,
            upcoming,
            deadlineWithinDays,
            page = 1,
            limit = 20,
        } = req.query;

        const query = { isActive: true };
        if (search) {
            query.$or = [
                { examName: { $regex: search, $options: 'i' } },
                { conductingBody: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }
        if (category) query.category = category;
        if (level) query.level = level;
        if (country) query.country = country;

        if (upcoming === 'true') {
            query['importantDates.examDate'] = { $gte: new Date() };
        }

        if (deadlineWithinDays) {
            const days = Number(deadlineWithinDays);
            if (!Number.isNaN(days)) {
                const now = new Date();
                const end = new Date(now);
                end.setDate(end.getDate() + days);
                query['registration.endDate'] = { $gte: now, $lte: end };
            }
        }

        const currentPage = Math.max(Number(page), 1);
        const perPage = Math.min(Math.max(Number(limit), 1), 100);

        const [items, total] = await Promise.all([
            Exam.find(query)
                .sort({ 'registration.endDate': 1, 'importantDates.examDate': 1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage),
            Exam.countDocuments(query),
        ]);

        res.json({
            items,
            pagination: {
                total,
                page: currentPage,
                limit: perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const exams = await Exam.find({ isActive: true })
            .sort({ 'registration.endDate': 1, createdAt: -1 })
            .limit(8);
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/search/live', async (req, res) => {
    try {
        const query = (req.query.q || req.query.search || '').trim();
        const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);

        const dbQuery = { isActive: true };
        if (query) {
            dbQuery.$or = [
                { examName: { $regex: query, $options: 'i' } },
                { conductingBody: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
            ];
        }

        const dbItems = await Exam.find(dbQuery)
            .sort({ 'registration.endDate': 1, createdAt: -1 })
            .limit(limit);

        const liveWorkspace = await searchLiveExamWorkspace({
            query,
            dbItems,
        });

        return res.json(liveWorkspace);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/deadlines/upcoming', requireAuth, async (req, res) => {
    try {
        const now = new Date();
        const next30Days = new Date(now);
        next30Days.setDate(next30Days.getDate() + 30);

        const user = await Student.findById(req.user.id).select('trackedExams');
        const query = {
            _id: { $in: user?.trackedExams || [] },
            'registration.endDate': { $gte: now, $lte: next30Days },
            isActive: true,
        };

        const exams = await Exam.find(query).sort({ 'registration.endDate': 1 });
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/subscriptions/me', requireAuth, async (req, res) => {
    try {
        const user = await Student.findById(req.user.id).populate({
            path: 'trackedExams',
            match: { isActive: true },
            options: { sort: { 'registration.endDate': 1 } },
        });
        res.json(user?.trackedExams || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        return res.json(exam);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const exam = new Exam(req.body);
        const newExam = await exam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const deleted = await Exam.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        return res.json({ message: 'Exam deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/:id/subscribe', requireAuth, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam || !exam.isActive) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.trackedExams.some((id) => String(id) === String(exam._id))) {
            student.trackedExams.push(exam._id);
            await student.save();
        }

        await Notification.create({
            studentId: student._id,
            examId: exam._id,
            type: 'DEADLINE',
            title: `Registered for ${exam.examName}`,
            message: `You will receive reminders before the application deadline (${new Date(exam.registration.endDate).toLocaleDateString()}).`,
            dueDate: exam.registration.endDate,
            link: exam.registration.officialApplyUrl || exam.officialLinks?.[0]?.url,
        });

        return res.json({ message: 'Subscribed successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/:id/unsubscribe', requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.trackedExams = student.trackedExams.filter((id) => String(id) !== req.params.id);
        await student.save();
        return res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;
