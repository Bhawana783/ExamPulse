import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, BookOpen, ExternalLink } from 'lucide-react';

const ExamCard = ({ exam, index, onNotify }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-primary relative overflow-hidden group cursor-pointer"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Bell size={64} className="text-primary" />
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{exam.category}</span>
    <h3 className="text-xl font-bold mb-4 text-gray-800 line-clamp-1">{exam.examName}</h3>
    <div className="space-y-3 mb-6">
      <div className="flex items-center text-sm text-gray-500 gap-2">
        <Calendar size={16} className="text-primary" />
        <span>Date: {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'To be announced'}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 gap-2">
        <BookOpen size={16} className="text-primary" />
        <span className="line-clamp-1">{exam.syllabus}</span>
      </div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <button className="text-primary font-bold hover:text-primary-dark transition-colors flex items-center gap-1">
        Details <ExternalLink size={14} />
      </button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onNotify(exam); }}
        className="bg-accent/10 text-accent px-4 py-2 rounded-lg font-bold hover:bg-accent hover:text-white transition-all"
      >
        Notify Me
      </motion.button>
    </div>
  </motion.div>
);

export default ExamCard;
