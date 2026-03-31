import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Share2,
  Download,
  ArrowLeft,
  Briefcase,
  Info,
  Sparkles,
  Zap,
  Globe,
  Compass
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Result({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const historicalResult = location.state?.testData;
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (historicalResult) {
      setResultData(historicalResult);
      setLoading(false);
      return;
    }

    const fetchLatestResult = async () => {
      try {
        const userId = user?._id || user?.id || 'demo-user-id';
        const res = await fetch(`${API_BASE_URL}/mbti/results/${userId}/latest`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResultData(data.data);
        } else {
          setError(data.message || 'No assessment found in your history.');
        }
      } catch (err) {
        console.error("Fetch result error: ", err);
        setError("Unable to retrieve your personality profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestResult();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
        </div>
        <p className="text-slate-500 font-display font-semibold text-xl animate-pulse">Mapping your neural matrix...</p>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-4">
          <Info size={32} />
        </div>
        <p className="text-slate-800 font-bold text-xl mb-6">{error || 'Begin your first assessment to see results.'}</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          Take the Test
        </button>
      </div>
    );
  }

  const { mbtiType, typeName, typeCategory, summary, dimensions } = resultData;

  const renderDimension = (labelLeft, labelRight, pole1Label, pole2Label, color, dimData) => {
    const p1 = dimData ? dimData.pole1Percent : 50;
    const p2 = dimData ? dimData.pole2Percent : 50;
    const activePole = p1 >= p2 ? 1 : 2;

    return (
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labelLeft} vs {labelRight}</p>
            <h4 className="text-sm font-bold text-slate-800">{activePole === 1 ? pole1Label : pole2Label}</h4>
          </div>
          <span className="text-2xl font-display font-black text-slate-900">{activePole === 1 ? p1 : p2}%</span>
        </div>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p1}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${activePole === 1 ? color : 'bg-slate-200'} rounded-l-full`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p2}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className={`h-full ${activePole === 2 ? color : 'bg-slate-200'} rounded-r-full`}
          />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10" />
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          <span className={activePole === 1 ? 'text-slate-900' : ''}>{pole1Label}</span>
          <span className={activePole === 2 ? 'text-slate-900' : ''}>{pole2Label}</span>
        </div>
      </motion.div>
    );
  };

  const handleDownloadReport = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = user?._id || user?.id;

      // 1. Invoke AI Career Guidance first to ensure data is generated
      // This matches the user's requirement to have detailed info for the PDF
      await fetch(`${API_BASE_URL}/mbti/career-guidance/personalized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      // 2. Trigger the PDF download
      const res = await fetch(`${API_BASE_URL}/mbti/report/${resultData._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to generate report');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resultData.typeName.replace(/\s+/g, '_')}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report. Please try again later.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto w-full space-y-8 sm:space-y-12 px-4 sm:px-6 md:px-0"
    >
      <div className="flex justify-between items-center px-2 md:px-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Dashboard</span>
        </button>
        <div className="flex gap-2 sm:gap-3">
          <button className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className={`p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Download Detailed Report"
          >
            <Download size={16} className={`sm:w-[18px] sm:h-[18px] ${isDownloading ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Result Hero */}
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          {typeCategory || 'Personality Profile'}
        </div>
        <div className="relative inline-block">
          <h1 className="text-6xl sm:text-8xl md:text-[160px] brand-shimmer leading-none select-none">
            {mbtiType}
          </h1>
          <div className="absolute -top-4 -right-8 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-200/20 blur-2xl sm:blur-3xl rounded-full -z-10" />
        </div>
        <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            {typeName}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            {summary || 'Your unique combination of traits makes you a visionary with the tactical skills to bring ideas to life.'}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Dimensions Card */}
        <motion.div variants={itemVariants} className="lg:col-span-7 glass-card p-6 sm:p-10 space-y-8 sm:space-y-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Compass size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900">Dimension Analysis</h3>
          </div>

          <div className="space-y-10">
            {renderDimension('Mind', 'Energy', 'Introverted', 'Extraverted', 'bg-indigo-600', dimensions?.mind)}
            {renderDimension('Perspective', 'Focus', 'Intuitive', 'Observant', 'bg-amber-600', dimensions?.energy)}
            {renderDimension('Nature', 'Decision', 'Thinking', 'Feeling', 'bg-emerald-600', dimensions?.nature)}
            {renderDimension('Tactics', 'Execution', 'Judging', 'Prospecting', 'bg-amber-500', dimensions?.tactics)}
          </div>
        </motion.div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 space-y-5 sm:space-y-6 border-indigo-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Briefcase size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 underline decoration-indigo-500/20 underline-offset-4 decoration-2">Career Guidance</h3>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Based on your <span className="text-indigo-600 font-bold">{mbtiType}</span> profile, you excel in environments that value strategic planning and empathetic leadership.
            </p>
            <button
              onClick={() => navigate('/career-guide')}
              className="w-full btn-primary py-3.5"
            >
              Explore Careers
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Zap size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-display font-bold text-slate-900">Key Strengths</h3>
            </div>
            <ul className="space-y-3">
              {['Strategic Thinker', 'Empathetic Leader', 'Creative Problem Solver'].map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-650 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 bg-slate-900 text-white border-slate-900">
            <div className="flex items-center justify-between mb-4">
              <Globe className="text-amber-400 sm:w-6 sm:h-6" size={20} />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Rank</span>
            </div>
            <p className="text-white font-display font-bold text-base sm:text-lg leading-tight">
              You share this type with <span className="text-amber-400">1.5%</span> of the population.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 sm:pt-8 px-4 sm:px-0">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4">
          Return to Dashboard
        </button>
        <button
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="btn-primary w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download size={18} />
              <span>Download Report</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
