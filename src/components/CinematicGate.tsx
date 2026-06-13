import React, { useEffect, useState } from 'react';
import { useAppState } from '../store';
import EchoRobotLogo from './EchoRobotLogo';
import { ArrowRight, Cpu, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white overflow-hidden">
      
      {/* Ambient Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] mix-blend-overlay opacity-50"></div>

      {/* --- REPLICATED LOADER CSS & BACKGROUND --- */}
      <style>{`
        .speed-loader {
          position: absolute;
          top: 50%;
          margin-left: -50px;
          left: 50%;
          animation: speeder 0.4s linear infinite;
          z-index: 10;
        }

        .speed-loader > span {
          height: 5px;
          width: 35px;
          background: #000;
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
        }

        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid #000;
          border-bottom: 6px solid transparent;
        }

        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #000;
          position: absolute;
          right: -110px;
          top: -16px;
        }

        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid #000;
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }

        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: #000;
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
        }

        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: #000;
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }

        .speed-loader > span > span:nth-child(1),
        .speed-loader > span > span:nth-child(2),
        .speed-loader > span > span:nth-child(3),
        .speed-loader > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: #000;
          position: absolute;
          animation: fazer1 0.2s linear infinite;
        }

        .speed-loader > span > span:nth-child(2) {
          top: 3px;
          animation: fazer2 0.4s linear infinite;
        }

        .speed-loader > span > span:nth-child(3) {
          top: 1px;
          animation: fazer3 0.4s linear infinite;
          animation-delay: -1s;
        }

        .speed-loader > span > span:nth-child(4) {
          top: 4px;
          animation: fazer4 1s linear infinite;
          animation-delay: -1s;
        }

        @keyframes fazer1 {
          0% { left: 0; }
          100% { left: -80px; opacity: 0; }
        }
        @keyframes fazer2 {
          0% { left: 0; }
          100% { left: -100px; opacity: 0; }
        }
        @keyframes fazer3 {
          0% { left: 0; }
          100% { left: -50px; opacity: 0; }
        }
        @keyframes fazer4 {
          0% { left: 0; }
          100% { left: -150px; opacity: 0; }
        }

        @keyframes speeder {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .longfazers span {
          position: absolute;
          height: 2px;
          width: 20%;
          background: #000;
          opacity: 0.1;
        }

        .longfazers span:nth-child(1) {
          top: 20%;
          animation: lf 0.6s linear infinite;
          animation-delay: -5s;
        }

        .longfazers span:nth-child(2) {
          top: 40%;
          animation: lf2 0.8s linear infinite;
          animation-delay: -1s;
        }

        .longfazers span:nth-child(3) {
          top: 60%;
          animation: lf3 0.6s linear infinite;
        }

        .longfazers span:nth-child(4) {
          top: 80%;
          animation: lf4 0.5s linear infinite;
          animation-delay: -3s;
        }

        @keyframes lf { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf2 { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf3 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }
        @keyframes lf4 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }

        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }

        @keyframes subtleGlitch {
          0% { text-shadow: none; }
          2% { text-shadow: 2px 0 cyan, -2px 0 red; }
          4% { text-shadow: -2px 0 cyan, 2px 0 red; }
          6% { text-shadow: none; }
          100% { text-shadow: none; }
        }
        .glitch-text-subtle {
          animation: subtleGlitch 4s infinite;
        }

        .glitch-text-heavy {
          position: relative;
          color: black;
          display: inline-block;
        }
        .glitch-text-heavy::before,
        .glitch-text-heavy::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #FDFDFD;
          overflow: hidden;
        }
        .glitch-text-heavy::before {
          left: 2px;
          text-shadow: -1px 0 red;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-text-heavy::after {
          left: -2px;
          text-shadow: -1px 0 cyan;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); }
          20% { clip-path: inset(60% 0 10% 0); }
          40% { clip-path: inset(40% 0 50% 0); }
          60% { clip-path: inset(80% 0 5% 0); }
          80% { clip-path: inset(10% 0 70% 0); }
          100% { clip-path: inset(30% 0 40% 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); }
          20% { clip-path: inset(30% 0 20% 0); }
          40% { clip-path: inset(70% 0 10% 0); }
          60% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(50% 0 30% 0); }
          100% { clip-path: inset(5% 0 80% 0); }
        }

        @keyframes containerGlitch {
          0%, 95% { translate: 0 0; opacity: 1; }
          96% { translate: 2px 0; opacity: 0.9; filter: contrast(120%) brightness(110%); }
          97% { translate: -2px 0; opacity: 0.9; }
          98% { translate: 2px 0; opacity: 0.9; filter: contrast(120%) brightness(110%); }
          99% { translate: -2px 0; opacity: 0.9; }
          100% { translate: 0 0; opacity: 1; }
        }
        .container-glitch {
          animation: containerGlitch 8s infinite;
        }

        @keyframes dialogueGlitch {
          0%, 92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
          100% { opacity: 1; }
        }
        .dialogue-glitch {
          animation: dialogueGlitch 6s infinite;
        }
      `}</style>

      {/* Background Texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none z-0"></div>

      {/* Long Fazers Background */}
      <AnimatePresence>
        {stage !== 'completed' && (
          <motion.div
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="longfazers z-0"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col items-start space-y-2 opacity-40 z-20 pointer-events-none font-mono">
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-black font-bold">SYSTEMS NOMINAL</span>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
          X-RAY DELTA 4.0 // VECTOR PROTOCOL
        </div>
      </div>

      <div className="absolute top-6 md:top-12 right-6 md:right-12 text-right opacity-40 z-20 pointer-events-none">
        <Cpu className="w-6 h-6 text-black mb-2 ml-auto" />
        <div className="text-[10px] font-mono text-black font-bold uppercase tracking-widest">
          LATENCY: 14ms
        </div>
      </div>

      {/* Branding */}
      <div className="absolute top-6 md:top-12 left-6 md:left-12 z-20">
        <div className="flex items-center space-x-2 group">
          <span className="font-mono text-xl font-bold tracking-tighter uppercase glitch-text-heavy" data-text="ECHO GLITCH">ECHO GLITCH</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative w-full z-10">
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative w-full max-w-2xl h-[200px] flex items-center justify-center">
                <div className="speed-loader">
                  <span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  <div className="base">
                    <span></span>
                    <div className="face"></div>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <h1 className="font-sans text-4xl md:text-5xl font-black tracking-tighter text-black uppercase animate-pulse">
                  Processing Request
                </h1>
                <p className="font-mono text-gray-400 font-medium tracking-[0.2em] uppercase text-xs">
                  Synchronizing with global neural networks
                </p>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto mt-8 overflow-hidden relative">
                  <div
                    className="h-full bg-black transition-all duration-100 ease-out"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 40, rotateX: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              className="container-glitch flex flex-col items-center justify-center text-center p-10 md:p-16 relative w-full max-w-2xl bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] z-10"
            >

              <motion.div
                initial={{ opacity: 0, scale: 0.8, translateZ: -50 }}
                animate={{ opacity: 1, scale: 1, translateZ: 50 }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
                className="mb-8 relative"
              >
                {/* Minimal circle glow behind logo for slight 3D pop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-100 blur-[30px] rounded-full z-0" />

                <div className="relative">
                  <EchoRobotLogo size={140} className="relative z-10" />

                  {/* Floating Terminal Box */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="dialogue-glitch absolute top-4 -right-56 w-48 p-3 bg-black/5 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-sm z-20 text-left"
                  >
                    <div className="font-mono text-xs text-slate-700 flex flex-col space-y-1">
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{`> System Online.`}</motion.span>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>{`> I am Echo.`}</motion.span>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>{`> Welcome to the Echo Glitch.`}</motion.span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase glitch-text-subtle"
              >
                Welcome
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full text-center text-slate-500 mt-2"
              >
                Your execution platform is ready and standing by.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={handleCompleteIntro}
                className="group relative inline-flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 mt-10 w-full md:w-auto text-sm font-bold uppercase tracking-widest cursor-pointer transition-all duration-75 hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-[2px_0_0_0_#0ff,-2px_0_0_0_#f00] overflow-hidden"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
