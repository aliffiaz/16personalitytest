import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingBar({ isLoading }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ 
              width: ['0%', '30%', '70%', '90%'],
              transition: { 
                duration: 10, 
                ease: "easeOut",
                times: [0, 0.1, 0.5, 1] 
              } 
            }}
            exit={{ 
              width: '100%', 
              opacity: 0,
              transition: { duration: 0.3, ease: 'easeIn' } 
            }}
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
