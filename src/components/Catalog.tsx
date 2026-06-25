import React from 'react';
import { useAppState } from '../store';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { 
  Lock, Search, FileText, ListOrdered, Gift, RefreshCw, 
  ClipboardList, Briefcase, BookOpen, GraduationCap, 
  Target, Gift as GiftIcon, ArrowRight, Clock, Heart
} from 'lucide-react';

export function Catalog() {
  const { navigate, setAuthModalOpen, routeParams, currentUser, isWishlisted, toggleWishlist, playbooks } = useAppState();
  const [activeFilter, setActiveFilter] = React.useState<string>(routeParams.category || 'all');

  React.useEffect(() => {
    setActiveFilter(routeParams.category || 'all');
  }, [routeParams.category]);

  const metadataTags = [
    { icon: <FileText className="w-4 h-4" />, label: "Well-Researched" },
    { icon: <ListOrdered className="w-4 h-4" />, label: "Step-by-Step" },
    { icon: <Gift className="w-4 h-4" />, label: "Free Resources" },
    { icon: <RefreshCw className="w-4 h-4" />, label: "Always Updated" },
  ];

  const whatYouGet = [
    { icon: <BookOpen />, title: "Well-Researched Guides", desc: "Actionable instructions backed by best practices and real-world use." },
    { icon: <GraduationCap />, title: "Free Learning Resources", desc: "Curated free materials to help you build AI skills." },
    { icon: <Target />, title: "Task & Industry Focused", desc: "Find playbooks tailored to your role and industry." },
    { icon: <GiftIcon />, title: "Always Improving", desc: "New playbooks and resources added regularly." },
    { icon: <Search />, title: "Research with AI", desc: "Use AI to research any topic and get structured, reliable insights.", badge: "New" },
  ];

  const filteredPlaybooks = playbooks.filter((playbook, i) => {
    if (activeFilter === 'all') return true;
    // Just mock industry vs task for UI display if track doesn't explicitly mention it
    const isTask = i % 2 === 0;
    const isIndustry = i % 2 !== 0;
    if (activeFilter === 'task') return isTask;
    if (activeFilter === 'industry') return isIndustry;
    return true;
  });

  return (
    <div className="w-full bg-black min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 animate-fade-in-up">
          <div className="lg:col-span-4 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Playbooks</h1>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Well-researched guides, step-by-step instructions, and free learning resources to help you enable AI in your work the right way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button icon={currentUser ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />} onClick={() => currentUser ? navigate('/dashboard') : setAuthModalOpen(true)}>
                {currentUser ? 'Go to Dashboard' : 'Sign In to Access'}
              </Button>
              <Button variant="outline" icon={<Search className="w-4 h-4" />}>
                Research with AI
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
            <div className="relative z-10 flex-1">
              <h2 className="text-2xl font-bold mb-4 text-white">Enable AI in your work the right way</h2>
              <p className="text-zinc-400 mb-8">Access well-researched guides, practical instructions, and free resources to get the most out of AI.</p>
              <div className="flex flex-wrap gap-3">
                {metadataTags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-300 font-medium">
                    <span className="text-brand-primary">{tag.icon}</span> {tag.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 w-48 h-48 flex-shrink-0 flex items-center justify-center">
                {/* 3D Books Placeholder */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-xl rounded-2xl rotate-6 border border-brand-primary/20"></div>
                  <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl -rotate-3 border border-brand-primary/20"></div>
                  <BookOpen className="w-20 h-20 text-brand-primary relative z-20" />
                </div>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Card padding="xl" className="flex items-center gap-8 relative overflow-hidden group hover:shadow-card cursor-pointer !bg-zinc-900 !border-zinc-800">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl opacity-40 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="w-24 h-24 rounded-[2rem] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0 shadow-inner relative z-10">
              <ClipboardList className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-white">Task-Specific Playbooks</h3>
              <p className="text-zinc-400 mb-6">Step-by-step guides for specific tasks to help you work smarter and faster with AI.</p>
              <button onClick={() => navigate('/playbooks/all?category=task')} className="text-brand-primary font-semibold flex items-center group-hover:gap-2 transition-all">
                Explore Task Playbooks <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </Card>

          <Card padding="xl" className="flex items-center gap-8 relative overflow-hidden group hover:shadow-card cursor-pointer !bg-zinc-900 !border-zinc-800">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl opacity-40 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
            <div className="w-24 h-24 rounded-[2rem] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0 shadow-inner relative z-10">
              <Briefcase className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-white">Industry-Specific Playbooks</h3>
              <p className="text-zinc-400 mb-6">Domain-focused playbooks tailored for your industry's unique challenges.</p>
              <button onClick={() => navigate('/playbooks/all?category=industry')} className="text-brand-primary font-semibold flex items-center group-hover:gap-2 transition-all">
                Explore Industry Playbooks <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </Card>
        </div>

        {/* What You'll Get */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-display font-bold mb-8 text-white">What You'll Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {whatYouGet.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl text-brand-primary flex items-center justify-center mb-4 relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-primary/30">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm mb-2 text-white">{item.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Playbooks Preview */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">
              {activeFilter === 'task' ? 'Task-Specific Playbooks' : activeFilter === 'industry' ? 'Industry-Specific Playbooks' : 'All Playbooks'}
            </h2>
            {activeFilter !== 'all' && (
              <button onClick={() => navigate('/playbooks/all')} className="text-brand-primary font-semibold flex items-center hover:gap-1 transition-all text-sm">
                View all playbooks <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlaybooks.map((playbook, i) => (
              <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer relative overflow-hidden !bg-zinc-900 !border-zinc-800" onClick={() => navigate(`/playbooks/${playbook.slug}`)}>
                <div className="mb-4">
                  <Badge variant={i % 2 === 0 ? "lavender" : "mint"}>
                    {i % 2 === 0 ? "Task-Specific" : "Industry-Specific"}
                  </Badge>
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">{playbook.title}</h4>
                <p className="text-zinc-400 text-sm mb-8 flex-1">{playbook.summary}</p>
                
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-4">
                    <span className="font-medium px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-md capitalize">{playbook.track}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {playbook.chapters?.reduce((sum: any, ch: any) => sum + ch.estimatedMinutes, 0) || 0} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        if (!currentUser) setAuthModalOpen(true);
                        else await toggleWishlist('playbook', playbook.slug); 
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isWishlisted('playbook', playbook.slug)
                          ? 'text-red-500 bg-red-500/10' 
                          : 'text-zinc-500 hover:bg-brand-primary/10 hover:text-brand-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted('playbook', playbook.slug) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Lock Banner */}
        <Card variant="elevated" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-6 !bg-zinc-900 !border-zinc-800 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
               {currentUser ? <ArrowRight className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
             </div>
             <p className="text-zinc-400 font-medium">
               {currentUser 
                 ? 'Access your saved playbooks and track your progress from your dashboard.' 
                 : 'Sign in to unlock all playbooks, save your favorites, and track your progress.'}
             </p>
          </div>
          <Button icon={currentUser ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />} className="flex-shrink-0" onClick={() => currentUser ? navigate('/dashboard') : setAuthModalOpen(true)}>
            {currentUser ? 'Go to Dashboard' : 'Sign In to Access'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
