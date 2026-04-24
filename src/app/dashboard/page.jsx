"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  History as HistoryIcon,
  Zap,
  Briefcase,
  ArrowRight,
  Brain,
  GraduationCap,
  X
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import PageLoader from '@/components/PageLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const location = { state: {} }; // Mock for state

  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [demoAge, setDemoAge] = useState('');
  const [demoCountry, setDemoCountry] = useState('');
  const [quota, setQuota] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowLoader(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  const newResult = searchParams.get('result');

  const handleAssessmentClick = (type) => {
    if (user?.age && user?.country) {
      router.push(`/quick-assessment?type=${undefined}&age=${user.age}&country=${user.country}`);
    } else {
      setSelectedAssessment(type);
      setShowModal(true);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!demoAge || !demoCountry) return;
    setShowModal(false);
    router.push(`/quick-assessment?type=${selectedAssessment}&age=${demoAge}&country=${demoCountry}`);
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already or if user ID changes
    if (hasFetched.current === user?._id && user?._id) return;

    const fetchHistory = async () => {
      try {
        const userId = user?._id || user?.id || 'demo-user-id';
        const res = await fetch(`${API_BASE_URL}/mbti/results/${userId}/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTestHistory(data.data || []);
        }
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    };
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
      }
    };

    fetchHistory();
    fetchQuota();
    hasFetched.current = user?._id;
  }, [user?._id]);

  const testsTaken = testHistory.length;
  const latestTest = testHistory.length > 0 ? testHistory[0] : newResult;

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px]"
          >
            <PageLoader title="Syncing Workspace" subtitle="Collecting your latest assessments..." />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`space-y-6 sm:space-y-10 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="px-4 md:px-0">
            <h1 className="text-3xl sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0].toUpperCase() || 'Explorer'} <span className="inline-block animate-bounce-subtle">✨</span>
            </h1>
            <p className="text-slate-500 mt-2 text-base sm:text-lg font-medium">
              Your personal psychology dashboard. Explore, grow, and discover.
            </p>
          </div>
        </motion.div>

        {newResult && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-50 border border-emerald-100 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 text-emerald-800 font-semibold shadow-sm mx-4 md:mx-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
              <Sparkles size={16} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base">New Insight: Your personality type is <span className="text-emerald-900 font-bold">{latestTest?.mbtiType || '—'}</span>. Check your report below!</span>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-amber-600 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-15 transition-opacity" />
          <div className="glass-card p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row justify-between border-indigo-100/50 mx-4 md:mx-0">
            <div className="z-10 relative flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-indigo-200">
                  Core Assessment
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 mb-4 leading-tight">
                {latestTest ? `You are an ${latestTest.mbtiType}` : `Uncover Your True Self`}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-medium mx-auto lg:mx-0">
                {latestTest
                  ? `You possess the traits of ${latestTest.typeName}. Dive deep into your professional and personal dynamics with our AI-enhanced analysis.`
                  : `Join over 2 million people who have taken the test. It takes less than 12 minutes and gives you a roadmap for your career and relationships.`
                }
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => router.push('/test-intro')}
                  className="w-full sm:w-auto btn-primary"
                >
                  {latestTest ? 'Retake Assessment' : 'Start Your Journey'} <ArrowRight size={20} />
                </button>
                {latestTest ? (
                  <button
                    onClick={() => router.push('/result')}
                    className="btn-secondary"
                  >
                    Full Personality Report
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/about-16-personalities')}
                    className="btn-secondary"
                  >
                    What is MBTI?
                  </button>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center pr-8">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" />
                {latestTest ? (
                  <div className="text-[100px] xl:text-[140px] brand-shimmer opacity-20 select-none">
                    {latestTest.mbtiType}
                  </div>
                ) : (
                  <Brain size={140} className="text-indigo-600 opacity-10" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-4 md:px-0">
          {[
            {
              label: 'Total Insights',
              value: loading ? '...' : testsTaken,
              sub: 'Completed Tests',
              icon: <HistoryIcon size={24} />,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
              border: 'border-indigo-100',
              action: () => router.push('/history')
            },
            // { 
            //   label: 'Current Streak', 
            //   value: '3 Days', 
            //   sub: 'Mindfulness streak', 
            //   icon: <Zap size={24} />, 
            //   color: 'text-amber-500',
            //   bg: 'bg-amber-50',
            //   border: 'border-amber-100'
            // },
            {
              label: 'Career Match',
              value: latestTest ? '14+' : '—',
              sub: 'Tailored paths',
              icon: <Briefcase size={24} />,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              border: 'border-emerald-100',
              action: () => latestTest && router.push('/career-guide'),
              locked: !latestTest
            },
            {
              label: 'Test Quota',
              value: quota ? quota.testsRemaining : '...',
              sub: 'Available attempts',
              icon: <Sparkles size={24} />,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              border: 'border-amber-100',
              action: () => router.push('/pricing')
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onClick={stat.action}
              className={`glass-card glass-card-hover p-6 sm:p-8 group border-transparent hover:border-indigo-100/50 ${stat.action ? 'cursor-pointer' : ''} ${stat.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                {stat.action && !stat.locked && (
                  <span className="text-xs font-bold text-indigo-600 group-hover:underline">Explore →</span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm font-medium">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Assessments */}
        <motion.div variants={itemVariants} className="space-y-6 px-4 md:px-0">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">Psychology Modules</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div
              onClick={() => handleAssessmentClick('psychometric')}
              className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 cursor-pointer border-transparent hover:border-indigo-100/50 group text-center sm:text-left"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Brain size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-0.5 rounded-full">BIG FIVE</span>
                  <span className="text-slate-400 text-xs font-medium">10 Questions</span>
                </div>
                <h4 className="text-slate-900 font-bold text-xl mb-1 mt-1 font-display">Personality Quick Check</h4>
                <p className="text-slate-500 text-sm font-medium">High-precision AI analysis for a quick overview.</p>
              </div>
            </div>

            <div
              onClick={() => handleAssessmentClick('career')}
              className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 cursor-pointer border-transparent hover:border-rose-100/50 group text-center sm:text-left"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-0.5 rounded-full">RIASEC</span>
                  <span className="text-slate-400 text-xs font-medium">10 Questions</span>
                </div>
                <h4 className="text-slate-900 font-bold text-xl mb-1 mt-1 font-display">Career Interest Check</h4>
                <p className="text-slate-500 text-sm font-medium">Identify your Holland codes for ideal workspace fit.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demographics Request Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative border border-white"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Refine Analysis</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">
                Help us sharpen our insights by providing a few quick details about your journey.
              </p>
              <form onSubmit={handleModalSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Current Age</label>
                  <input
                    type="number"
                    value={demoAge}
                    onChange={(e) => setDemoAge(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="e.g. 24"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Location / Country</label>
                  <input
                    type="text"
                    value={demoCountry}
                    onChange={(e) => setDemoCountry(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="e.g. United Kingdom"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-4 pt-4.5 rounded-2xl mt-4"
                >
                  Proceed to Assessment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
}
