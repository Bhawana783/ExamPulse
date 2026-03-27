import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, CalendarDays, Globe2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExamCard from '../components/ExamCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const unique = (values) => [...new Set(values)].filter(Boolean);

const Dashboard = () => {
    const [exams, setExams] = useState([]);
    const [trackedExams, setTrackedExams] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true);
            try {
                const featuredResponse = await api.get('/exams/featured');
                setExams(featuredResponse.data);

                if (isAuthenticated) {
                    const trackedResponse = await api.get('/exams/subscriptions/me');
                    setTrackedExams(trackedResponse.data);
                }
            } catch (err) {
                console.error('Failed to fetch exams', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [isAuthenticated]);

    const filtered = useMemo(() => {
        const term = query.toLowerCase().trim();
        if (!term) return exams;
        return exams.filter((exam) => exam.examName.toLowerCase().includes(term) || exam.conductingBody.toLowerCase().includes(term));
    }, [exams, query]);

    const categories = unique(filtered.map((item) => item.category));
    const countries = unique(filtered.map((item) => item.country));

    const handleSubscribe = async (exam) => {
        if (!isAuthenticated) {
            alert('Please sign in to track exam deadlines.');
            return;
        }
        try {
            await api.post(`/exams/${exam._id}/subscribe`);
            const trackedResponse = await api.get('/exams/subscriptions/me');
            setTrackedExams(trackedResponse.data);
        } catch (error) {
            alert(error?.response?.data?.message || 'Unable to subscribe.');
        }
    };

    const subscribedIds = new Set(trackedExams.map((item) => item._id));

    return (
        <div className="min-h-screen pb-16">
            <section className="pt-14 px-6 md:px-10 text-center relative overflow-hidden max-w-7xl mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 glass-card p-8 md:p-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-5 text-slate-100 leading-tight">One Platform For National And International Exams</h1>
                    <p className="text-base md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                        Track eligibility, syllabus, registration deadlines, official links and alerts in one real-time workspace.
                    </p>
                    <div className="max-w-xl mx-auto flex items-center rounded-full p-2 bg-slate-900/80 border border-slate-700">
                        <Search className="text-slate-400 ml-4" />
                        <input
                            type="text"
                            placeholder="Search UPSC, GRE, SAT, IELTS, GATE..."
                            className="w-full px-4 py-3 outline-none bg-transparent text-slate-100 rounded-full"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <button className="btn-primary rounded-full">Search</button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mt-7 text-left">
                        <div className="stat-card"><Globe2 size={16} /> {countries.length || 0} countries represented</div>
                        <div className="stat-card"><CalendarDays size={16} /> {filtered.length || 0} active exams</div>
                        <div className="stat-card"><BellRing size={16} /> {trackedExams.length || 0} exams tracked by you</div>
                    </div>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 border-l-4 border-amber-300 pl-4">Latest Exam Updates</h2>
                        <p className="text-slate-300 mt-2">Eligibility criteria, syllabus blocks, deadlines, and verified links.</p>
                    </div>
                    <Link to="/exams" className="text-cyan-200 font-bold hover:underline mb-2 transition-all">View all exams →</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-300 border-t-amber-400 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filtered.length > 0 ? (
                            filtered.map((exam, idx) => (
                                <ExamCard
                                    key={exam._id}
                                    exam={exam}
                                    index={idx}
                                    onSubscribe={handleSubscribe}
                                    isSubscribed={subscribedIds.has(exam._id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 glass-card italic text-slate-300">
                                No matching exams found for your search.
                            </div>
                        )}
                    </div>
                )}

                {categories.length > 0 && (
                    <div className="mt-12 text-slate-300">
                        <span className="font-semibold text-slate-200">Popular categories:</span> {categories.join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
