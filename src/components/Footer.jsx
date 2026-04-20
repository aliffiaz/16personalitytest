import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 text-slate-500 font-medium z-10 relative">
      <div className="flex items-center gap-3">
        <img 
          src="/open_16.png" 
          alt="Open16 Logo" 
          className="w-8 h-8 rounded-lg shadow-sm"
        />
        <span className="text-sm font-bold">© {new Date().getFullYear()} Open16. All rights reserved.</span>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <Link to="/privacy-policy" className="flex items-center gap-1.5 hover:text-indigo-600 font-bold transition-colors">
          <ShieldCheck size={16} />
          <span>Privacy Policy</span>
        </Link>
        <Link to="/terms-conditions" className="flex items-center gap-1.5 hover:text-indigo-600 font-bold transition-colors">
          <FileText size={16} />
          <span>Terms & Conditions</span>
        </Link>
      </div>
    </footer>
  );
}
