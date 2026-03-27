import { useEffect, useState } from 'react';
import { BellRing, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../lib/api';

const Notifications = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await api.get('/students/me/notifications');
            setItems(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAsRead = async (id) => {
        await api.patch(`/students/me/notifications/${id}/read`);
        setItems((prev) => prev.map((item) => item._id === id ? { ...item, status: 'Read' } : item));
    };

    const markAll = async () => {
        await api.patch('/students/me/notifications/read-all');
        setItems((prev) => prev.map((item) => ({ ...item, status: 'Read' })));
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="glass-card p-6 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-100">Notification Center</h1>
                    <p className="text-slate-300">Track registration deadlines, exam dates and official updates.</p>
                </div>
                <button onClick={markAll} className="btn-subtle">Mark all read</button>
            </div>

            {loading && <div className="text-slate-300">Loading notifications...</div>}

            {!loading && items.length === 0 && (
                <div className="glass-card p-8 text-slate-300 text-center">
                    No notifications yet. Track an exam to receive alerts.
                </div>
            )}

            <div className="space-y-4">
                {items.map((item) => (
                    <article key={item._id} className="glass-card p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <BellRing className="mt-1 text-amber-300" size={18} />
                                <div>
                                    <h2 className="text-slate-100 font-bold">{item.title}</h2>
                                    <p className="text-slate-300 text-sm mt-1">{item.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(item.dateTime).toLocaleString()}</p>
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-cyan-300 hover:text-cyan-200 text-sm font-semibold">
                                            Official Link <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {item.status === 'Unread' ? (
                                <button onClick={() => markAsRead(item._id)} className="btn-primary">Mark Read</button>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-emerald-300 text-sm font-semibold">
                                    <CheckCircle2 size={14} /> Read
                                </span>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
