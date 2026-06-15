import { AppProvider, useAppState } from './store';
import { Frame } from './components/Frame';
import { LoadingScreen } from './components/LoadingScreen';
import { Homepage } from './components/Homepage';
import { Catalog } from './components/Catalog';
import { PlaybookDetail } from './components/PlaybookDetail';
import { Dashboard } from './components/Dashboard';
import { Reader } from './components/Reader';
import { Checkout } from './components/Checkout';
import { Consulting } from './components/Consulting';
import { Updates } from './components/Updates';

import { PLAYBOOKS } from './data';
import { ShieldAlert, Lock } from 'lucide-react';
import React, { useState } from 'react';


function AppContent() {
  const { currentPath, routeParams, currentUser, purchasedSlugs, isLoading, navigate, login, saveIntent, setAuthModalOpen } = useAppState();

  // Global scroll-to-top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  // ENFORCE APPENDIX A MODULE ROUTE SECURITY GUARDS:
  // Pre-route renderer validation intercepts
  const renderViewWithGuards = () => {
    switch (currentPath) {
      case '/':
        return <Homepage />;

      case '/playbooks':
        return <Catalog />;

      case '/playbooks/[slug]':
        return <PlaybookDetail />;


      case '/dashboard':
        // Guard: JWT Required. If empty, redirect to /auth
        if (!currentUser) {
          return (
            <div className="py-24 max-w-sm mx-auto text-center font-mono px-6">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 uppercase text-xs tracking-widest mb-2">ACCESS GATED BY AUDITING NODE</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Credential checks required prior to directory opening.</p>
              <button onClick={() => setAuthModalOpen(true)} className="bg-white text-black py-2.5 px-6 uppercase text-xs tracking-widest font-bold block w-full cursor-pointer">
                Commit Signature Token
              </button>
            </div>
          );
        }
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
              const targetPlaybook = PLAYBOOKS.find(p => p.slug === targetSlug);
              saveIntent(targetSlug, targetPlaybook?.price || 189);
            }
            navigate('/playbooks');
            setAuthModalOpen(true);
          }, [routeParams.slug]);
          return null;
        }
        return <Checkout />;

      case '/consulting':
      case '/solutions':
        return <Consulting />;

      case '/updates':
        return <Updates />;



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
