import React from 'react';
import BrainLoader from './BrainLoader';

const PageLoader = ({ 
  title = "Loading...", 
  subtitle = "Please wait while we prepare your experience.",
  size = 240
}) => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
      <BrainLoader size={size} />
      <div className="text-center space-y-2">
        <p className="text-indigo-600 font-display font-black text-2xl tracking-tight">
          {title}
        </p>
        <p className="text-slate-400 font-medium text-sm animate-pulse">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
