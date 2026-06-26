import React from 'react';
import { useAppState } from '../store';
import { Moon, Sun, Lock, LayoutDashboard, Linkedin, Twitter, Youtube, Github } from 'lucide-react';
import { Button } from './Button';

export function Frame({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, setAuthModalOpen, navigate, currentPath } = useAppState();

  const isDashboard = currentPath === '/dashboard';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Playbooks', path: '/playbooks' },
    { label: 'Updates', path: '/updates' },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas font-sans text-text-primary overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-canvas-white/80 backdrop-blur-md border-b border-border-light w-full">
        <div className="w-full px-8 lg:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-footer-bg text-white flex items-center justify-center font-bold text-xl">
              <span className="text-brand-primary">e</span>g
            </div>
            <span className="font-display font-bold text-xl tracking-tight">echo glitch</span>
          </div>

          {/* Navigation — hidden inside dashboard */}
          {!isDashboard && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`relative py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">


            {currentUser ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Lock className="w-4 h-4" />}
                onClick={() => setAuthModalOpen(true)}
              >
                Member Access
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-footer-bg text-white pt-16 pb-10 w-full">
        <div className="w-full px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-lg">
                  <span className="text-brand-primary">e</span>g
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-white">echo glitch</span>
              </div>
              <p className="text-white/50 mb-8 max-w-sm leading-relaxed text-sm">
                The premium AI ecosystem for ambitious professionals and teams. Built for execution, designed for mastery.
              </p>
              <div className="flex items-center gap-3">
                {[Linkedin, Twitter, Youtube, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/15 hover:text-white transition-all duration-200">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest text-white/40">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Playbooks</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-widest text-white/40">Playbooks</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Task-Specific</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Industry-Specific</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">Free Resources</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors">All Playbooks</a></li>
              </ul>
            </div>


          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© 2026 Echo Glitch. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


