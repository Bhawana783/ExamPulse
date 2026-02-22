import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl relative z-10"
            >
                <div>
                    <h2 className="mt-6 text-center text-4xl font-black text-gray-900 tracking-tight">
                        {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 font-bold text-primary hover:text-primary-dark transition-colors"
                        >
                            {isLogin ? 'Create one for free' : 'Sign in here'}
                        </button>
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="appearance-none relative block w-full px-12 py-4 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                    placeholder="Full Name"
                                />
                            </motion.div>
                        )}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                className="appearance-none relative block w-full px-12 py-4 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-12 py-4 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-2" size={18} />
                        </motion.button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-100 rounded-2xl text-gray-600 hover:bg-slate-50 transition-all font-bold group">
                            <Chrome className="mr-2 group-hover:text-primary transition-colors" size={20} /> Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-100 rounded-2xl text-gray-600 hover:bg-slate-50 transition-all font-bold group">
                            <Github className="mr-2 group-hover:text-black transition-colors" size={20} /> GitHub
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
