import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function ShareSave({ user }) {
  const navigate = useNavigate();
  const [resultId, setResultId] = useState(null);
  const [mbtiType, setMbtiType] = useState('MBTI');
  const [parentEmail, setParentEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [dlError, setDlError] = useState('');

  const location = useLocation();
  const passedResultId = location.state?.resultId;
  const passedMbtiType = location.state?.mbtiType;

  // Use the passed resultId if available, otherwise fetch the latest
  useEffect(() => {
    if (passedResultId) {
      setResultId(passedResultId);
      if (passedMbtiType) setMbtiType(passedMbtiType);
      return;
    }

    const fetchLatest = async () => {
      try {
        const userId = user?._id || user?.id || 'demo-user-id';
        const res = await fetch(`${API_BASE_URL}/mbti/results/${userId}/latest`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setResultId(data.data._id);
          setMbtiType(data.data.mbtiType);
        }
      } catch (err) {
        console.error("Error fetching latest result init: ", err);
      }
    };
    fetchLatest();
  }, [user, passedResultId]);

  const handleDownload = async () => {
    if (!resultId) return;
    setDownloading(true);
    setDlError('');
    try {
      const res = await fetch(`${API_BASE_URL}/mbti/report/${resultId}/download`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error("Failed to download report");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${user?.name?.replace(/\s+/g, '_') || 'Student'}_MBTI_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDlError("Failed to trigger download.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSend = async () => {
    if (!resultId || !parentEmail) return;
    setSending(true);
    setSendMsg('');
    try {
      const userId = user?._id || user?.id || 'demo-user-id';
      const res = await fetch(`${API_BASE_URL}/mbti/report/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, resultId, parentEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSendMsg("Email sent successfully!");
        setParentEmail('');
      } else {
        setSendMsg(data.message || "Failed to send email.");
      }
    } catch (err) {
      setSendMsg("Network error.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6 sm:py-10 px-4">
      <div className="glass-card border-indigo-100 rounded-[2.5rem] p-8 sm:p-14 text-center shadow-2xl relative mb-8 bg-white/40 backdrop-blur-md">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </div>

        <h1 className="heading-hero mb-4">
          Download Your <br className="sm:hidden" /> <span className="brand-shimmer">Full Report</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-8 sm:mb-10 font-medium text-center">
          Your personalised 8-page PDF — complete personality profile, career paths, and AI-driven action plan.
        </p>

        <ul className="w-fit mx-auto text-left space-y-3 sm:space-y-4 mb-10 sm:mb-12">
          {[
            `Full ${mbtiType || 'MBTI'} breakdown`,
            'Career roadmap with AI guidance',
            'AI-personalised 5 action steps',
            'Shareable with parents & counselors',
            'Role models & growth blueprint'
          ].map((item, i) => (
            <li key={i} className="flex items-center text-slate-600 font-bold text-sm">
              <span className="text-emerald-500 mr-3 text-lg">✓</span> {item}
            </li>
          ))}
        </ul>

        {dlError && <p className="text-rose-500 mb-4 font-bold text-sm">{dlError}</p>}

        <div className="flex justify-center flex-col items-center">
          <button
            onClick={handleDownload}
            disabled={downloading || !resultId}
            className="btn-primary py-4 sm:py-5 px-8 sm:px-10 rounded-xl w-full max-w-sm text-lg sm:text-xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            {downloading ? "Generating PDF..." : "📥 Download PDF Report"}
          </button>
          
          <p className="text-slate-400 text-xs mt-6 font-medium">Also sent to {user?.email || 'your email'}</p>
        </div>
      </div>

      <div className="glass-card border-slate-100 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-xl gap-4 sm:gap-0 bg-white/60">
        <div className="mb-2 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
          <h3 className="text-slate-900 font-display font-bold text-lg mb-1">Collaborate</h3>
          <p className="text-slate-500 text-xs font-medium">Email your report to a parent or counselor</p>
        </div>
        <div className="flex w-full sm:w-auto relative group">
          <input
            type="email"
            placeholder="parent@example.com"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="w-full sm:w-64 bg-white border border-slate-100 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-300 text-sm focus:ring-4 focus:ring-indigo-500/5 outline-none pr-28 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={sending || !parentEmail}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 font-bold px-4 rounded-lg transition-all text-xs active:scale-[0.95]"
          >
            {sending ? 'Sending...' : 'Send →'}
          </button>
        </div>
      </div>
      {sendMsg && <p className="text-center mt-4 text-emerald-600 font-bold text-sm">{sendMsg}</p>}

      <div className="mt-8 flex justify-center">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 font-bold hover:text-indigo-600 transition-colors text-sm">
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
