import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, History, Target, ShieldCheck,
  ChevronRight, HelpCircle, ArrowRight,
  Brain, Layers, Zap, Search, ChevronDown,
  Info, Cpu
} from 'lucide-react';
import { aboutContent, dichotomies, faq } from '../data/personalityData';

const SectionHeader = ({ icon: Icon, title, subtitle, centered = true }) => (
  <div className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} mb-12`}>
    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100/50 shadow-sm">
      <Icon size={28} />
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 max-w-2xl font-medium leading-relaxed px-4">{subtitle}</p>}
  </div>
);

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md mb-4 group transition-all hover:border-indigo-100">
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
    >
      <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        className="text-slate-400"
      >
        <ChevronDown size={20} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-2 text-slate-500 text-sm leading-relaxed font-medium">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function About({ user, onOpenLoginModal }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCTAClick = () => {
    if (user) {
      navigate('/test-intro');
    } else {
      onOpenLoginModal();
    }
  };

  const tabs = [
    { id: 'history', label: 'History', icon: History, content: aboutContent.history },
    { id: 'determination', label: 'Methodology', icon: Cpu, content: aboutContent.determination },
    { id: 'scientific', label: 'Scientific View', icon: ShieldCheck, content: aboutContent.scientific },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32 pb-16 sm:pb-32">
      {/* Hero Section */}
      <section className="relative pt-12 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none -z-10">
          <div className="absolute top-0 left-[30%] w-[300px] h-[300px] bg-indigo-200/20 blur-[100px] rounded-full" />
          <div className="absolute top-[10%] right-[30%] w-[300px] h-[300px] bg-violet-200/20 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4"
        >
          <span className="inline-block px-4 py-2 bg-white/50 backdrop-blur-md text-indigo-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-indigo-100/50 mb-8 shadow-sm">
            Knowledge Ecosystem
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-slate-900 tracking-tight mb-6 sm:mb-8 px-4">
            The Philosophy of <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Type</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto px-6">
            {aboutContent.mission}
          </p>
        </motion.div>
      </section>

      {/* Interactive Foundations Section */}
      <section className="max-w-6xl mx-auto px-4">
        <SectionHeader
          icon={Layers}
          title="The Framework Foundations"
          subtitle="Explore the origins, the scientific debate, and the methodology behind the 16 personality types."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10 bg-slate-100/50 p-1.5 rounded-2xl w-full sm:w-fit mx-auto backdrop-blur-sm border border-slate-200/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <tab.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-card border-white/60 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-indigo-500/5 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 sm:space-y-8 p-6 sm:p-12 md:p-16"
            >
              {tabs.find(t => t.id === activeTab).content.split('\n').map((para, i) => (
                <p key={i} className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                  {para.trim()}
                </p>
              ))}

              {activeTab === 'scientific' && (
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/50">
                  <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100/50">
                    <h4 className="text-emerald-700 font-bold mb-4 flex items-center gap-2 text-lg">
                      <ShieldCheck size={20} /> Points of Support
                    </h4>
                    <p className="text-emerald-600/80 text-[15px] font-medium leading-relaxed">
                      High resonance with users, predictive of general behavioral patterns, and highly effective for team-building and self-reflection.
                    </p>
                  </div>
                  <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100/50">
                    <h4 className="text-rose-700 font-bold mb-4 flex items-center gap-2 text-lg">
                      <Info size={20} /> Critical Limitations
                    </h4>
                    <p className="text-rose-600/80 text-[15px] font-medium leading-relaxed">
                      Binary results can mask complexity (continuous traits), and test-retest reliability varies across different clinical studies.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Dichotomy Explorer */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -mr-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-start">
            <div className="w-full lg:w-1/4 space-y-3 sm:space-y-4">
              <div className="mb-8 lg:mb-12 text-center lg:text-left">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-3">Neural Spectrum</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">The Four <br className="hidden lg:block" />Dimensions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 w-full">
                {dichotomies.map((dim, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDimIdx(idx)}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl transition-all border flex items-center justify-between group ${activeDimIdx === idx
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/40'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <div>
                      <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${activeDimIdx === idx ? 'text-indigo-200' : 'text-slate-500'}`}>Dimension {idx + 1}</span>
                      <span className="font-bold text-xs sm:text-sm tracking-tight">{dim.title.split(':')[1].trim()}</span>
                    </div>
                    <ChevronRight size={18} className={`transition-transform ${activeDimIdx === idx ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full mt-4 lg:mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDimIdx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="glass-card bg-white/5 border-white/10 p-6 sm:p-12 min-h-[450px] sm:min-h-[550px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-indigo-500/30 shrink-0">
                        <Brain size={24} className="sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
                        {dichotomies[activeDimIdx].title.split(':')[1].trim()}
                      </h3>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                      <p className="text-slate-300 text-base sm:text-xl leading-[1.6] font-medium">
                        {dichotomies[activeDimIdx].content.split('. ').slice(0, 2).join('. ') + '.'}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 pt-6 sm:pt-8 border-t border-white/5">
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Primary Preference</h4>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                            {dichotomies[activeDimIdx].content.split('.')[2] + '.'}
                          </p>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Counter Preference</h4>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                            {dichotomies[activeDimIdx].content.split('.')[4] + '.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 flex flex-wrap gap-4">
                    <span className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                      <Zap size={14} /> Cognitive Axis
                    </span>
                    <span className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                      <Search size={14} /> Matrix Insight
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4">
        <SectionHeader
          icon={HelpCircle}
          title="Common Questions"
          subtitle="Explore our comprehensive knowledge base for quick insights."
        />

        <div className="space-y-2">
          {faq.map((item, idx) => (
            <AccordionItem
              key={idx}
              question={item.question}
              answer={item.answer}
              isOpen={openFaq === idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            />
          ))}
        </div>
      </section>

      {/* Optimized Call to Action */}
      <section className="max-w-5xl mx-auto px-4 mb-20 text-center">
        <motion.div
          className="relative rounded-[40px] overflow-hidden bg-slate-900 p-12 md:p-24 border border-white/5"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full -ml-40 -mt-40" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/10 blur-[120px] rounded-full -mr-40 -mb-40" />

          <div className="relative z-10 space-y-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Ready to Discover Your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Unique Blueprint?</span>
            </h2>
            <div className="pt-4">
              <button
                onClick={handleCTAClick}
                className="btn-primary py-5 sm:py-6 px-10 sm:px-16 text-lg sm:text-xl shadow-2xl shadow-indigo-600/40 relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  {user ? 'Resume Assessment' : 'Start Assessment'}
                  <ArrowRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">View Your Detailed report in 10 minutes.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
