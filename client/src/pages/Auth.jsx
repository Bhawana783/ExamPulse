import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const onChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (isLogin) {
                await login({ email: form.email, password: form.password });
            } else {
                await register({ name: form.name, email: form.email, password: form.password });
            }
            navigate('/');
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Authentication failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="orb orb-left" />
            <div className="orb orb-right" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-6 glass-card p-8 relative z-10"
            >
                <div>
                    <h2 className="mt-2 text-center text-4xl font-black text-slate-100 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-300">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 font-bold text-amber-300 hover:text-amber-200 transition-colors"
                        >
                            {isLogin ? 'Create one for free' : 'Sign in here'}
                        </button>
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 text-rose-200 px-3 py-2 text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={onChange}
                                    className="input-field"
                                    placeholder="Full Name"
                                />
                            </motion.div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={onChange}
                                className="input-field"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={form.password}
                                onChange={onChange}
                                className="input-field"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full py-3 justify-center disabled:opacity-70"
                        >
                            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-2" size={18} />
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Auth;
