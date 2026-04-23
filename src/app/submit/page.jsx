"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowLeft,
  Send,
  Clock,
  Timer,
  ShieldCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { API_BASE_URL } from '@/config';
import PageLoader from '@/components/PageLoader';

export default function Submit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/mbti/test/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setSessionData(data.data);
        } else {
          setError(data.message || 'Failed to load session data.');
        }
      } catch (err) {
        console.error("Fetch session error:", err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/mbti/test/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') sessionStorage.setItem('next_state_testData', JSON.stringify(data.data));
        router.push('/result');
      } else {
        setError(data.message || 'Failed to validate and submit test.');
      }
    } catch (err) {
      console.error("Submit test error:", err);
      setError("Network error during submission. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader title="Compiling Responses" subtitle="Our AI is assembling your cognitive blueprint..." />;
  }

  const answeredCount = sessionData?.answeredQuestions?.length || 0;
  const totalCount = sessionData?.totalQuestions || 60;

  let startTimeDisplay = 'Unknown';
  let timeTakenDisplay = 'Unknown';
  if (sessionData && sessionData.startTime) {
    const start = new Date(sessionData.startTime);
    startTimeDisplay = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const diffMs = new Date() - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    timeTakenDisplay = `${diffMins}m ${diffSecs}s`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto w-full space-y-8 sm:space-y-10 py-6 sm:py-10 px-4 sm:px-6 md:px-0"
    >
      <div className="text-center space-y-4 sm:space-y-6">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 border-4 border-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 text-emerald-600"
        >
          <CheckCircle2 size={40} className="sm:w-12 sm:h-12" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl">
          {answeredCount === totalCount ? 'Assessment Complete' : 'Incomplete Progress'}
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto px-4">
          {answeredCount === totalCount ? 'All questions have been answered. You are ready to uncover your personality type.' : `You have answered ${answeredCount} of ${totalCount} questions.`}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl flex items-center gap-3 border border-rose-100 font-bold text-sm">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="glass-card p-6 sm:p-10 space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-slate-100">
          <FileCheck className="text-indigo-600 sm:w-6 sm:h-6" size={20} />
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">Session Blueprint</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Started
            </p>
            <p className="text-slate-900 font-bold text-base sm:text-lg">{startTimeDisplay}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Timer size={12} /> Duration
            </p>
            <p className="text-slate-900 font-bold text-base sm:text-lg">{timeTakenDisplay}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Responses</p>
            <p className="text-indigo-600 font-black text-xl sm:text-2xl">{answeredCount} <span className="text-slate-300 font-bold text-base sm:text-lg">/ {totalCount}</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} /> Security
            </p>
            <p className="text-slate-900 font-bold text-base sm:text-lg">Verified Session</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-start gap-3 sm:gap-4 mx-1 sm:mx-0">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
          <AlertTriangle size={18} className="sm:w-5 sm:h-5" />
        </div>
        <p className="text-amber-900/70 text-xs sm:text-sm font-medium leading-relaxed">
          <span className="font-bold block text-amber-900 mb-1 text-sm sm:text-base">Point of no return</span>
          Once you submit, your neural blueprint is locked. You can retake the assessment after a 30-day integration period.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0 pt-4">
        <button
          onClick={() => router.push('/questions')}
          className="flex-1 btn-secondary order-2 sm:order-1 py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Review Answers</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < totalCount}
          className="flex-[2] btn-primary order-1 sm:order-2 py-3.5 sm:py-4 text-lg sm:text-xl shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {submitting ? 'Finalizing Profile...' : 'Submit Assessment'}
          {!submitting && <Send size={18} className="sm:w-5 sm:h-5" />}
        </button>
      </div>
    </motion.div>
  );
}
