import React, { useEffect, useState } from 'react';
import { useAppState } from '../store';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CinematicGate: React.FC = () => {
  const { setIntroSeen } = useAppState();
  
  const [stage, setStage] = useState<'loading' | 'ready' | 'completed'>('loading');
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'loading') return;
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('ready');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [stage]);

  const handleCompleteIntro = () => {
    setStage('completed');
    setTimeout(() => {
      setIntroSeen(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-canvas text-ink font-sans selection:bg-surface-strong selection:text-ink">
      
      <header className="w-full px-6 py-6 md:px-12 flex justify-between items-center border-b border-hairline-soft bg-canvas">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm font-semibold text-ink tracking-tight">
            System Online
          </span>
        </div>
        <div className="text-sm text-muted font-medium hidden sm:block">
          Enterprise Access
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-xs text-center space-y-4"
            >
              <Loader2 className="w-8 h-8 text-muted animate-spin mx-auto" />
              <div className="h-1.5 w-full bg-surface-soft rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100 ease-out rounded-full"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted font-medium">Initializing workspace...</p>
            </motion.div>
          )}

          {stage === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 max-w-sm"
            >
              <div className="space-y-2">
                <h1 className="font-display text-4xl md:text-5xl text-ink tracking-tight font-semibold">
                  Welcome
                </h1>
                <p className="text-body text-base">
                  Your platform is ready.
                </p>
              </div>
              
              <button
                onClick={handleCompleteIntro}
                className="group inline-flex items-center space-x-2 bg-primary hover:bg-primary-active text-on-primary px-6 py-3 rounded-md text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full px-6 py-6 md:px-12 flex justify-between items-center border-t border-hairline-soft text-xs text-muted font-medium bg-canvas">
        <span>© 2026 Echo Inc.</span>
        <span className="hidden sm:inline">Secure Connection</span>
      </footer>
    </div>
  );
};
