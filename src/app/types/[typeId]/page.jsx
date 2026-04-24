"use client";

import { useRouter, useParams, notFound } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

import React from 'react';
import { motion } from 'framer-motion';
import {
   ArrowLeft, Brain, Briefcase, Heart,
   TrendingUp, Award, AlertCircle, Quote,
   Users, Sparkles, Zap, Target
} from 'lucide-react';
import { personalityTypes } from '@/data/personalityData';

const SectionTitle = ({ icon: Icon, title, color }) => (
   <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
         <Icon size={20} />
      </div>
      <h3 className="text-2xl font-display font-bold text-slate-900">{title}</h3>
   </div>
);

export default function TypeDetail() {
   const router = useRouter();
   const { user, toggleLoginModal } = useAuth();
   const { typeId } = useParams();
   const type = personalityTypes.find(t => t.id === typeId?.toLowerCase());

   if (!type) notFound();

   const handleCTAClick = () => {
      if (user) {
         router.push('/test-intro');
      } else {
         toggleLoginModal();
      }
   };

   const groupColors = {
      "Analysts": "bg-indigo-50 text-indigo-600 border-indigo-100",
      "Diplomats": "bg-emerald-50 text-emerald-600 border-emerald-100",
      "Sentinels": "bg-blue-50 text-blue-600 border-blue-100",
      "Explorers": "bg-amber-50 text-amber-600 border-amber-100"
   };

   const accentColor = groupColors[type.group] || groupColors["Analysts"];

   return (
      <div className="max-w-6xl mx-auto px-4 pb-24">
         {/* Back Button */}
         <Link href="/types"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-6 sm:mb-10 transition-colors group text-sm sm:text-base"
         >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Types</span>
         </Link>

         {/* Hero Section */}
         <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 sm:mb-24 px-2 sm:px-0">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative aspect-square sm:aspect-auto sm:h-[450px] lg:h-auto lg:aspect-square rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl shadow-indigo-500/10 order-2 lg:order-1"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-amber-500/10" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[100px] sm:text-[140px] lg:text-[180px] font-black text-indigo-600/5 select-none tracking-tighter">
                     {type.code}
                  </div>
               </div>
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/10 backdrop-blur-[2px]">
                  <Sparkles className="text-indigo-500 mb-4 sm:mb-6 sm:w-12 sm:h-12" size={32} />
                  <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-800 mb-3 sm:mb-4">{type.nickname}</h2>
                  <div className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 sm:mb-6 ${accentColor}`}>
                     {type.code} | {type.group}
                  </div>
                  <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-sm">
                     "{type.overview.split('. ')[0]}."
                  </p>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6 sm:space-y-8 order-1 lg:order-2 text-center lg:text-left"
            >
               <div>
                  <span className="text-indigo-500 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-2 sm:mb-3 block">Profile Insight</span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                     Discovering <br className="hidden sm:block" />
                     <span className="brand-shimmer">The {type.nickname.replace('The ', '')}</span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed px-2 sm:px-0">
                     {type.overview}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rarity</p>
                     <p className="text-lg font-bold text-slate-800">{type.rarity}</p>
                  </div>
                  <div className="glass-card p-4 border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dichotomies</p>
                     <p className="text-lg font-bold text-slate-800">{type.code}</p>
                  </div>
               </div>

               <div className="glass-card p-6 border-slate-100 bg-white/30">
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Brain size={14} /> Cognitive Functions
                  </p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                     {type.functions}
                  </p>
               </div>
            </motion.div>
         </section>

         {/* Strengths & Weaknesses */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24 px-2 sm:px-0">
            <div className="glass-card p-6 sm:p-8 border-emerald-100/50 bg-emerald-50/10">
               <SectionTitle icon={Award} title="Core Strengths" color="bg-emerald-50 text-emerald-600" />
               <ul className="space-y-3 sm:space-y-4">
                  {type.strengths.map((str, idx) => (
                     <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm"
                     >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                           <Zap size={10} fill="currentColor" />
                        </div>
                        <span className="text-slate-600 font-bold text-sm sm:text-base">{str}</span>
                     </motion.li>
                  ))}
               </ul>
            </div>

            <div className="glass-card p-6 sm:p-8 border-rose-100/50 bg-rose-50/10">
               <SectionTitle icon={AlertCircle} title="Common Challenges" color="bg-rose-50 text-rose-600" />
               <ul className="space-y-3 sm:space-y-4">
                  {type.weaknesses.map((weak, idx) => (
                     <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm"
                     >
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                           <AlertCircle size={10} fill="currentColor" />
                        </div>
                        <span className="text-slate-600 font-bold text-sm sm:text-base">{weak}</span>
                     </motion.li>
                  ))}
               </ul>
            </div>
         </section>

         {/* Relationships & Careers */}
         <section className="space-y-24 mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <SectionTitle icon={Heart} title="Relationships & Compatibility" color="bg-rose-50 text-rose-600" />
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                     {type.relationships}
                  </p>
                  <div className="bg-white/40 glass-card p-6 border-slate-100">
                     <p className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-indigo-600" /> Interaction Advice
                     </p>
                     <ul className="space-y-3">
                        {type.tips.map((tip, i) => (
                           <li key={i} className="text-sm text-slate-600 font-medium flex gap-2">
                              <span className="text-indigo-400 mt-1">•</span>
                              {tip}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
               <div className="glass-card p-1 items-center justify-center bg-slate-900 shadow-2xl shadow-indigo-500/10 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-12 text-center text-white space-y-4">
                     <Quote className="text-indigo-400 mx-auto opacity-50 mb-4" size={48} />
                     <p className="text-2xl font-display font-medium leading-relaxed">
                        Understanding yourself is the beginning of all wisdom.
                     </p>
                     <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Aristotle (Architect Spirit)</p>
                  </div>
               </div>
            </div>

            <div className="space-y-12">
               <SectionTitle icon={Briefcase} title="Ideal Career Paths" color="bg-amber-50 text-amber-600" />
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {type.careers.map((career, idx) => (
                     <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="glass-card p-6 text-center border-slate-100 hover:border-indigo-200 transition-all hover:bg-white/60"
                     >
                        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:text-indigo-500 transition-colors">
                           <Target size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{career}</p>
                     </motion.div>
                  ))}
               </div>
               <div className="glass-card p-8 border-indigo-100 bg-indigo-50/20">
                  <p className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                     <TrendingUp className="text-indigo-600" /> Work Style Insight
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed">
                     {type.workStyle}
                  </p>
               </div>
            </div>
         </section>

         {/* Personal Growth */}
         <section className="max-w-4xl mx-auto px-4 mb-24">
            <div className="text-center space-y-8">
               <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-sm">
                  <TrendingUp size={32} />
               </div>
               <h2 className="text-4xl font-display font-bold text-slate-900">Path to Evolution</h2>
               <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  {type.growth}
               </p>
            </div>
         </section>

         {/* Call to Action */}
         <section className="text-center space-y-6 sm:space-y-8 pt-12 border-t border-slate-100 px-4">
            <div className="space-y-3 sm:space-y-4">
               <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Is this you?</h3>
               <p className="text-sm sm:text-base text-slate-500 font-medium">Verify your results with our advanced neural matrix assessment.</p>
            </div>
            <div className="flex justify-center">
               <button
                  onClick={handleCTAClick}
                  className="w-full sm:w-auto btn-primary py-4 sm:py-5 px-10 sm:px-12 text-base sm:text-lg shadow-xl shadow-indigo-600/20"
               >
                  Start Your Assessment
               </button>
            </div>
         </section>
      </div>
   );
}
