import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Updates: React.FC = () => {
  return (
    <div className="py-24 px-6 md:px-10 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-6xl text-ink tracking-tight font-semibold mb-6">
          Updates & Insights
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          The latest field notes, system architectures, and upcoming playbook releases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto mt-12">
        {/* Left Column: Field Notes & Research */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink mb-2">Field Notes & Research</h2>
          
          {/* Card 1 */}
          <div className="bg-surface-card rounded-2xl p-8 border border-hairline hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full group">
            <div className="flex items-center space-x-3 text-xs font-mono text-muted mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Architecture // 12 MIN READ</span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight">Scaling Neural Pathways in the Enterprise</h3>
            <p className="text-base text-muted mb-8 leading-relaxed">
              An inside look at our updated routing infrastructure for dynamic playbook distribution across high-latency nodes. We discuss the new fallback mechanisms and the 40% reduction in sync overhead.
            </p>
            <button className="text-sm font-bold text-ink hover:text-muted flex items-center uppercase tracking-widest transition-colors cursor-pointer w-fit">
              Read Report
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-card rounded-2xl p-8 border border-hairline hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full group">
            <div className="flex items-center space-x-3 text-xs font-mono text-muted mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              <span>Release Notes // 8 MIN READ</span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight">EchoGlitch Playbook v2.4 Now Live</h3>
            <p className="text-base text-muted mb-8 leading-relaxed">
              We've overhauled the core execution logic in our flagship playbook. Explore the new telemetry features, optimization protocols, and how to migrate your existing configurations.
            </p>
            <button className="text-sm font-bold text-ink hover:text-muted flex items-center uppercase tracking-widest transition-colors cursor-pointer w-fit">
              Read Report
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-card rounded-2xl p-8 border border-hairline hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col h-full group">
            <div className="flex items-center space-x-3 text-xs font-mono text-muted mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>Field Notes // 5 MIN READ</span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4 tracking-tight">Optimizing Team Operations</h3>
            <p className="text-base text-muted mb-8 leading-relaxed">
              How leading teams use our framework to cut synchronization overhead by 40% using the newly integrated comms protocol. A case study featuring real-world deployments.
            </p>
            <button className="text-sm font-bold text-ink hover:text-muted flex items-center uppercase tracking-widest transition-colors cursor-pointer w-fit">
              Read Report
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: The Radar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <h2 className="text-xl font-bold tracking-tight text-ink mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            The Radar
          </h2>

          <div className="border-l border-hairline ml-3 space-y-8 py-2">
            
            {/* Timeline Item 1 */}
            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-canvas border-2 border-success rounded-full -left-[5px] top-1"></div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Oct 15 // 14:00</span>
                <span className="font-mono text-[9px] font-bold bg-success/10 text-success px-2 py-0.5 rounded uppercase tracking-wider">[LIVE]</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                The new Data Automation Playbook has passed final QA and is now available in the main directory.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-canvas border-2 border-warning rounded-full -left-[5px] top-1"></div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Oct 12 // 09:30</span>
                <span className="font-mono text-[9px] font-bold bg-warning/10 text-warning px-2 py-0.5 rounded uppercase tracking-wider">[INCOMING]</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                System latency optimizations are rolling out to European nodes. Expect minor dashboard jitter during the transition.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-canvas border-2 border-cyan-500 rounded-full -left-[5px] top-1"></div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Oct 10 // 16:45</span>
                <span className="font-mono text-[9px] font-bold bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded uppercase tracking-wider">[SYSTEM]</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                Core identity servers updated. All active execution tokens have been forcibly refreshed.
              </p>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-canvas border-2 border-slate-300 rounded-full -left-[5px] top-1"></div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Oct 05 // 11:15</span>
                <span className="font-mono text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">[ARCHIVE]</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                Legacy analytics pipeline V1 has been formally deprecated and spun down.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
