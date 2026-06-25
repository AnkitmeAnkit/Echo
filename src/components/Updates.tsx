import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Badge } from './Badge';
import { FileText, Rocket, Lightbulb, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import { BlogUpdate } from '../types';

export function Updates() {
  const { blogUpdates } = useAppState();
  const [selectedUpdate, setSelectedUpdate] = useState<BlogUpdate | null>(null);

  const radarEvents = [
    {
      status: "LIVE",
      date: "OCT 15, 2026",
      time: "02:00 PM",
      desc: "The new Data Automation Playbook has passed final QA and is now available in the main directory.",
      action: "View Playbook",
      color: "bg-emerald-500"
    },
    {
      status: "INCOMING",
      date: "OCT 12, 2026",
      time: "09:30 AM",
      desc: "System latency optimizations are rolling out to European nodes. Expect minor dashboard jitter during the transition.",
      color: "bg-amber-500"
    },
    {
      status: "SYSTEM",
      date: "OCT 10, 2026",
      time: "04:45 PM",
      desc: "Core identity servers updated. All active execution tokens have been forcibly refreshed.",
      color: "bg-brand-primary"
    },
    {
      status: "ARCHIVE",
      date: "OCT 05, 2026",
      time: "11:15 AM",
      desc: "Legacy analytics pipeline V1 has been formally deprecated and spun down.",
      color: "bg-zinc-500"
    }
  ];

  const getIconForCategory = (category: string) => {
    switch (category.toUpperCase()) {
      case 'RELEASE NOTES': return <Rocket className="w-8 h-8" />;
      case 'BEST PRACTICES': return <Lightbulb className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  if (selectedUpdate) {
    return (
      <div className="w-full bg-black min-h-screen pb-32">
        <div className="max-w-[1200px] mx-auto px-6 pt-12 animate-fade-in-up">
          <button 
            onClick={() => setSelectedUpdate(null)} 
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Updates
          </button>

          <div className="flex items-center gap-3 text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-4">
            <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: selectedUpdate.tagColor || '#4F46E5' }}></span>
            {selectedUpdate.category}
            <span>•</span>
            {new Date(selectedUpdate.publishedAt || new Date()).toLocaleDateString()}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight">
            {selectedUpdate.title}
          </h1>

          {selectedUpdate.coverImage && (
            <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-12 border border-zinc-800">
              <img src={selectedUpdate.coverImage} alt={selectedUpdate.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none text-zinc-300">
            <p className="text-xl text-zinc-400 font-medium mb-8 leading-relaxed">
              {selectedUpdate.excerpt}
            </p>
            {/* Render full content (handling basic newlines as paragraphs for display) */}
            {selectedUpdate.fullContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        {/* Hero Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden mb-12 animate-fade-in-up">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
              Updates & Insights
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Stay informed with the latest field notes, system updates, and upcoming playbook releases.
            </p>
          </div>
          
          <div className="relative z-10 w-full max-w-sm aspect-[2/1] md:aspect-auto flex items-center justify-center">
            {/* 3D Books Placeholder */}
            <div className="relative">
               <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-xl rounded-2xl rotate-6 border border-brand-primary/20"></div>
               <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl -rotate-3 border border-brand-primary/20"></div>
               <BookOpen className="w-24 h-24 text-brand-primary relative z-20" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Left Column: Field Notes */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Field Notes & Research</h2>
              <Badge variant="lavender">{blogUpdates.length} updates</Badge>
            </div>

            <div className="space-y-6">
              {blogUpdates.length > 0 ? blogUpdates.map((note, i) => (
                <Card key={i} className="flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:border-brand-primary/30 transition-colors !bg-zinc-900 !border-zinc-800" onClick={() => setSelectedUpdate(note)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: note.tagColor || '#4F46E5' }}></span>
                      {note.category}
                      <span>•</span>
                      {new Date(note.publishedAt || new Date()).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl text-white font-bold mb-3 group-hover:text-brand-primary transition-colors">{note.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      {note.excerpt}
                    </p>
                    <button className="text-brand-primary font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                      Read Report <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {/* Icon Block */}
                  <div className="hidden md:flex w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 text-brand-primary items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:border-brand-primary/50 transition-transform">
                    {getIconForCategory(note.category)}
                  </div>
                </Card>
              )) : (
                <div className="text-zinc-500 py-8">No updates available at the moment.</div>
              )}
              
              <button className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                View all field notes & research <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: The Radar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-display font-bold mb-6 text-white">The Radar</h2>
            
            <Card className="relative !bg-zinc-900 !border-zinc-800">
              <div className="absolute top-8 bottom-8 left-[23px] w-0.5 bg-zinc-800"></div>
              
              <div className="space-y-8 relative z-10">
                {radarEvents.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 flex justify-center pt-1.5">
                      <div className={`w-3 h-3 rounded-full ${event.color} shadow-sm ring-4 ring-zinc-900`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-zinc-500 tracking-wider">{event.date} • {event.time}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          event.status === 'LIVE' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                          event.status === 'INCOMING' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                          event.status === 'SYSTEM' ? 'text-brand-primary border-brand-primary/30 bg-brand-primary/10' :
                          'text-zinc-400 border-zinc-400/30 bg-zinc-400/10'
                        }`}>
                          {event.status === 'SYSTEM' ? '[SYSTEM]' : event.status === 'ARCHIVE' ? '[ARCHIVE]' : event.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                        {event.desc}
                      </p>
                      {event.action && (
                        <button className="text-brand-primary font-semibold flex items-center text-sm hover:gap-1 transition-all">
                          {event.action} <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <button className="w-full py-2 text-zinc-400 font-bold text-sm hover:text-white transition-colors flex items-center justify-center gap-2">
                  View all radar updates <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
