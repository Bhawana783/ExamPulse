import Parser from 'rss-parser';
import Exam from '../models/Exam.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const parser = new Parser();

/**
 * RSS Feed Parser for real-time exam announcements.
 */
const parseRSS = async (feedUrl) => {
    try {
        console.log(`Fetching RSS feed from ${feedUrl}...`);
        const feed = await parser.parseURL(feedUrl);

        console.log(`Processing ${feed.items.length} items...`);

        for (const item of feed.items) {
            // Basic heuristic: check if the title contains "exam" or "schedule"
            const title = item.title;
            if (title.toLowerCase().includes('exam') || title.toLowerCase().includes('schedule')) {
                const examData = {
                    examName: title,
                    category: 'Competitive', // Default category
                    officialLink: item.link,
                    syllabus: item.contentSnippet || 'No syllabus description provided.',
                    examDate: item.pubDate ? new Date(item.pubDate) : null,
                };

                const existing = await Exam.findOne({ examName: examData.examName });
                if (!existing) {
                    await new Exam(examData).save();
                    console.log(`Saved from RSS: ${examData.examName}`);
                }
            }
        }
    } catch (error) {
        console.error('RSS Parsing failed:', error);
    }
};

// Example usage
const runScanner = async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected for RSS parsing');

        // Example RSS feed: Replace with actual edu board feed URL
        await parseRSS('https://www.example.com/rss/exams');

        await mongoose.disconnect();
    } else {
        console.error('MONGO_URI not found in env');
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    runScanner();
}

export default parseRSS;
