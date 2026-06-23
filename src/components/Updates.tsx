import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { FileText, Rocket, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';

export function Updates() {
  const fieldNotes = [
    {
      category: "ARCHITECTURE",
      readTime: "12 MIN READ",
      date: "OCT 15, 2026",
      title: "Scaling Neural Pathways in the Enterprise",
      desc: "An inside look at our updated routing infrastructure for dynamic playbook distribution across high-latency nodes. We discuss the new fallback mechanisms and the 40% reduction in sync overhead.",
      icon: <FileText className="w-8 h-8" />
    },
    {
      category: "RELEASE NOTES",
      readTime: "8 MIN READ",
      date: "OCT 12, 2026",
      title: "EchoGlitch Playbook v2.4 Now Live",
      desc: "We've overhauled the core execution logic in our flagship playbook. Explore the new telemetry features, optimization protocols, and how to migrate your existing configurations.",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      category: "BEST PRACTICES",
      readTime: "10 MIN READ",
      date: "OCT 10, 2026",
      title: "Advanced Prompt Patterns for Enterprise AI",
      desc: "A collection of field-tested prompt patterns that improved accuracy by 35% across legal, engineering, and strategy workflows.",
      icon: <Lightbulb className="w-8 h-8" />
    }
  ];

  const radarEvents = [
    {
      status: "LIVE",
      date: "OCT 15, 2026",
      time: "02:00 PM",
      desc: "The new Data Automation Playbook has passed final QA and is now available in the main directory.",
      action: "View Playbook",
      color: "bg-success"
    },
    {
      status: "INCOMING",
      date: "OCT 12, 2026",
      time: "09:30 AM",
      desc: "System latency optimizations are rolling out to European nodes. Expect minor dashboard jitter during the transition.",
      color: "bg-warning"
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
      color: "bg-text-tertiary"
    }
  ];

  return (
    <div className="w-full bg-canvas min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        {/* Hero Banner */}
        <div className="bg-gradient-lavender rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden mb-12 shadow-lavender animate-fade-in-up">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-text-primary">
              Updates & Insights
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Stay informed with the latest field notes, system updates, and upcoming playbook releases.
            </p>
          </div>
          
          <div className="relative z-10 w-full max-w-sm aspect-[2/1] md:aspect-auto flex items-center justify-center">
            {/* 3D Books Placeholder */}
            <div className="relative">
               <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl rotate-6 shadow-xl"></div>
               <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl -rotate-3 border border-white"></div>
               <BookOpen className="w-24 h-24 text-brand-primary relative z-20" />
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Left Column: Field Notes */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold">Field Notes & Research</h2>
              <Badge variant="lavender">3 new</Badge>
            </div>

            <div className="space-y-6">
              {fieldNotes.map((note, i) => (
                <Card key={i} className="flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:border-brand-primary/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-text-tertiary tracking-wider mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                      {note.category}
                      <span>â€¢</span>
                      {note.readTime}
                      <span>â€¢</span>
                      {note.date}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{note.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {note.desc}
                    </p>
                    <button className="text-brand-primary font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                      Read Report <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {/* Icon Block */}
                  <div className="hidden md:flex w-24 h-24 rounded-2xl bg-gradient-lavender text-brand-primary items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    {note.icon}
                  </div>
                </Card>
              ))}
              
              <button className="w-full py-4 rounded-xl border border-border-light text-brand-primary font-bold text-sm hover:bg-brand-lavender/50 transition-colors flex items-center justify-center gap-2">
                View all field notes & research <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: The Radar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-display font-bold mb-6">The Radar</h2>
            
            <Card className="relative">
              <div className="absolute top-8 bottom-8 left-[23px] w-0.5 bg-border-light"></div>
              
              <div className="space-y-8 relative z-10">
                {radarEvents.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 flex justify-center pt-1.5">
                      <div className={`w-3 h-3 rounded-full ${event.color} shadow-sm ring-4 ring-white`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-text-tertiary tracking-wider">{event.date} â€¢ {event.time}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          event.status === 'LIVE' ? 'text-success border-success/30 bg-success/5' :
                          event.status === 'INCOMING' ? 'text-warning border-warning/30 bg-warning/5' :
                          event.status === 'SYSTEM' ? 'text-brand-primary border-brand-primary/30 bg-brand-primary/5' :
                          'text-text-tertiary border-text-tertiary/30 bg-text-tertiary/5'
                        }`}>
                          {event.status === 'SYSTEM' ? '[SYSTEM]' : event.status === 'ARCHIVE' ? '[ARCHIVE]' : event.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">
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

              <div className="mt-8 pt-6 border-t border-border-light">
                <button className="w-full py-2 text-brand-primary font-bold text-sm hover:text-brand-primary-hover transition-colors flex items-center justify-center gap-2">
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


