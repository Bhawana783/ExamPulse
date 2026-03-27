import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Newspaper, Search } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const DiscoverExams = () => {
    const { isAuthenticated } = useAuth();
    const [exams, setExams] = useState([]);
    const [tracked, setTracked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [liveUpdates, setLiveUpdates] = useState([]);
    const [workspaceAlerts, setWorkspaceAlerts] = useState([]);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams');
                setExams(response.data.items || []);

                if (isAuthenticated) {
                    const trackedResponse = await api.get('/exams/subscriptions/me');
                    setTracked(trackedResponse.data);
                }
            } catch (err) {
                console.error('Failed to fetch exams', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [isAuthenticated]);

    useEffect(() => {
        const trimmed = searchTerm.trim();
        const controller = new AbortController();

        const searchLiveWorkspace = async () => {
            if (trimmed.length < 2) {
                setLiveUpdates([]);
                setWorkspaceAlerts([]);
                setMeta(null);
                return;
            }

            setSearchLoading(true);
            try {
                const response = await api.get('/exams/search/live', {
                    params: { q: trimmed, limit: 40 },
                    signal: controller.signal,
                });

                setExams(response.data.items || []);
                setLiveUpdates(response.data.updates || []);
                setWorkspaceAlerts(response.data.alerts || []);
                setMeta(response.data.meta || null);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Live search failed', error);
                }
            } finally {
                setSearchLoading(false);
            }
        };

        const timerId = setTimeout(searchLiveWorkspace, 450);
        return () => {
            clearTimeout(timerId);
            controller.abort();
        };
    }, [searchTerm]);

    const trackedIds = useMemo(() => new Set(tracked.map((item) => item._id)), [tracked]);

    const handleSubscribe = async (exam) => {
        if (!isAuthenticated) {
            alert('Please sign in to track exam notifications.');
            return;
        }
        try {
            await api.post(`/exams/${exam._id}/subscribe`);
            const trackedResponse = await api.get('/exams/subscriptions/me');
            setTracked(trackedResponse.data);
        } catch (error) {
            alert(error?.response?.data?.message || 'Could not track exam.');
        }
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All' || exam.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <div className="min-h-screen py-10 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center glass-card p-8"
                >
                    <h1 className="text-4xl font-black text-slate-100 mb-4">Discover Your Next Exam</h1>
                    <p className="text-slate-300 max-w-3xl mx-auto">Explore national and international exams with complete eligibility, syllabus modules, deadline alerts, and verified official links.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by exam name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-900/70 border border-slate-700 text-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-300/20 focus:border-cyan-300 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Competitive', 'School', 'College', 'Professional', 'Certification'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-cyan-500 text-slate-950 shadow-lg'
                                        : 'bg-slate-900/70 text-slate-300 border border-slate-700 hover:border-cyan-300/40'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {['All', 'National', 'International', 'State', 'University'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedLevel === level ? 'bg-amber-300 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-300 border-t-amber-400 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredExams.map((exam, idx) => (
                            <ExamCard
                                key={exam._id}
                                exam={exam}
                                index={idx}
                                onSubscribe={handleSubscribe}
                                isSubscribed={trackedIds.has(exam._id)}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredExams.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 italic text-xl">No exams found matching your filters.</p>
                    </div>
                )}

                {searchLoading && (
                    <div className="mt-8 text-sm text-cyan-200 font-semibold">Refreshing real-time exam workspace...</div>
                )}

                {meta && (
                    <div className="mt-6 text-sm text-slate-300">
                        Workspace mode: <span className="font-semibold text-slate-100">{meta.mode}</span> | Results: {meta.total} | Live updates: {meta.liveUpdates}
                    </div>
                )}

                {workspaceAlerts.length > 0 && (
                    <section className="mt-10 glass-card p-6">
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                            <AlertTriangle size={18} className="text-amber-300" /> Deadline Alerts
                        </h2>
                        <div className="space-y-3">
                            {workspaceAlerts.slice(0, 5).map((alert) => (
                                <div key={`${alert.examName}-${alert.deadline}`} className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3">
                                    <p className="text-slate-100 font-semibold">{alert.message}</p>
                                    <p className="text-xs text-slate-300 mt-1">Deadline: {new Date(alert.deadline).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {liveUpdates.length > 0 && (
                    <section className="mt-10 glass-card p-6">
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
                            <Newspaper size={18} className="text-cyan-300" /> Real-Time Web Updates
                        </h2>
                        <div className="space-y-3">
                            {liveUpdates.slice(0, 8).map((update, idx) => (
                                <a
                                    key={`${update.link}-${idx}`}
                                    href={update.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-xl border border-slate-700 bg-slate-900/50 p-3 hover:border-cyan-300/50 transition-colors"
                                >
                                    <p className="text-slate-100 font-semibold">{update.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{update.source} {update.publishedAt ? `• ${new Date(update.publishedAt).toLocaleDateString()}` : ''}</p>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default DiscoverExams;
