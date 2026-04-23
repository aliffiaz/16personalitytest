"use client";

import Link from 'next/link';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogIn, Mail, Lock, User as UserIcon, ChevronRight, AlertTriangle } from 'lucide-react';
import { auth, provider } from '@/firebase';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { API_BASE_URL } from '@/config';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset state when closing / toggling
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      // We no longer block new users, we'll let it register them via googleLogin endpoint
      const user = result.user;
      const response = await fetch(`${API_BASE_URL}/student/googleLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user.email, fullName: user.displayName || 'User', profilePicture: user.photoURL }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (onLoginSuccess) onLoginSuccess(data);
        onClose();
      } else {
        setError(data.message || 'Google authentication failed.');
      }
    } catch (err) {
      console.error("Google login failed:", err);
      setError('Connection with Google was interrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/student/StudentLogin' : '/student/signup';
      const payload = isLogin ? { email, password } : { email, password, FullName: fullName };

      console.log(`Attempting auth: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (onLoginSuccess) onLoginSuccess(data);
        onClose();
      } else {
        setError(data.message || (isLogin ? 'Invalid credentials. Please try again.' : 'Signup failed. Try again.'));
      }
    } catch (err) {
      console.error("Auth request failed:", err);
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative glass-card w-full max-w-md p-8 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60"
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 z-10"
            >
              <X size={20} />
            </button>

            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20 text-white mb-4">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {isLogin ? 'Sign in to access your assessment report' : 'Sign up to take your personalized assessment'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-start gap-2"
                >
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <UserIcon size={16} />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                      placeholder="name@personal.ity"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 shadow-lg shadow-indigo-600/10 group overflow-hidden relative active:scale-[0.98] transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-bold">
                    {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Sign Up')}
                    {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>

              <div className="text-center mt-2">
                <p className="text-[12px] text-slate-500 font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="text-indigo-600 cursor-pointer hover:underline font-bold"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>

              {/* <div className="flex items-center my-4">
                <div className="flex-grow bg-slate-100 h-px"></div>
                <span className="px-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">OR</span>
                <div className="flex-grow bg-slate-100 h-px"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 hover:border-indigo-100 transition-all shadow-sm group active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:scale-110 transition-transform">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-sm">Continue with Google</span>
              </button> */}

              <div className="text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  By continuing, you agree to our <Link href="/terms-conditions" onClick={onClose} className="text-indigo-600 cursor-pointer hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" onClick={onClose} className="text-indigo-600 cursor-pointer hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
