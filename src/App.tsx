import { AppProvider, useAppState } from './store';
import { Frame } from './components/Frame';
import { LoadingScreen } from './components/LoadingScreen';
import { Homepage } from './components/Homepage';
import { Catalog } from './components/Catalog';
import { PlaybookDetail } from './components/PlaybookDetail';
import { Dashboard } from './components/Dashboard';
import { Reader } from './components/Reader';
import { Checkout } from './components/Checkout';
import { Updates } from './components/Updates';
import { AdminDashboard } from './components/AdminDashboard';
import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AuthModal } from './components/AuthModal';


function AppContent() {
  const { currentPath, routeParams, currentUser, purchasedSlugs, playbooks, isLoading, isAuthModalOpen, navigate, login, saveIntent, setAuthModalOpen } = useAppState();

  // Global scroll-to-top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);



  // ENFORCE APPENDIX A MODULE ROUTE SECURITY GUARDS:
  // Pre-route renderer validation intercepts
  const renderViewWithGuards = () => {
    switch (currentPath) {
      case '/':
        return <Homepage />;

      case '/playbooks':
      case '/playbooks/all':
        return <Catalog />;

      case '/playbooks/[slug]':
        return <PlaybookDetail />;


      case '/dashboard':
        // Auth is handled inside Dashboard via supabase.auth.getUser()
        return <Dashboard />;

      case '/reader/[slug]':
        // Guard 1: JWT check
        if (!currentUser) {
          // Store attempt first prior to sign-in
          const targetSlug = routeParams.slug;
          if (targetSlug) saveIntent(targetSlug, 189);
          return (
            <div className="py-24 max-w-sm mx-auto text-center font-mono px-6">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 uppercase text-xs tracking-widest mb-2">ACCESS GATED // LAUNCH DISMISSED</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Authenticate profile credentials first prior to catalog reading.</p>
              <button onClick={() => setAuthModalOpen(true)} className="bg-white text-black py-2.5 px-6 uppercase text-xs tracking-widest font-bold block w-full cursor-pointer">
                Inbound Login Check
              </button>
            </div>
          );
        }
        // Guard 2: Ownership validation
        const slug = routeParams.slug || '';
        const hasPurchased = purchasedSlugs.includes(slug);
        if (!hasPurchased) {
          // Redirect unauthorized users to playbooks overview
          React.useEffect(() => {
            navigate(`/playbooks/${slug}`);
          }, [slug]);
          return null;
        }
        return <Reader />;

      case '/checkout/[slug]':
        // Guard: JWT required. If guest -> redirects to sign-in checkpoint saving intent parameters
        if (!currentUser) {
          React.useEffect(() => {
            const targetSlug = routeParams.slug;
            if (targetSlug) {
              const targetPlaybook = playbooks.find(p => p.slug === targetSlug);
              saveIntent(targetSlug, targetPlaybook?.price || 189);
            }
            navigate('/playbooks');
            setAuthModalOpen(true);
          }, [routeParams.slug]);
          return null;
        }
        return <Checkout />;

      case '/updates':
        return <Updates />;

      case '/admin':
        return <AdminDashboard />;

      default:
        // Universal fallback homepage
        return <Homepage />;
    }
  };

  // GLOBAL LOADING INTERCEPT
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Else, standard high-fashion layout with guards
  return (
    <Frame>
      {renderViewWithGuards()}
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />}
    </Frame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
