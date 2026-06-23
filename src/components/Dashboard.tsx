import React from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  Home, BookOpen, Zap, Heart, Bell, Search, Filter, 
  Wand2, ArrowRight
} from 'lucide-react';

export function Dashboard() {
  const { currentUser, navigate } = useAppState();

  const sidebarLinks = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", active: true },
    { icon: <BookOpen className="w-5 h-5" />, label: "My Library", active: false },
    { icon: <Zap className="w-5 h-5" />, label: "Solutions", active: false },
    { icon: <Heart className="w-5 h-5" />, label: "Wishlist", active: false },
    { icon: <Bell className="w-5 h-5" />, label: "Updates", active: false },
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  link.active 
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
          
          {/* Welcome Banner */}
          <div className="bg-gradient-lavender rounded-[2rem] p-10 flex items-center justify-between relative overflow-hidden mb-12 shadow-lavender animate-fade-in-up">
            <div className="relative z-10">
              <div className="text-[10px] font-bold tracking-widest text-brand-primary uppercase mb-2">Member Access</div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Welcome back, {currentUser?.user_metadata?.full_name || 'Ankit Upadhyay'} 👋
              </h1>
              <p className="text-text-secondary text-sm">
                {currentUser?.email || 'upadhyay.ankit1979@gmail.com'} • Member since June 2026
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

          {/* My Library Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-bold">My Library</h2>
                <Badge variant="lavender">0 playbooks</Badge>
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

            {/* Empty State Card */}
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
          </div>
          
        </div>
      </main>
    </div>
  );
}
