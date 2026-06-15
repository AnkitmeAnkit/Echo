import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// Predefined set of random logs that can run on the terminal screen
const LOG_MESSAGES = [
  'VISION: Cutting through the AI hype...',
  'DIY: Loading AI Playbook blueprints...',
  'DIY: Initializing Data Analyst workflows...',
  'DIY: Running Lawyer review accelerator...',
  'DIY: Optimizing Accountant audit nodes...',
  'DIY: Automating Marketer campaign paths...',
  'TOOL: Claude AI - generating code pipelines...',
  'TOOL: NotebookLM - synthesizing research...',
  'TOOL: Google AI Studio - processing inputs...',
  'SUB_INT: Formulating weekly market analysis...',
  'DWY: Initializing Phase 2 consulting stack...',
  'DWY: Resolving user technical bottlenecks...',
  'DWY: Tailoring playbooks for custom execution...',
  'SYSTEM: Noise filter active (tutorial noise: 0%)',
  'SYSTEM: Bloated agency retainers eliminated',
  'SYSTEM: Pure execution mode active'
];

export const TerminalScreen: React.FC = () => {
  const [metrics, setMetrics] = useState({
    hypeFilter: 99.8,
    noiseRatio: 0.05,
  });

  const [logs, setLogs] = useState<string[]>([
    'VISION: Echo Glitch OS v2.4 initialized',
    'DIY: Loading AI Playbook blueprints...',
    'SYSTEM: Pure execution engine - ACTIVE'
  ]);

  // SVG wave state
  const [waveOffset, setWaveOffset] = useState(0);

  // Periodically update metrics
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics((prev) => ({
        hypeFilter: parseFloat((Math.min(100, Math.max(99.4, prev.hypeFilter + (Math.random() * 0.12 - 0.06)))).toFixed(2)),
        noiseRatio: parseFloat((Math.min(0.2, Math.max(0.0, prev.noiseRatio + (Math.random() * 0.04 - 0.02)))).toFixed(2)),
      }));
    }, 1500);

    return () => clearInterval(metricsInterval);
  }, []);

  // Periodically append new random logs
  useEffect(() => {
    const logsInterval = setInterval(() => {
      const randomMsg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const timestamp = new Date().toLocaleTimeString().split(' ')[0];
      setLogs((prev) => {
        const updated = [...prev, `[${timestamp}] ${randomMsg}`];
        if (updated.length > 8) {
          return updated.slice(updated.length - 8);
        }
        return updated;
      });
    }, 2000);

    return () => clearInterval(logsInterval);
  }, []);

  // Animate the oscilloscope wave
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setWaveOffset((prev) => (prev + 0.1) % (Math.PI * 2));
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Generate SVG path for the wave based on waveOffset
  const generateWavePath = () => {
    const points = [];
    const width = 300;
    const height = 40;
    const midY = height / 2;

    for (let x = 0; x <= width; x += 5) {
      // Create a nice waveform overlaying 2 sine waves
      const y1 = Math.sin(x * 0.05 + waveOffset) * 10;
      const y2 = Math.sin(x * 0.12 - waveOffset * 1.5) * 4;
      const y = midY + y1 + y2;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      className="w-full max-w-[700px] aspect-[16/10] rounded-xl relative border border-brand-accent/20 shadow-xl overflow-hidden transition-all duration-300 font-mono text-xs text-ink/80 flex flex-col justify-between"
      style={{
        background: 'rgba(59, 130, 246, 0.02)', // Subtle primary accent tint, perfectly transparent
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Glow effect inside borders */}
      <div className="absolute inset-0 border border-brand-accent/10 pointer-events-none rounded-xl" />

      {/* Futuristic Grid Dots Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Dynamic Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--color-brand-accent) 2px, var(--color-brand-accent) 4px)',
        }}
      />

      {/* Top Status Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-brand-accent/10 bg-brand-accent/[0.03]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="font-semibold tracking-wider text-brand-accent uppercase text-[10px]">
            ECHO.GLITCH.OS
          </span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-[9px] text-muted">
          <span>SECURE</span>
          <span className="px-1.5 py-0.5 rounded bg-brand-accent/10 text-brand-accent">
            PORT:3000
          </span>
        </div>
      </div>

      {/* Metrics Center HUD */}
      <div className="relative z-20 px-4 pt-4 grid grid-cols-2 gap-3">
        {[
          { label: 'HYPE FILTER', value: `${metrics.hypeFilter}%`, color: 'text-success' },
          { label: 'NOISE RATIO', value: `${metrics.noiseRatio}%`, color: 'text-brand-accent' },
          { label: 'DIY BLUEPRINTS', value: '3 TRACKS', color: 'text-brand-accent font-semibold' },
          { label: 'DWY MODULE', value: '1-ON-1 ONLINE', color: 'text-success font-semibold' },
        ].map((item, idx) => (
          <div key={idx} className="border border-brand-accent/10 rounded p-2.5 bg-brand-accent/[0.01]">
            <div className="text-[9px] text-muted tracking-wider uppercase font-semibold mb-0.5">
              {item.label}
            </div>
            <div className={`text-sm font-bold tracking-tight ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Oscilloscope Visualizer */}
      <div className="relative z-20 px-4 py-2 flex flex-col justify-center border-t border-b border-brand-accent/5 my-2">
        <div className="text-[9px] text-muted tracking-wider uppercase font-semibold mb-1">
          SIGNAL MONITOR
        </div>
        <div className="w-full h-10 border border-brand-accent/10 rounded bg-brand-accent/[0.01] overflow-hidden flex items-center justify-center relative">
          <svg className="w-full h-full" viewBox="0 0 300 40">
            <path
              d={generateWavePath()}
              fill="none"
              stroke="var(--color-brand-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
          {/* Subtle center line */}
          <div className="absolute left-0 right-0 top-1/2 border-t border-brand-accent/5 pointer-events-none" />
        </div>
      </div>

      {/* Terminal Output Console */}
      <div className="relative z-20 px-4 pb-4 flex-grow flex flex-col justify-end">
        <div className="text-[9px] text-muted tracking-wider uppercase font-semibold mb-1.5">
          LIVE LOGGER
        </div>
        <div className="border border-brand-accent/10 rounded p-3 bg-brand-accent/[0.01] min-h-[140px] flex flex-col justify-end">
          <div className="space-y-1.5">
            {logs.map((log, index) => {
              const isHighlight = log.includes('VISION:') || log.includes('ACTIVE') || log.includes('DIY:') || log.includes('DWY:') || log.includes('SYSTEM:');
              return (
                <div 
                  key={index} 
                  className={`font-mono text-[10px] leading-tight break-all ${
                    isHighlight ? 'text-brand-accent font-semibold' : 'text-body/75'
                  }`}
                >
                  <span className="text-muted mr-1">&gt;</span>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Corner Bracket Decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-accent/40 rounded-tl pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-accent/40 rounded-tr pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-accent/40 rounded-bl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-accent/40 rounded-br pointer-events-none" />
    </motion.div>
  );
};

export default TerminalScreen;
