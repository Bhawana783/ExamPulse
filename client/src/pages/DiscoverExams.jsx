import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import axios from 'axios';
import ExamCard from '../components/ExamCard';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

const DiscoverExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams');
                setExams(response.data);
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

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Discover Your Next Exam</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Explore upcoming competitive, school, and college exams. Stay updated with syllabus, deadlines, and more.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by exam name..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Competitive', 'School', 'College'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExams.map((exam, idx) => (
                            <ExamCard key={exam._id} exam={exam} index={idx} onNotify={handleNotifyMe} />
                        ))}
                    </div>
                )}

                {!loading && filteredExams.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 italic text-xl">No exams found matching your pulse.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverExams;
