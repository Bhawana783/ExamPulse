import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, BookOpen, LogIn } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import DiscoverExams from './pages/DiscoverExams';
import Auth from './pages/Auth';

const Navbar = () => (
  <nav className="bg-primary p-4 text-white flex justify-between items-center shadow-2xl sticky top-0 z-50">
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center space-x-2"
    >
      <div className="w-8 h-8 bg-accent rounded-full animate-pulse flex items-center justify-center">
        <Bell size={18} className="text-white" />
      </div>
      <Link to="/" className="text-2xl font-bold italic tracking-tighter">ExamPulse</Link>
    </motion.div>
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/" className="hover:text-accent font-medium transition-all flex items-center gap-1"><Calendar size={18} /> Dashboard</Link>
      <Link to="/exams" className="hover:text-accent font-medium transition-all flex items-center gap-1"><BookOpen size={18} /> Discover Exams</Link>
      <Link to="/login" className="bg-gradient-to-r from-accent to-orange-600 hover:scale-105 active:scale-95 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-all flex items-center gap-1">
        <LogIn size={18} /> Get Started
      </Link>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exams" element={<DiscoverExams />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;