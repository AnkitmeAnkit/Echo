import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { ProblemSubmission, Problem } from '../types';
import { 
  Home, BookOpen, Zap, Heart, Bell, Search, Filter, 
  Wand2, ArrowRight, Send, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { PLAYBOOKS, PREDEFINED_PROBLEMS } from '../data';

const statusConfig: Record<ProblemSubmission['status'], { label: string; icon: React.ReactNode; color: string }> = {
  pending:   { label: 'Pending',   icon: <Clock className="w-3 h-3" />,        color: 'bg-amber-100 text-amber-700' },
  in_review: { label: 'In Review', icon: <AlertCircle className="w-3 h-3" />,  color: 'bg-blue-100 text-blue-700'  },
  resolved:  { label: 'Resolved',  icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-emerald-100 text-emerald-700' },
};

export function Dashboard() {
  const { currentUser, navigate, setAuthModalOpen, purchasedSlugs, problemSubmissions, wishlist, toggleWishlist } = useAppState();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'solutions' | 'wishlist'>('dashboard');

  const sidebarLinks = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />,     label: 'Dashboard',   action: () => setActiveTab('dashboard') },
    { id: 'library',   icon: <BookOpen className="w-5 h-5" />, label: 'My Library',  action: () => setActiveTab('library') },
    { id: 'solutions', icon: <Zap className="w-5 h-5" />,      label: 'My Solutions',action: () => setActiveTab('solutions') },
    { id: 'wishlist',  icon: <Heart className="w-5 h-5" />,    label: 'Wishlist',    action: () => setActiveTab('wishlist') },
    { id: 'updates',   icon: <Bell className="w-5 h-5" />,     label: 'Updates',     action: () => navigate('/updates') },
  ];

  return (
    <div className="w-full bg-canvas min-h-screen flex border-t border-border-light">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-border-light bg-canvas-white hidden md:flex flex-col min-h-[calc(100vh-80px)]">
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {sidebarLinks.map((link, i) => (
              <button
                key={i}
                onClick={link.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === link.id 
                    ? 'bg-brand-lavender text-brand-primary' 
                    : 'text-text-secondary hover:bg-canvas hover:text-text-primary'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Promo Card */}
        <div className="p-4">
          <div className="bg-canvas rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-brand-lavender text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm mb-2">Discover Playbooks and Solutions</h4>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Explore expertly crafted playbooks and powerful solutions to accelerate your work with AI.
            </p>
            <div className="space-y-2">
              <Button fullWidth size="sm" onClick={() => navigate('/playbooks')}>
                Browse Playbooks <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" fullWidth size="sm" onClick={() => navigate('/solutions')}>
                Browse Solutions <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="bg-gradient-lavender rounded-[2rem] p-10 flex items-center justify-between relative overflow-hidden mb-12 shadow-lavender animate-fade-in-up">
              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-widest text-brand-primary uppercase mb-2">Member Access</div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  Welcome back, {currentUser?.name || 'Member'} 👋
                </h1>
                <p className="text-text-secondary text-sm">
                  {currentUser?.email} • Member since {currentUser?.joinedAt ? new Date(currentUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2026'}
                </p>
              </div>
              <div className="hidden md:flex relative z-10 w-32 h-32 items-center justify-center">
                  {/* 3D Books Placeholder */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl rotate-6 shadow-xl"></div>
                    <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl -rotate-3 border border-white"></div>
                    <BookOpen className="w-16 h-16 text-brand-primary relative z-20" />
                  </div>
              </div>
            </div>
          )}

          {/* My Library Section */}
          {activeTab === 'library' && (
            <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-bold">My Library</h2>
                <Badge variant="lavender">{purchasedSlugs.length} playbooks</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                  <input 
                    type="text" 
                    placeholder="Search playbooks..." 
                    className="pl-9 pr-4 py-2 rounded-lg border border-border-light bg-canvas-white text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
                <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
              </div>
            </div>

            {purchasedSlugs.length === 0 ? (
              <Card className="flex items-center justify-center min-h-[400px] border-dashed border-2 border-border-light bg-canvas-white/50">
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 bg-brand-lavender rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <BookOpen className="w-10 h-10 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No playbooks yet</h3>
                  <p className="text-text-secondary text-sm mb-8">
                    Acquire a playbook from the catalogue and it will appear here instantly.
                  </p>
                  <Button icon={<BookOpen className="w-4 h-4" />} onClick={() => navigate('/playbooks')}>
                    Browse Playbooks
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PLAYBOOKS.filter((p: any) => purchasedSlugs.includes(p.slug)).map((playbook: any, i: number) => (
                  <Card key={i} className="flex flex-col relative overflow-hidden group border border-border-light shadow-sm">
                    <div className="aspect-[4/3] w-full bg-canvas relative mb-4">
                      <img 
                        src={playbook.coverImage} 
                        alt={playbook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="text-xl font-bold mb-2">{playbook.title}</h4>
                      <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-2">{playbook.summary}</p>
                      
                      <button
                        onClick={() => window.open('https://drive.google.com/file/d/dummy-link/view', '_blank')}
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 py-2.5 rounded-md font-semibold text-sm transition-colors mt-auto cursor-pointer flex items-center justify-center gap-2"
                      >
                        Download Playbook
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          )}

          {/* ── My Solutions Section ────────────────────────────── */}
          {activeTab === 'solutions' && (
            <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-bold">My Solutions</h2>
                <Badge variant="lavender">{problemSubmissions.length} submitted</Badge>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Send className="w-4 h-4" />}
                onClick={() => navigate('/solutions/submit')}
              >
                Submit a Problem
              </Button>
            </div>

            {problemSubmissions.length === 0 ? (
              <Card className="flex items-center justify-center min-h-[280px] border-dashed border-2 border-border-light bg-canvas-white/50">
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 bg-brand-lavender rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Zap className="w-10 h-10 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No submissions yet</h3>
                  <p className="text-text-secondary text-sm mb-8">
                    Submit your technical problem and our team will design a custom solution for you.
                  </p>
                  <Button icon={<Send className="w-4 h-4" />} onClick={() => navigate('/solutions/submit')}>
                    Submit a Problem — ₹9
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...problemSubmissions].reverse().map((sub, i) => {
                  const cfg = statusConfig[sub.status];
                  return (
                    <div
                      key={sub.id}
                      className="bg-canvas-white border border-border-light rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 bg-brand-lavender rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-brand-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-semibold text-sm leading-snug mb-1 line-clamp-2">
                          {sub.problem.length > 100 ? sub.problem.slice(0, 100) + '…' : sub.problem}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-text-tertiary">
                          <span>{sub.name}</span>
                          {sub.phone && <><span>·</span><span>{sub.phone}</span></>}
                          <span>·</span>
                          <span>{new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>·</span>
                          <span className="font-mono">{sub.paymentRef}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )}

          {/* ── Wishlist Section ────────────────────────────── */}
          {activeTab === 'wishlist' && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-display font-bold">Wishlist</h2>
                <Badge variant="lavender">{wishlist.length} saved</Badge>
              </div>

              {wishlist.length === 0 ? (
                <Card className="flex items-center justify-center min-h-[300px] border-dashed border-2 border-border-light bg-canvas-white/50">
                  <div className="text-center max-w-sm px-6">
                    <div className="w-20 h-20 bg-brand-lavender rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Heart className="w-10 h-10 text-brand-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Your wishlist is empty</h3>
                    <p className="text-text-secondary text-sm">
                      Click the heart icon on playbooks or problems to save them for later.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item, i) => {
                    const [type, id] = item.split(':');
                    
                    if (type === 'playbook') {
                      const playbook = PLAYBOOKS.find(p => p.slug === id);
                      if (!playbook) return null;
                      return (
                        <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer relative overflow-hidden" onClick={() => navigate(`/playbooks/${playbook.slug}`)}>
                          <div className="mb-4">
                            <Badge variant={i % 2 === 0 ? "lavender" : "mint"}>Playbook</Badge>
                          </div>
                          <h4 className="text-xl font-bold mb-3">{playbook.title}</h4>
                          <p className="text-text-secondary text-sm mb-8 flex-1">{playbook.summary}</p>
                          
                          <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border-light">
                            <div className="flex items-center gap-4">
                              <span className="font-medium px-2 py-1 bg-canvas rounded-md capitalize">{playbook.track}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                                className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center transition-colors text-red-500 hover:bg-red-50"
                              >
                                <Heart className="w-4 h-4" fill="currentColor" />
                              </button>
                              <div className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand-lavender group-hover:text-brand-primary transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    
                    if (type === 'problem') {
                      const prob = PREDEFINED_PROBLEMS.find(p => p.title === id);
                      if (!prob) return null;
                      return (
                        <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer" onClick={() => navigate('/consulting')}>
                          <div className="mb-4"><Badge variant={prob.tagColor}>{prob.category}</Badge></div>
                          <h4 className="text-xl font-bold mb-3">{prob.title}</h4>
                          <p className="text-text-secondary text-sm mb-8 flex-1">{prob.desc}</p>
                          <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border-light">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prob.time}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                                className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center transition-colors text-red-500 hover:bg-red-50"
                              >
                                <Heart className="w-4 h-4" fill="currentColor" />
                              </button>
                              <div className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand-lavender group-hover:text-brand-primary transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
