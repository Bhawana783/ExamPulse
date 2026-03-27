import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellRing, Globe, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import DiscoverExams from './pages/DiscoverExams';
import Auth from './pages/Auth';
import Notifications from './pages/Notifications';
import ProtectedRoute from './components/ProtectedRoute';

const navClass = ({ isActive }) => `text-sm md:text-base ${isActive ? 'text-amber-300' : 'text-slate-100 hover:text-amber-200'} transition-colors`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <motion.div initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-amber-500/20 border border-amber-300/40 grid place-items-center">
            <BellRing size={18} className="text-amber-300" />
          </span>
          <Link to="/" className="font-black tracking-wide text-xl text-white">ExamPulse</Link>
        </motion.div>

        <div className="flex items-center gap-4 md:gap-7">
          <NavLink className={navClass} to="/">Dashboard</NavLink>
          <NavLink className={navClass} to="/exams">Explore</NavLink>
          {isAuthenticated && <NavLink className={navClass} to="/notifications">Alerts</NavLink>}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-1 text-xs text-emerald-300 font-bold">
                <ShieldCheck size={14} /> {user?.name}
              </span>
              <button onClick={logout} className="btn-subtle flex items-center gap-1">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary flex items-center gap-1">
              <Globe size={15} /> Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen app-atmosphere">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exams" element={<DiscoverExams />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/notifications"
            element={(
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;