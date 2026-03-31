import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain, Compass, Shield, Users } from 'lucide-react';
import { personalityTypes, groupMap } from '../data/personalityData';

const groupIcons = {
  "Analysts": Brain,
  "Diplomats": Sparkles,
  "Sentinels": Shield,
  "Explorers": Compass
};

const groupColors = {
  "Analysts": "from-indigo-600 to-violet-600",
  "Diplomats": "from-emerald-500 to-teal-600",
  "Sentinels": "from-blue-500 to-cyan-600",
  "Explorers": "from-amber-400 to-orange-500"
};

const groupBg = {
  "Analysts": "bg-indigo-50 text-indigo-600",
  "Diplomats": "bg-emerald-50 text-emerald-600",
  "Sentinels": "bg-blue-50 text-blue-600",
  "Explorers": "bg-amber-50 text-amber-600"
};

export default function TypesOverview({ user, onOpenLoginModal }) {
  const navigate = useNavigate();
  const groups = Object.keys(groupMap);

  const handleCTAClick = () => {
    if (user) {
      navigate('/test-intro');
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="text-center pt-8 sm:pt-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">16 Architectures</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
            Discover the unique strengths, motivations, and life paths of every personality type. Grouped by their core temperaments and cognitive styles.
          </p>
        </motion.div>
      </section>

      {/* Group Sections */}
      {groups.map((groupName, gIdx) => {
        const Icon = groupIcons[groupName];
        const typesInGroup = personalityTypes.filter(t => t.group === groupName);

        return (
          <section key={groupName} className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm ${groupBg[groupName]}`}>
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">{groupName}</h2>
                <p className="text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">Neural Blueprint Group</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {typesInGroup.map((type, tIdx) => (
                <motion.div
                  key={type.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: tIdx * 0.1 }}
                >
                  <Link 
                    to={`/types/${type.id}`}
                    className="group block glass-card p-6 h-full hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 mx-1"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-br ${groupColors[groupName]} text-white text-[9px] font-black tracking-widest shadow-lg shadow-indigo-500/20`}>
                        {type.code}
                      </div>
                      <ArrowRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={16} />
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {type.nickname}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3">
                      {type.overview}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                       <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Learn Details</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Global CTA */}
      <section className="max-w-5xl mx-auto px-4 mt-8 sm:mt-12">
        <div className="glass-card p-6 sm:p-12 border-indigo-100/50 bg-indigo-50/30 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">Which one are you?</h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium px-4 md:px-0">Take the 10-minute assessment to find your place in the matrix.</p>
          </div>
          <button 
            onClick={handleCTAClick}
            className="w-full md:w-auto btn-primary py-4 px-10 whitespace-nowrap shadow-xl shadow-indigo-600/20"
          >
            Start My Test
          </button>
        </div>
      </section>
    </div>
  );
}
