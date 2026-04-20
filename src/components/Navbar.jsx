import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BrainCircuit, LogOut, Info, Users, LogIn, Menu, X, Home, Zap } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenLoginModal }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: Home, protected: false },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, protected: true },
    { to: "/about", label: "About", icon: Info, protected: false },
    { to: "/types", label: "Types", icon: Users, protected: false },
    { to: "/pricing", label: "Upgrade", icon: Zap, protected: true },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card px-6 py-3 flex items-center justify-between border-white/40 shadow-xl shadow-indigo-500/5"
      >
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center group">
            <img
              src="/Open16 Logo_1.png"
              alt="Open16 Logo"
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-200"
            />
          </NavLink>

          <div className="hidden lg:flex items-center gap-1">
            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              <div className="flex items-center gap-2">
                <Info size={18} />
                <span>About</span>
              </div>
            </NavLink>
            <NavLink
              to="/types"
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Types</span>
              </div>
            </NavLink>
            {user && (
              <NavLink
                to="/pricing"
                className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
              >
                <div className="flex items-center gap-2 text-amber-500 font-bold group/upgrade">
                  <Zap size={18} className="group-hover/upgrade:fill-amber-500 transition-all" />
                  <span>Upgrade</span>
                </div>
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/50 rounded-2xl border border-white/60">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  {user.initials || user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-none">{user.name.toUpperCase()}</span>
                  {/* <span className="text-[10px] text-slate-500 font-medium">Student</span> */}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="hidden sm:block p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="btn-primary py-2 sm:py-2.5 px-4 sm:px-6 flex items-center gap-2 text-xs sm:text-sm"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 mx-auto w-full glass-card overflow-hidden border-white/40 shadow-2xl"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
              {user && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
