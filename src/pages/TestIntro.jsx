import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Brain, 
  Zap, 
  Heart, 
  Target, 
  Scale, 
  Timer, 
  FileText, 
  CloudDownload,
  AlertCircle,
  CreditCard 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function TestIntro({ user }) {
  const navigate = useNavigate();
  const [quota, setQuota] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/personality-sub/my-quota`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setQuota(data.data);
        }
      } catch (err) {
        console.error("Fetch quota error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuota();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-6 sm:py-10 max-w-4xl mx-auto text-center w-full space-y-8 sm:space-y-12 px-4"
    >
      <div className="w-full flex justify-start">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-xs font-bold uppercase tracking-widest">
           <Brain size={14} />
           <span>MBTI Framework · 16 Personalities</span>
        </div>
        
        {quota && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
              quota.testsRemaining > 0 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}
          >
            <Zap size={14} />
            <span>{quota.testsRemaining} Assessments Remaining</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight leading-tight px-2">
          Uncover the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Essence</span> of Your Mind
        </h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium px-4">
          Our assessment reveals your unique combination of I/E, N/S, T/F, and J/P traits—helping you understand how you interact with the world around you.
        </p>
      </div>

      {/* Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl text-left">
        {[
          { icon: <Zap size={24} />, label: 'Mind', sub: 'Introvert vs Extrovert', code: 'I / E', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: <Target size={24} />, label: 'Energy', sub: 'Intuition vs Sensing', code: 'N / S', codeFull: 'Intuition vs Sensing', color: 'text-violet-600', bg: 'bg-violet-50' },
          { icon: <Heart size={24} />, label: 'Nature', sub: 'Thinking vs Feeling', code: 'T / F', color: 'text-rose-600', bg: 'bg-rose-50' },
          { icon: <Scale size={24} />, label: 'Tactics', sub: 'Judging vs Perceiving', code: 'J / P', color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="glass-card p-5 sm:p-6 flex items-center gap-4 sm:gap-6 border-transparent hover:border-slate-100 shadow-sm"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 ${item.bg} ${item.color}`}>
              {item.code}
            </div>
            <div>
              <h3 className="text-slate-900 text-base sm:text-lg font-bold font-display">{item.label}</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center text-slate-500 text-sm font-bold">
        <div className="glass-card px-4 py-2 border-slate-100 flex items-center gap-2">
          <FileText size={16} className="text-indigo-400" />
          <span>60 questions</span>
        </div>
        <div className="glass-card px-4 py-2 border-slate-100 flex items-center gap-2">
          <Timer size={16} className="text-violet-400" />
          <span>10–12 minutes</span>
        </div>
        <div className="glass-card px-4 py-2 border-slate-100 flex items-center gap-2">
          <CloudDownload size={16} className="text-emerald-400" />
          <span>Auto-saved Progress</span>
        </div>
      </div>
      
      <div className="px-4 w-full flex flex-col items-center gap-6">
        {loading ? (
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        ) : quota?.testsRemaining > 0 ? (
          <button 
            onClick={() => navigate('/questions')}
            className="btn-primary w-full max-w-sm py-4 text-lg sm:text-xl shadow-2xl"
          >
            Begin Assessment
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl max-w-sm text-rose-800 flex items-start gap-4">
              <AlertCircle size={24} className="shrink-0 mt-1" />
              <div className="text-left">
                <p className="font-bold mb-1 uppercase tracking-tight">Quota Exhausted</p>
                <p className="text-sm font-medium opacity-80">You have no remaining assessments. Purchase a plan to discover more about yourself.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/pricing')}
              className="btn-primary w-full max-w-sm py-4 text-lg sm:text-xl shadow-2xl flex items-center justify-center gap-3"
            >
              <CreditCard size={20} />
              <span>Purchase Assessment Plan</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
