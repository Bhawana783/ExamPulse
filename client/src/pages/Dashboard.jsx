import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ExamCard from '../components/ExamCard';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

const Dashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams');
                setExams(response.data.slice(0, 6)); // Show first 6
            } catch (err) {
                console.error('Failed to fetch exams', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const handleNotifyMe = async (exam) => {
        alert(`Enabling pulses for: ${exam.examName}. \n\nStarting FCM Permission Request...`);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <section className="bg-gradient-to-b from-primary to-blue-700 text-white py-20 px-8 text-center relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-lg">Stay in the Pulse.</h1>
                    <p className="text-xl md:text-2xl text-blue-100 italic mb-10 max-w-2xl mx-auto">
                        "Your journey to success is just one notification away."
                    </p>
                    <div className="max-w-xl mx-auto flex items-center bg-white rounded-full p-2 shadow-2xl">
                        <Search className="text-gray-400 ml-4" />
                        <input
                            type="text"
                            placeholder="Search for Engineering, Medical, or School exams..."
                            className="w-full px-4 py-3 outline-none text-gray-800 rounded-full"
                        />
                        <button className="bg-accent text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all">Search</button>
                    </div>
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full animate-pulse-slow"></div>
            </section>

            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 border-l-8 border-accent pl-4">Latest Exam Updates</h2>
                        <p className="text-gray-500 mt-2">Recently discovered exam schedules and notification pulses.</p>
                    </div>
                    <Link to="/exams" className="text-primary font-bold hover:underline mb-2 transition-all">View All Exams →</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {exams.length > 0 ? (
                            exams.map((exam, idx) => (
                                <ExamCard key={exam._id} exam={exam} index={idx} onNotify={handleNotifyMe} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner italic text-gray-400">
                                No exam pulses detected yet. Start by adding an exam in the admin panel.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
