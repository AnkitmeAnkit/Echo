import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Consultation } from '../types';
import { 
  Home, BookOpen, Zap, Heart, Bell, Search, Filter, 
  Wand2, ArrowRight, Send, Clock, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { getPlaybookDownloadLink } from '../supabaseClient';
import { PREDEFINED_PROBLEMS } from '../data';

const statusConfig: Record<Consultation['status'], { label: string; icon: React.ReactNode; color: string }> = {
  pending:   { label: 'Pending',   icon: <Clock className="w-3 h-3" />,        color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
  in_review: { label: 'In Review', icon: <AlertCircle className="w-3 h-3" />,  color: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'  },
  resolved:  { label: 'Resolved',  icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' },
};

export function Dashboard() {
  const { currentUser, navigate, playbooks, purchasedSlugs, userConsultations, wishlistItems, toggleWishlist } = useAppState();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'solutions' | 'wishlist'>('dashboard');
  const [fetchingSlug, setFetchingSlug] = useState<string | null>(null);

  const handleOpenPlaybook = async (slug: string) => {
    setFetchingSlug(slug);
    const link = await getPlaybookDownloadLink(slug);
    setFetchingSlug(null);
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('Could not load file. Try from your Dashboard.');
    }
  };

  const sidebarLinks = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />,     label: 'Dashboard',   action: () => setActiveTab('dashboard') },
    { id: 'library',   icon: <BookOpen className="w-5 h-5" />, label: 'My Library',  action: () => setActiveTab('library') },
    { id: 'solutions', icon: <Zap className="w-5 h-5" />,      label: 'My Solutions',action: () => setActiveTab('solutions') },
    { id: 'wishlist',  icon: <Heart className="w-5 h-5" />,    label: 'Wishlist',    action: () => setActiveTab('wishlist') },
    { id: 'updates',   icon: <Bell className="w-5 h-5" />,     label: 'Updates',     action: () => navigate('/updates') },
  ];

  return (
    <div className="w-full bg-canvas dark:bg-black min-h-screen flex border-t border-border-light dark:border-zinc-800">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-border-light dark:border-zinc-800 bg-canvas dark:bg-zinc-950 hidden md:flex flex-col min-h-[calc(100vh-80px)]">
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {sidebarLinks.map((link, i) => (
              <button
                key={i}
                onClick={link.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  activeTab === link.id 
                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                    : 'text-text-secondary dark:text-zinc-400 hover:bg-canvas-white dark:bg-zinc-900 hover:text-text-primary dark:text-white'
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
          <div className="bg-canvas-white dark:bg-zinc-900 border border-border-light dark:border-zinc-800 rounded-2xl p-6 text-center shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-primary/5"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Wand2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm mb-2 text-text-primary dark:text-white">Discover Playbooks and Solutions</h4>
              <p className="text-xs text-text-secondary dark:text-zinc-400 mb-4 leading-relaxed">
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
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="bg-canvas-white dark:bg-zinc-900 border border-border-light dark:border-zinc-800 rounded-[2rem] p-10 flex items-center justify-between relative overflow-hidden mb-12 animate-fade-in-up">
              <div className="absolute right-0 top-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-widest text-brand-primary uppercase mb-2">Member Access</div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-text-primary dark:text-white">
                  Welcome back, {currentUser?.name || 'Member'} 👋
                </h1>
                <p className="text-text-secondary dark:text-zinc-400 text-sm">
                  {currentUser?.email} • Member since {new Date(currentUser?.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="hidden md:flex relative z-10 w-32 h-32 items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-xl rounded-2xl rotate-6 border border-brand-primary/20"></div>
                    <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl -rotate-3 border border-brand-primary/20"></div>
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
                <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">My Library</h2>
                <Badge variant="lavender">{purchasedSlugs.length} playbooks</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary dark:text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search playbooks..." 
                    className="pl-9 pr-4 py-2 rounded-lg border border-border-light dark:border-zinc-800 bg-canvas dark:bg-zinc-950 text-text-primary dark:text-white placeholder-zinc-500 text-sm w-full md:w-64 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                  Filter
                </Button>
              </div>
            </div>

            {purchasedSlugs.length === 0 ? (
              <Card className="flex items-center justify-center min-h-[400px] border-dashed border-2 !border-border-light dark:!border-zinc-800 !bg-canvas-white/50 dark:!bg-canvas-white dark:!bg-zinc-900/50">
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-brand-primary">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary dark:text-white">No playbooks yet</h3>
                  <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8">
                    Acquire a playbook from the catalogue and it will appear here instantly.
                  </p>
                  <Button icon={<BookOpen className="w-4 h-4" />} onClick={() => navigate('/playbooks/all')}>
                    Browse Playbooks
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playbooks.filter(p => purchasedSlugs.includes(p.slug)).map((playbook, i) => (
                  <Card key={i} className="flex flex-col relative overflow-hidden group !border-border-light dark:!border-zinc-800 !bg-canvas-white dark:!bg-zinc-900 shadow-sm">
                    <div className="aspect-[4/3] w-full bg-canvas dark:bg-zinc-950 border-b border-border-light dark:border-zinc-800 relative mb-4">
                      {playbook.coverImage && (
                        <img 
                          src={playbook.coverImage} 
                          alt={playbook.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-2">
                      <h4 className="text-xl font-bold mb-2 text-text-primary dark:text-white">{playbook.title}</h4>
                      <p className="text-text-secondary dark:text-zinc-400 text-sm mb-6 flex-1 line-clamp-2">{playbook.summary}</p>
                      
                      <button
                        onClick={() => handleOpenPlaybook(playbook.slug)}
                        disabled={fetchingSlug === playbook.slug}
                        className="w-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 text-brand-primary hover:border-brand-primary/50 py-2.5 rounded-md font-semibold text-sm transition-colors mt-auto cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {fetchingSlug === playbook.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {fetchingSlug === playbook.slug ? 'Loading...' : 'Open Playbook ↗'}
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
                <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">My Solutions</h2>
                <Badge variant="lavender">{userConsultations.length} submitted</Badge>
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

            {userConsultations.length === 0 ? (
              <Card className="flex items-center justify-center min-h-[280px] border-dashed border-2 !border-border-light dark:!border-zinc-800 !bg-canvas-white/50 dark:!bg-canvas-white dark:!bg-zinc-900/50">
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-brand-primary">
                    <Zap className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary dark:text-white">No submissions yet</h3>
                  <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8">
                    Submit your technical problem and our team will design a custom solution for you.
                  </p>
                  <Button icon={<Send className="w-4 h-4" />} onClick={() => navigate('/solutions/submit')}>
                    Submit a Problem — ₹9
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...userConsultations].reverse().map((sub) => {
                  const cfg = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig['pending'];
                  return (
                    <div
                      key={sub.id}
                      className="bg-canvas-white dark:bg-zinc-900 border border-border-light dark:border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-brand-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-text-primary dark:text-white font-bold text-sm mb-1">{sub.problem_title}</h4>
                        <p className="text-text-secondary dark:text-zinc-400 text-sm leading-snug mb-2 line-clamp-2">
                          {sub.details.length > 100 ? sub.details.slice(0, 100) + '…' : sub.details}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-text-tertiary dark:text-zinc-500">
                          <span>{sub.full_name}</span>
                          {sub.phone && <><span>·</span><span>{sub.phone}</span></>}
                          <span>·</span>
                          <span>{new Date(sub.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>·</span>
                          <span className="font-mono text-brand-primary">{sub.payment_ref}</span>
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
                <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Wishlist</h2>
                <Badge variant="lavender">{wishlistItems.length} saved</Badge>
              </div>

              {wishlistItems.length === 0 ? (
                <Card className="flex items-center justify-center min-h-[300px] border-dashed border-2 !border-border-light dark:!border-zinc-800 !bg-canvas-white/50 dark:!bg-canvas-white dark:!bg-zinc-900/50">
                  <div className="text-center max-w-sm px-6">
                    <div className="w-20 h-20 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-brand-primary">
                      <Heart className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-text-primary dark:text-white">Your wishlist is empty</h3>
                    <p className="text-text-secondary dark:text-zinc-400 text-sm">
                      Click the heart icon on playbooks or problems to save them for later.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => {
                    if (item.item_type === 'playbook') {
                      const playbook = playbooks.find(p => p.slug === item.item_id);
                      if (!playbook) return null;
                      return (
                        <Card key={item.id} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer relative overflow-hidden !bg-canvas-white dark:!bg-zinc-900 !border-border-light dark:!border-zinc-800" onClick={() => navigate(`/playbooks/${playbook.slug}`)}>
                          <div className="mb-4">
                            <Badge variant="lavender">Playbook</Badge>
                          </div>
                          <h4 className="text-xl font-bold mb-3 text-text-primary dark:text-white">{playbook.title}</h4>
                          <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8 flex-1">{playbook.summary}</p>
                          
                          <div className="flex items-center justify-between text-xs text-text-tertiary dark:text-zinc-500 pt-4 border-t border-border-light dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                              <span className="font-medium px-2 py-1 bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-md capitalize">{playbook.track}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist('playbook', item.item_id); }}
                                className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center transition-colors text-red-500 hover:bg-red-500/20"
                              >
                                <Heart className="w-4 h-4" fill="currentColor" />
                              </button>
                              <div className="w-8 h-8 rounded-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 flex items-center justify-center text-text-tertiary dark:text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    
                    if (item.item_type === 'problem') {
                      const prob = PREDEFINED_PROBLEMS.find(p => p.title === item.item_id);
                      if (!prob) return null;
                      return (
                        <Card key={item.id} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer !bg-canvas-white dark:!bg-zinc-900 !border-border-light dark:!border-zinc-800" onClick={() => navigate('/solutions')}>
                          <div className="mb-4"><Badge variant={prob.tagColor as any}>{prob.category}</Badge></div>
                          <h4 className="text-xl font-bold mb-3 text-text-primary dark:text-white">{prob.title}</h4>
                          <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8 flex-1">{prob.desc}</p>
                          <div className="flex items-center justify-between text-xs text-text-tertiary dark:text-zinc-500 pt-4 border-t border-border-light dark:border-zinc-800">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prob.time}</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist('problem', item.item_id); }}
                                className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center transition-colors text-red-500 hover:bg-red-500/20"
                              >
                                <Heart className="w-4 h-4" fill="currentColor" />
                              </button>
                              <div className="w-8 h-8 rounded-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 flex items-center justify-center text-text-tertiary dark:text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
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
