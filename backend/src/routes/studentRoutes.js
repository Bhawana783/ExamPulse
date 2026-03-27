import express from 'express';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import Exam from '../models/Exam.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id)
            .select('-passwordHash')
            .populate('trackedExams');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.json(student);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.put('/me/preferences', requireAuth, async (req, res) => {
    try {
        const updates = {
            preferences: req.body.preferences || [],
            levels: req.body.levels || [],
            countries: req.body.countries || [],
            notificationChannels: {
                inApp: req.body.notificationChannels?.inApp ?? true,
                email: req.body.notificationChannels?.email ?? false,
                push: req.body.notificationChannels?.push ?? false,
            },
        };
        const student = await Student.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
        }).select('-passwordHash');

        return res.json(student);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.get('/me/notifications', requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ studentId: req.user.id })
            .sort({ dateTime: -1 })
            .limit(100)
            .populate('examId', 'examName registration importantDates officialLinks');
        return res.json(notifications);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.patch('/me/notifications/:id/read', requireAuth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, studentId: req.user.id },
            { status: 'Read' },
            { new: true },
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        return res.json(notification);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.patch('/me/notifications/read-all', requireAuth, async (req, res) => {
    try {
        await Notification.updateMany(
            { studentId: req.user.id, status: 'Unread' },
            { status: 'Read' },
        );
        return res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/me/notifications/generate-deadline-reminders', requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate('trackedExams');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const now = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        let createdCount = 0;

        for (const examRef of student.trackedExams) {
            const exam = examRef instanceof Exam ? examRef : await Exam.findById(examRef);
            if (!exam || !exam.isActive || !exam.registration?.endDate) {
                continue;
            }

            const daysLeft = Math.ceil((new Date(exam.registration.endDate).getTime() - now.getTime()) / oneDayMs);
            if (daysLeft < 0) {
                continue;
            }

            const reminderWindows = exam.notificationWindowDays || [30, 7, 1];
            const shouldNotify = reminderWindows.includes(daysLeft);
            if (!shouldNotify) {
                continue;
            }

            const existing = await Notification.findOne({
                studentId: student._id,
                examId: exam._id,
                type: 'DEADLINE',
                dueDate: exam.registration.endDate,
                title: `Registration closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
            });

            if (existing) {
                continue;
            }

            await Notification.create({
                studentId: student._id,
                examId: exam._id,
                type: 'DEADLINE',
                title: `Registration closes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
                message: `${exam.examName} application deadline is ${new Date(exam.registration.endDate).toLocaleDateString()}. Complete registration before cutoff.`,
                link: exam.registration.officialApplyUrl || exam.officialLinks?.[0]?.url,
                dueDate: exam.registration.endDate,
            });
            createdCount += 1;
        }

        return res.json({
            message: 'Deadline reminders generated',
            createdCount,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;
