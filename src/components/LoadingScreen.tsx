import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas-white text-text-primary font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center space-y-8"
      >
        <div className="relative flex items-center justify-center">
          {/* Subtle glow behind logo */}
          <div className="absolute w-32 h-32 bg-brand-lavender rounded-full blur-[40px] opacity-50 animate-pulse" />
          
          <div className="relative z-10 w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-4xl shadow-lavender">
            <span className="animate-pulse">e</span>g
          </div>

          {/* Spinner ring around the logo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-dashed border-brand-primary opacity-30"
          />
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
            <h2 className="font-display text-lg font-bold tracking-wide text-text-primary">
              Loading
            </h2>
          </div>
          <p className="text-xs text-text-tertiary">
            Preparing your experience...
          </p>
        </div>
      </motion.div>
    </div>
  );
};
