import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/mbti/results/${user?._id || user?.id || 'demo-user-id'}/history`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setHistory(data.data);
        } else {
          setError(data.message || 'Failed to fetch history data.');
        }
      } catch (err) {
        console.error("Test History Fetch Error:", err);
        setError("Network error while loading your test history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDetailedView = (testData) => {
    navigate('/result', { state: { testData } });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2 sm:mb-10">
        <div>
          <button 
             onClick={() => navigate('/dashboard')}
             className="text-slate-500 font-bold hover:text-slate-800 transition-colors mb-4 inline-block text-xs sm:text-sm"
          >
             ← Return to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-2">Test History</h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium">Review your previous MBTI personality assessments.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl font-bold mb-8">
          {error}
        </div>
      ) : null}

      {history.length === 0 && !error ? (
        <div className="glass-card rounded-[2.5rem] p-10 sm:p-16 text-center border-slate-100 shadow-xl mx-2">
          <div className="text-slate-300 text-5xl sm:text-6xl mb-4">📁</div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-2">No tests taken yet</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm sm:text-base">It looks like you haven't completed any personality tests. Your historical data will securely map here once finished.</p>
          <button 
            onClick={() => navigate('/test-intro')}
            className="btn-primary px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg"
          >
            Start Your First Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
          {history.map((test, idx) => (
            <div key={test._id || idx} className="glass-card border-transparent hover:border-indigo-100 rounded-2xl p-6 sm:p-7 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              {idx === 0 && (
                 <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-bl-xl">Latest</span>
              )}
              
              <div className="mb-6">
                <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1">Type Result</p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-indigo-600 tracking-tighter mb-1">
                  {test.mbtiType}
                </h2>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{test.dimensions?.mind?.dominant || '-'}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{test.dimensions?.energy?.dominant || '-'}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{test.dimensions?.nature?.dominant || '-'}</span>
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100">{test.dimensions?.tactics?.dominant || '-'}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-50 pt-4 mb-6">
                <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1">Completed On</p>
                <p className="text-slate-600 font-semibold text-sm">{formatDate(test.createdAt)}</p>
              </div>
              
              <button 
                onClick={() => handleDetailedView(test)}
                className="w-full bg-slate-50 text-slate-700 border border-slate-100 py-3 rounded-xl font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
              >
                View Full Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
