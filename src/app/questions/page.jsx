"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import PageLoader from '@/components/PageLoader';

export default function Questions() {
  const router = useRouter();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answersMap, setAnswersMap] = useState({});

  const initialized = React.useRef(false);

  useEffect(() => {
    const startTest = async () => {
      if (initialized.current) return;
      initialized.current = true;
      try {
        const userId = user?._id || user?.id || 'demo-user-id';
        const res = await fetch(`${API_BASE_URL}/mbti/test/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setSessionId(data.data.sessionId);
          setQuestions(data.data.questions);

          const progress = data.data.progress || 0;
          const total = data.data.totalQuestions || 60;
          const newIndex = progress < total ? progress : total - 1;
          setCurrentIndex(newIndex);

          const initMap = {};
          if (data.data.answeredQuestions) {
            data.data.answeredQuestions.forEach(a => {
              initMap[a.questionId] = a.score;
            });
            setAnswersMap(initMap);
          }

          const qId = data.data.questions[newIndex]?.id;
          setSelectedAnswer(initMap[qId] || null);
        } else {
          setError(data.message || 'Failed to initialize test.');
        }
      } catch (err) {
        console.error("Test initialization error:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    startTest();
  }, [user]);

  const handleNext = async () => {
    if (selectedAnswer === null) return;
    setSaving(true);
    const currentQ = questions[currentIndex];

    try {
      const res = await fetch(`${API_BASE_URL}/mbti/test/${sessionId}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ questionId: currentQ.id, score: selectedAnswer })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAnswersMap(prev => ({ ...prev, [currentQ.id]: selectedAnswer }));

        if (currentIndex < questions.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          const nextQ = questions[nextIndex];
          setSelectedAnswer(answersMap[nextQ.id] || null);
          setError('');
        } else {
          router.push(`/submit?sessionId=${sessionId}`);
        }
      } else {
        setError(data.message || 'Failed to save answer.');
      }
    } catch (err) {
      console.error("Save answer error:", err);
      setError("Network or server error while saving answer.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const prevQ = questions[prevIndex];
      setSelectedAnswer(answersMap[prevQ.id] || null);
      setError('');
    }
  };

  if (loading) {
    return <PageLoader title="Initializing Persona Lab" subtitle="Setting up your cognitive workspace..." />;
  }

  if (error && questions.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
          <AlertCircle size={32} />
        </div>
        <p className="text-red-600 font-bold text-lg mb-6">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="btn-secondary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answersMap).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const getLikertLabel = (val) => {
    if (val < 4) return 'Disagree';
    if (val > 4) return 'Agree';
    return 'Neutral';
  };

  const getLikertColor = (val) => {
    if (val < 4) return 'bg-rose-500 shadow-rose-200 ring-rose-100';
    if (val > 4) return 'bg-emerald-500 shadow-emerald-200 ring-emerald-100';
    return 'bg-slate-400 shadow-slate-200 ring-slate-100';
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-0 pb-12">
      {/* Header Navigation */}
      <header className="flex justify-between items-center sm:px-2">
        <button
          onClick={() => router.push('/test-intro')}
          className="flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors text-xs sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Exit</span>
        </button>

        <div className="flex sm:flex flex-col items-center">
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 sm:px-3 py-1 rounded-full border border-indigo-100">
            Assessment
          </span>
        </div>

        <button
          className="flex items-center gap-1 sm:gap-2 text-indigo-600 hover:bg-indigo-50 px-3 sm:px-4 py-2 rounded-xl transition-all font-semibold text-xs sm:text-base"
        >
          <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Save</span>
        </button>
      </header>

      {/* Progress & Visualizer */}
      <div className="glass-card p-4 sm:p-6 border-slate-100">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <span className="text-2xl sm:text-3xl font-display font-bold text-slate-900">{currentIndex + 1}</span>
            <span className="text-slate-400 font-bold mx-1">/</span>
            <span className="text-slate-500 font-bold">{questions.length}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Progress</p>
            <p className="text-indigo-600 font-bold text-base sm:text-lg">{progressPercent}%</p>
          </div>
        </div>
        <div className="w-full h-2.5 sm:h-3 bg-slate-100 rounded-full overflow-hidden mb-6 flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-indigo-600 to-amber-600 shadow-lg shadow-indigo-600/20"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 px-1">
          {['Mind', 'Energy', 'Nature', 'Tactics'].map((trait, idx) => {
            const segmentSize = questions.length / 4;
            const isTraitActive = currentIndex >= idx * segmentSize;
            const isTraitDone = (currentIndex + 1) > (idx + 1) * segmentSize;
            return (
              <div key={trait} className="flex flex-col items-center gap-1.5 opacity-80">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isTraitDone ? 'bg-emerald-500' : isTraitActive ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-200'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isTraitActive ? 'text-slate-800' : 'text-slate-400'}`}>
                  {trait}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 border border-rose-100 font-bold text-sm"
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <div className="text-center py-6 sm:py-10 px-4 sm:px-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-1.5 bg-indigo-600/20 rounded-full" />
            <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 leading-[1.3] max-w-2xl mx-auto">
              "{currentQ?.text}"
            </h2>
          </div>

          {/* Likert Scale */}
          <div className="w-full flex flex-col items-center space-y-12">
            <div className="flex items-center justify-between w-full max-w-2xl px-4 text-xs font-bold tracking-widest uppercase text-slate-400">
              <span className="text-rose-400">Disagree</span>
              <span>Neutral</span>
              <span className="text-emerald-400">Agree</span>
            </div>

            <div className="flex items-center justify-between w-full max-w-2xl relative px-2 sm:px-4">
              <div className="absolute top-1/2 left-6 sm:left-8 right-6 sm:right-8 h-1 bg-slate-100 -z-10 rounded-full" />
              {[1, 2, 3, 4, 5, 6, 7].map((val) => {
                const isSelected = selectedAnswer === val;

                return (
                  <button
                    key={val}
                    onClick={() => setSelectedAnswer(val)}
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 group ${isSelected ? 'w-12 h-12 sm:w-20 sm:h-20 scale-110 sm:scale-110' : 'w-8 h-8 sm:w-12 sm:h-12 bg-white border-2 border-slate-200 hover:border-indigo-400'
                      }`}
                  >
                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isSelected ? `${getLikertColor(val)} ring-4 shadow-xl` : 'opacity-0'}`} />
                    <span className={`relative z-10 font-bold transition-all ${isSelected ? 'text-white text-base sm:text-2xl' : 'text-slate-400 group-hover:text-indigo-600 text-[10px] sm:text-base'}`}>
                      {val}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="h-10">
              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full font-bold shadow-lg"
                  >
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>{getLikertLabel(selectedAnswer)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 sm:gap-4 w-full max-w-xl">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0 || saving}
                className="flex-1 btn-secondary py-3 sm:py-4 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Prev</span>
              </button>
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null || saving}
                className="flex-[2] btn-primary py-3 sm:py-4 flex items-center justify-center gap-2"
              >
                <span className="text-sm sm:text-base">{saving ? 'Processing...' : (currentIndex === questions.length - 1 ? 'See Results' : 'Navigate Next')}</span>
                {!saving && <ChevronRight size={16} className="sm:w-5 sm:h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <CheckCircle2 size={16} />
              <span>Response auto-saved at Q{answeredCount}</span>
            </div>
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
