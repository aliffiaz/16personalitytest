import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  LogIn,
  Sparkles,
  ShieldCheck,
  Globe,
  ArrowLeft,
  BrainCircuit,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser) {
        await result.user.delete();
        setError("Account not found. Please register via our official mobile app first.");
        setLoading(false);
        return;
      }

      const user = result.user;
      const response = await fetch(`${API_BASE_URL}/student/googleLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, fullName: user.displayName || 'User' }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (onLoginSuccess) onLoginSuccess(data);
        navigate('/dashboard');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/student/StudentLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (onLoginSuccess) onLoginSuccess(data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50/50 flex flex-col items-center justify-center p-6">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all group"
        >
          <div className="w-10 h-10 glass-card flex items-center justify-center border-white/60 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors shadow-sm">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:block">Back Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full max-w-[480px] z-10 px-4"
      >
        <div className="glass-card p-8 sm:p-12 border-white/60 shadow-2xl shadow-indigo-500/10 relative overflow-hidden bg-white/40 backdrop-blur-2xl">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-amber-600 rounded-[22px] shadow-lg shadow-indigo-600/30 text-white mb-6"
            >
              <BrainCircuit size={32} />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl">
              Take <span className="brand-shimmer uppercase">Test</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] ml-1">Open16 Neural Matrix</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                className="bg-rose-50/80 backdrop-blur-md border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold mb-8 flex items-start gap-3 shadow-sm"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 text-slate-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="name@personal.ity"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 text-slate-900 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 text-lg shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? 'Logging In...' : 'Log In'}
                {!loading && <ChevronRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </form>

          <div className="flex items-center my-10">
            <div className="flex-grow bg-slate-200/50 h-px"></div>
            <span className="px-5 text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">OR</span>
            <div className="flex-grow bg-slate-200/50 h-px"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white/60 border border-white/80 text-slate-700 font-bold py-4 rounded-2xl hover:bg-white hover:border-indigo-100 transition-all shadow-sm group active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="tracking-tight">Connect with Google</span>
          </button>

          {/* <div className="mt-12 text-center pointer-events-none">
            <div className="flex justify-center items-center gap-3 text-slate-300 text-[9px] font-black uppercase tracking-[0.3em]">
              <Globe size={12} />
              <span>Encrypted Matrix Protocol v4.2</span>
            </div>
          </div> */}
        </div>

        {/* Helper Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          {/* <p className="text-slate-400 text-xs font-bold">
            Don't have an ID? <button className="text-indigo-600 hover:underline">Sync via Mobile App</button>
          </p> */}
        </motion.div>
      </motion.div>
    </div>
  );
}

const AlertTriangle = ({ ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);
