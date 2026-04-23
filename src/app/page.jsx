"use client";

import { useRouter } from 'next/navigation';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, Users, Target, Rocket,
  ArrowRight, Sparkles, ShieldCheck, Zap
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-6 sm:p-8 border-white/40 hover:border-indigo-200/50 transition-all group hover:shadow-2xl hover:shadow-indigo-500/5"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 border border-indigo-100/50 shadow-sm group-hover:scale-110 transition-transform">
      <Icon size={20} className="sm:w-6 sm:h-6" />
    </div>
    <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default function Home({ user, onOpenLoginModal }) {
  const router = useRouter();

  const handleCTAClick = () => {
    if (user) {
      router.push('/test-intro');
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32 pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 flex flex-col items-center text-center">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-amber-200/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm mb-10"
          >
            <Sparkles size={16} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">The Future of Self-Discovery</span>
          </motion.div>

          <h1 className="heading-hero mb-6 sm:mb-8">
            Decode Your <br className="hidden sm:block" />
            <span className="brand-shimmer">Neural DNA</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
            Experience the most advanced personality matrix assessment. Uncover deep cognitive insights across 16 unique archetypes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCTAClick}
              className="btn-primary py-5 px-12 text-lg shadow-2xl shadow-indigo-600/30 group"
            >
              <div className="flex items-center gap-3">
                <span>{user ? 'Continue Test' : 'Take Test'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              onClick={() => router.push('/about')}
              className="px-8 py-5 text-slate-600 font-bold hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              Learn the Science
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats/Proof */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-32">
          {[
            { label: "Archetypes", value: "16" },
            { label: "Accuracy", value: "98%" },
            { label: "Insights", value: "40+" }
          ].map((stat, i) => (
            <div key={i} className="text-center group min-w-[100px] sm:min-w-[120px]">
              <p className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BrainCircuit}
            title="Scientific Foundation"
            description="Built upon the rigorous framework of Carl Jung and the Myers-Briggs system, refined for the modern world."
            delay={0.1}
          />
          <FeatureCard
            icon={Target}
            title="Career Mapping"
            description="Discover roles that align with your cognitive strengths, work style, and natural problem-solving abilities."
            delay={0.2}
          />
          <FeatureCard
            icon={Users}
            title="Relationship Intelligence"
            description="Understand how you connect with others and navigate dynamics with deep compatibility insights."
            delay={0.3}
          />
        </div>
      </section>

      {/* Temperaments Preview */}
      <section className="max-w-6xl mx-auto px-4 overflow-hidden">
        <div className="glass-card bg-slate-900 text-white border-white/5 p-8 sm:p-12 md:p-20 relative">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                The Four <span className="text-indigo-400">Essential</span> Temperaments
              </h2>
              <div className="space-y-6">
                {[
                  { name: "Analysts", desc: "Rational, strategic, and innovative.", color: "text-indigo-400" },
                  { name: "Diplomats", desc: "Empathetic, idealistic, and creative.", color: "text-emerald-400" },
                  { name: "Sentinels", desc: "Practical, reliable, and grounded.", color: "text-blue-400" },
                  { name: "Explorers", desc: "Spontaneous, energetic, and bold.", color: "text-amber-400" }
                ].map((t, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-1 h-12 bg-white/10 rounded-full overflow-hidden shrink-0`}>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={`w-full bg-current ${t.color}`}
                      />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold ${t.color}`}>{t.name}</h4>
                      <p className="text-slate-400 text-sm font-medium">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/types')}
                className="flex items-center gap-2 text-white font-bold hover:text-indigo-400 transition-colors pt-4 group"
              >
                <span>View All 16 Profiles</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="w-80 h-80 rounded-[64px] bg-gradient-to-br from-indigo-500 to-amber-600 rotate-12 absolute animate-pulse opacity-20" />
              <div className="w-80 h-80 rounded-[64px] border-2 border-white/10 flex items-center justify-center relative bg-slate-900/50 backdrop-blur-3xl shadow-2xl">
                <BrainCircuit size={120} className="text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-48 h-48 border-t-2 border-white/20 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center px-4 pb-16 sm:pb-24">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6 sm:mb-8 leading-tight">Begin Your Neural Evolution</h2>
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleCTAClick}
              className="btn-primary py-4 sm:py-5 px-10 sm:px-16 text-lg sm:text-xl shadow-2xl shadow-indigo-600/30"
            >
              Start Assessment
            </button>
          </motion.div>
        </div>
        <p className="text-slate-400 mt-6 font-medium">Detailed report in 10 minutes.</p>
      </section>
    </div>
  );
}
