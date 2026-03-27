import { motion } from 'framer-motion';
import { BellRing, Calendar, GraduationCap, ExternalLink, ListChecks } from 'lucide-react';

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : 'TBA';

const ExamCard = ({ exam, index, onSubscribe, isSubscribed }) => {
  const firstSyllabus = exam.syllabus?.[0]?.section || 'Syllabus available on detail view';
  const deadline = exam.registration?.endDate;
  const examDate = exam.importantDates?.examDate;

  const canSubscribe = Boolean(exam._id);

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 md:p-6 border border-white/20"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-amber-300 font-bold">{exam.level} • {exam.category}</span>
          <h3 className="text-xl font-extrabold text-slate-100 mt-1 leading-tight">{exam.examName}</h3>
          <p className="text-xs text-slate-300 mt-1">{exam.conductingBody} • {exam.country}</p>
        </div>
        <BellRing size={20} className="text-amber-300/80" />
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Calendar size={15} className="text-cyan-300" />
          <span>Registration deadline: {formatDate(deadline)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <GraduationCap size={15} className="text-cyan-300" />
          <span>Eligibility: {exam.eligibility?.education || 'See details'}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <ListChecks size={15} className="text-cyan-300" />
          <span>Syllabus: {firstSyllabus}</span>
        </div>
        <div className="text-xs text-slate-400">Exam date: {formatDate(examDate)}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={exam.registration?.officialApplyUrl || exam.officialLinks?.[0]?.url}
          target="_blank"
          rel="noreferrer"
          className="btn-subtle"
        >
          Official Link <ExternalLink size={14} />
        </a>
        <button
          onClick={() => canSubscribe && onSubscribe?.(exam)}
          className={`btn-primary ${isSubscribed ? 'bg-emerald-600 border-emerald-500' : ''} ${!canSubscribe ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={!canSubscribe}
        >
          {isSubscribed ? 'Tracking' : canSubscribe ? 'Track Deadline' : 'Catalog Data'}
        </button>
      </div>
    </motion.div>
  );
};

export default ExamCard;
