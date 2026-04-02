import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function CareerGuide({ user }) {
  const navigate = useNavigate();
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const passedResultId = location.state?.resultId;

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const userId = user?._id || user?.id || 'demo-user-id';
        const res = await fetch(`${API_BASE_URL}/mbti/career-guidance/personalized`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            userId, 
            age: user?.age, 
            country: user?.country,
            resultId: passedResultId // Pass the specific result ID
          })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setCareerData(data.data);
        } else {
          setError(data.message || 'Failed to fetch the career guidance.');
        }
      } catch (err) {
        console.error("Fetch career error: ", err);
        setError("Network error fetching career guidance.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuidance();
  }, [user, passedResultId]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-bold text-lg animate-pulse">Our AI is personalizing your career paths...</p>
        <p className="text-slate-400 opacity-75 text-sm mt-2">This usually takes a few seconds to generate deep insights.</p>
      </div>
    );
  }

  if (error || !careerData) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <p className="text-red-500 font-bold">{error || 'No career data found.'}</p>
        <button className="bg-app-primary text-white font-bold py-2 px-6 rounded-xl" onClick={() => navigate('/result')}>Back to Result</button>
      </div>
    );
  }

  const { typeName, staticGuidance, personalizedAdvice } = careerData;

  return (
    <div className="max-w-4xl mx-auto w-full py-6 sm:py-10 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8 sm:mb-10 w-full px-1">
        <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] sm:text-xs">AI CAREER ANALYSIS</p>
        <button className="px-4 sm:px-5 py-1.5 rounded-full bg-white border border-slate-100 text-slate-500 text-[10px] sm:text-xs font-bold shadow-sm">
          {typeName} Paths
        </button>
      </div>

      <div className="text-center mb-12 sm:mb-16">
        <h1 className="heading-hero">
          Your Personalised <span className="brand-shimmer">Paths</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          {personalizedAdvice?.personalizedAdvice || "Here are the top career recommendations curated just for you based on your unique dimensions."}
        </p>
      </div>

      <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mb-6 px-1">TOP RECOMMENDATIONS</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
        {personalizedAdvice?.topCareers?.map((career, i) => (
          <div key={i} className="glass-card rounded-[2rem] p-6 sm:p-8 border-transparent hover:border-indigo-100 transition-all group">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{career.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{career.whySuitable}</p>
          </div>
        ))}
        {staticGuidance?.careerPaths?.slice(0, 4 - (personalizedAdvice?.topCareers?.length || 0)).map((career, i) => (
          <div key={`static-${i}`} className="glass-card rounded-[2rem] p-6 sm:p-8 border-transparent hover:border-indigo-100 transition-all group">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{career.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{career.description}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mb-6 px-1">IMMEDIATE ACTION STEPS</p>
      <div className="glass-card rounded-[2rem] p-6 sm:p-8 border-transparent mb-12 shadow-xl">
        <ul className="space-y-4 sm:space-y-5">
          {personalizedAdvice?.immediateSteps?.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="bg-indigo-50 text-indigo-600 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-100">{i + 1}</span>
              <p className="text-slate-600 font-semibold leading-relaxed pt-1 text-sm sm:text-base">{step}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <button
          onClick={() => navigate('/result')}
          className="flex-1 btn-secondary py-3.5 sm:py-4 text-sm sm:text-base order-2 sm:order-1 flex items-center justify-center gap-2"
        >
          <span>← Back to Analysis</span>
        </button>
        <button
          onClick={() => navigate('/share-save', { state: { resultId: passedResultId, mbtiType: careerData?.mbtiType } })}
          className="flex-[2] btn-primary py-3.5 sm:py-4 text-base sm:text-lg order-1 sm:order-2 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          <span>Share & Save Results →</span>
        </button>
      </div>
    </div>
  );
}
