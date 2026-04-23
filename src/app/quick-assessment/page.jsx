"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import PageLoader from '@/components/PageLoader';

export default function QuickAssessment({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const age = searchParams.get('age');
  const country = searchParams.get('country');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Initializing Quick Check...');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (!type || !age || !country) {
      router.push('/dashboard');
      return;
    }

    const fetchInitial = async () => {
      try {
        const endpoint = type === 'career'
          ? `${API_BASE_URL}/ai-assistance/initial-career-questions`
          : `${API_BASE_URL}/ai-assistance/initial-psychometric-questions`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId: user?._id || user?.id || 'demo-user-id' })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setQuestions(data.questions);
        } else {
          setError(data.message || 'Failed to load initial questions.');
        }
      } catch (err) {
        console.error("Init Error:", err);
        setError("Network error while starting assessment.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [type, age, country, router, user]);

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { id: currentQ.id, text: currentQ.text, score: selectedAnswer }];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    // Phase 2: Fetch 5 more AI questions
    if (currentIndex === 4) {
      setLoading(true);
      setLoadingMsg('Analyzing your baseline and generating dynamic follow-up questions...');
      try {
        const endpoint = type === 'career'
          ? `${API_BASE_URL}/ai-assistance/career-followup-questions`
          : `${API_BASE_URL}/ai-assistance/psychometric-followup-questions`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ country, age, answers: newAnswers })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setQuestions([...questions, ...data.data.follow_up_questions]);
          setCurrentIndex(5);
        } else {
          setError(data.message || 'Failed to generate follow-up questions.');
        }
      } catch (err) {
        console.error("Phase 2 Error:", err);
        setError("Network error while contacting AI.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Phase 3: Final Analysis
    if (currentIndex === 9) {
      setLoading(true);
      setLoadingMsg('Generating your final AI analysis report... This takes a moment.');
      try {
        const endpoint = type === 'career'
          ? `${API_BASE_URL}/ai-assistance/analyze-career-full`
          : `${API_BASE_URL}/ai-assistance/analyze-psychometric-full`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ country, age, answers: newAnswers })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResult(data.data);
        } else {
          setError(data.message || 'Analysis failed.');
        }
      } catch (err) {
        console.error("Analysis Error:", err);
        setError("Network error during final analysis.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  if (loading) {
    return (
      <PageLoader 
        title={loadingMsg} 
        subtitle="This usually takes a few seconds for our AI to craft deep insights." 
      />
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-app-primary text-white rounded-full font-bold hover:bg-[#006b82]">Return to Dashboard</button>
      </div>
    );
  }

  // Final Results Render
  if (result) {
    return (
      <div className="max-w-3xl mx-auto w-full py-6 sm:py-10 px-4 mt-4 sm:mt-8">
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-12 border-indigo-100/50 shadow-2xl text-center relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

          <p className="text-indigo-600 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-4">
            {type === 'career' ? 'Career Assessment Result' : 'Personality Rapid Check'}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl brand-shimmer mb-2">
            {result.recommendedCareer || result.personality}
          </h1>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 mt-6">
            {(result.dominant_categories || [result.dominant_trait]).map((trait, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-700 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                {trait}
              </span>
            ))}
          </div>

          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-6 sm:p-8 text-left relative shadow-inner">
            <span className="text-4xl absolute -top-4 -left-2 opacity-10 text-indigo-600 font-serif">❝</span>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed relative z-10 font-medium italic">
              {result.reason}
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="mt-10 w-full sm:w-auto btn-primary py-4 px-10 text-lg shadow-xl shadow-indigo-600/20"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  // 10 questions total
  const progressPercent = Math.round((currentIndex / 10) * 100);

  return (
    <div className="h-full flex flex-col justify-between max-w-4xl mx-auto w-full pt-4 pb-12 px-4">
      {/* Header Info */}
      <header className="flex justify-between items-center mb-6 sm:mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-slate-800 border border-slate-200 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all bg-white shadow-sm"
        >
          ← Exit
        </button>

        <div className="text-center">
          <p className="text-slate-900 text-lg sm:text-xl font-display font-bold">{currentIndex + 1} <span className="text-slate-400 font-medium text-sm sm:text-base">/ 10</span></p>
          <p className="text-indigo-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-1">AI Quick Check Module</p>
        </div>
        <div className="w-12 sm:w-16"></div> {/* Spacer */}
      </header>

      {/* Progress Bar */}
      <div className="mb-10 sm:mb-12 glass-card p-3 sm:p-4 border-slate-100 shadow-sm bg-white/50">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
          <span>{progressPercent}% Complete</span>
          <span className="text-indigo-600">{10 - currentIndex} Remaining</span>
        </div>
        <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full flex overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-amber-600 rounded-full shadow-sm transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <main className="flex-[1] flex flex-col items-center justify-center">
        {error && (
          <div className="mb-4 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm border border-red-500/20 w-full max-w-2xl text-center">
            {error}
          </div>
        )}

        <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-[10px] mb-6 text-center">
          {currentIndex < 5 ? 'PHASE 1 : BASELINE' : 'PHASE 2 : AI DEEP DIVE'}
        </p>

        <div className="glass-card border-indigo-100 p-8 sm:p-14 w-full text-center shadow-lg relative mb-10 sm:mb-12 bg-white/40 backdrop-blur-sm">
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1.5 bg-indigo-600/20 rounded-full"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-900 leading-relaxed px-2">
            "{currentQ?.text || currentQ?.question}"
          </h2>
        </div>

        {/* Custom Likert Scale UI */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-2xl mb-4 px-2 sm:px-4">
            <span className="text-rose-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">Disagree</span>
            <span className="text-slate-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider">Neutral</span>
            <span className="text-emerald-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider">Agree</span>
          </div>

          <div className="flex items-center justify-between w-full max-w-2xl relative mb-10 px-4 sm:px-8">
            <div className="absolute top-1/2 left-6 sm:left-10 right-6 sm:right-10 h-1 bg-slate-100 -z-10 rounded-full"></div>
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = selectedAnswer === val;
              let bgColor = 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400';

              if (isSelected) {
                if (val < 3) bgColor = 'bg-rose-500 text-white shadow-xl shadow-rose-200 border-transparent scale-110 sm:scale-125';
                else if (val > 3) bgColor = 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 border-transparent scale-110 sm:scale-125';
                else bgColor = 'bg-slate-500 text-white shadow-xl shadow-slate-200 border-transparent scale-110 sm:scale-125';
              }

              return (
                <button
                  key={val}
                  onClick={() => setSelectedAnswer(val)}
                  className={`flex items-center justify-center rounded-full transition-all duration-300 font-black border-2 ${isSelected ? 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl' : 'w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg bg-white shadow-sm'
                    } ${bgColor}`}
                >
                  {val}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full max-w-md font-bold py-4 sm:py-5 px-6 rounded-2xl transition-all text-lg shadow-xl ${selectedAnswer === null ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-60' : 'btn-primary shadow-indigo-600/20 active:scale-[0.98]'}`}
          >
            {currentIndex === 9 ? 'Finalize Analysis →' : 'Next Question →'}
          </button>
        </div>
      </main>
    </div>
  );
}
