import React, { useState } from 'react';
import { useAppState } from '../store';
import { AuthModal } from './AuthModal';
import { EcoBot } from './EcoBot';
import EchoRobotLogo from './EchoRobotLogo';
import { Menu, X, LayoutDashboard, LogOut, WifiOff, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FrameProps {
  children: React.ReactNode;
}

export const Frame: React.FC<FrameProps> = ({ children }) => {
  const { currentPath, navigate, currentUser, logout, offlineMode, setOfflineMode, notificationsEnabled, toggleNotifications, isAuthModalOpen, setAuthModalOpen } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavLink = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleAuthTrigger = () => {
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div id="echo-glitch-frame" className="min-h-screen bg-canvas text-ink font-sans flex flex-col justify-between selection:bg-surface-strong selection:text-ink">
      
      {offlineMode && (
        <div className="bg-surface-soft border-b border-hairline px-4 py-2 flex items-center justify-between text-sm font-medium text-muted">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-warning" />
            <span>You are currently offline. Changes are saved locally.</span>
          </div>
          <button 
            onClick={() => setOfflineMode(false)}
            className="text-ink hover:underline text-sm font-medium"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-canvas h-16 flex items-center border-b border-hairline-soft">
        <div className="w-full px-6 md:px-10 flex justify-between items-center">
          
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <EchoRobotLogo size={44} />
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              Glitch
            </span>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavLink('/')}
              className={`text-sm font-medium transition-colors cursor-pointer ${currentPath === '/' ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavLink('/playbooks')}
              className={`text-sm font-medium transition-colors cursor-pointer ${currentPath.startsWith('/playbooks') ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              Playbooks
            </button>
            <button 
              onClick={() => handleNavLink('/solutions')}
              className={`text-sm font-medium transition-colors cursor-pointer ${currentPath === '/solutions' ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              Solutions
            </button>
            <button 
              onClick={() => handleNavLink('/updates')}
              className={`text-sm font-medium transition-colors cursor-pointer ${currentPath === '/updates' ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              Updates
            </button>

          </nav>

          {/* User Auth Action triggers */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2 items-center mr-4">

              <button
                onClick={toggleNotifications}
                className={`p-2 transition-colors rounded-full ${notificationsEnabled ? 'text-ink bg-surface-soft' : 'text-muted hover:text-ink hover:bg-surface-soft'}`}
                title="Notifications"
              >
                {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-ink hover:text-muted transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
                <div 
                  className="w-9 h-9 rounded-full bg-surface-card text-ink flex items-center justify-center text-sm font-medium cursor-pointer"
                  title={`Role: ${currentUser.role}`}
                >
                  {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <button
                  onClick={logout}
                  className="text-muted hover:text-ink p-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAuthTrigger}
                  className="bg-primary text-on-primary hover:bg-primary-active px-5 py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer h-10 flex items-center justify-center"
                >
                  Member Access
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink hover:text-muted focus:outline-none cursor-pointer p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-canvas border-b border-hairline shadow-sm overflow-hidden z-40"
            >
              <div className="px-6 py-6 space-y-4 flex flex-col font-medium text-sm text-ink">
                <button 
                  onClick={() => handleNavLink('/')}
                  className="text-left py-2 hover:text-muted"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavLink('/playbooks')}
                  className="text-left py-2 hover:text-muted"
                >
                  Playbooks
                </button>
                <button 
                  onClick={() => handleNavLink('/solutions')}
                  className="text-left py-2 hover:text-muted"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => handleNavLink('/updates')}
                  className="text-left py-2 hover:text-muted"
                >
                  Updates
                </button>


                <div className="border-t border-hairline my-2 pt-4 flex flex-col space-y-4">
                  {currentUser ? (
                    <>
                      <button
                        onClick={() => handleNavLink('/dashboard')}
                        className="text-left py-2 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left py-2 flex items-center space-x-2 text-muted"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAuthTrigger}
                        className="bg-primary text-on-primary py-3 rounded-md text-center font-semibold"
                      >
                        Member Access
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full bg-canvas">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-dark py-16 text-sm text-on-dark-soft relative z-10">
        <div className="w-full px-6 md:px-10 h-full flex flex-col md:flex-row justify-between space-y-12 md:space-y-0">
          
          <div className="space-y-4 max-w-xs w-full">
            <div className="flex items-center space-x-2">
              <span className="font-display text-xl font-semibold tracking-tight text-on-dark">Echo Glitch</span>
            </div>
            <p className="leading-relaxed">
              The premium AI ecosystem for ambitious professionals. Built for execution, designed for mastery.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full md:w-auto">
            <div className="space-y-4">
              <span className="block text-on-dark font-medium">Product</span>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/')} className="hover:text-on-dark transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => navigate('/playbooks')} className="hover:text-on-dark transition-colors cursor-pointer">Playbooks</button></li>
                <li><button onClick={() => navigate('/solutions')} className="hover:text-on-dark transition-colors cursor-pointer">Solutions</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="block text-on-dark font-medium">Solutions</span>
              <ul className="space-y-3">
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">Enterprise</button></li>
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">Startups</button></li>
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">Teams</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="block text-on-dark font-medium">Resources</span>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/playbooks')} className="hover:text-on-dark transition-colors cursor-pointer">Documentation</button></li>
                <li><button onClick={() => navigate('/updates')} className="hover:text-on-dark transition-colors cursor-pointer">Updates</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="block text-on-dark font-medium">Company</span>
              <ul className="space-y-3">
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">About</button></li>
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">Careers</button></li>
                <li><button className="hover:text-on-dark transition-colors cursor-pointer">Security</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full px-6 md:px-10 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-[13px] space-y-4 md:space-y-0">
          <div className="flex space-x-6">
            <span>© 2026 Echo Inc.</span>
            <button className="hover:text-on-dark">Privacy</button>
            <button className="hover:text-on-dark">Terms</button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <EcoBot />
    </div>
  );
};
