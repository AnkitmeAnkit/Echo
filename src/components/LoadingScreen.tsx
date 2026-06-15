import React from 'react';
import EchoRobotLogo from './EchoRobotLogo';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-canvas text-ink font-sans">
      
      {/* Decorative Grid Background for a subtle technical feel matching the main design */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center space-y-8"
      >
        <div className="relative flex items-center justify-center">
          {/* Subtle glow behind logo */}
          <div className="absolute w-32 h-32 bg-surface-strong rounded-full blur-[40px] opacity-50 animate-pulse" />
          
          <div className="relative z-10">
            <EchoRobotLogo size={80} />
          </div>

          {/* Spinner ring around the logo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-dashed border-muted-soft opacity-30"
          />
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-4 h-4 text-ink animate-spin" />
            <h2 className="font-display text-lg font-semibold tracking-widest uppercase text-ink">
              Processing
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            Synchronizing state
          </p>
        </div>
      </motion.div>

      {/* Decorative Corner Elements */}
      <div className="absolute bottom-8 left-8 flex items-center space-x-2 font-mono text-[10px] text-muted uppercase tracking-widest opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
        <span>Network Active</span>
      </div>
    </div>
  );
};

