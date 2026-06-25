import React, { useState } from 'react';
import { useAppState } from '../store';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { PaywallModal } from './PaywallModal';
import { getPlaybookDownloadLink } from '../supabaseClient';

export const PlaybookDetail: React.FC = () => {
  const { routeParams, navigate, currentUser, purchasedSlugs, playbooks, saveIntent, setAuthModalOpen } = useAppState();

  const slug = routeParams.slug || '';
  const playbook = playbooks.find(p => p.slug === slug);

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isFetchingLink, setIsFetchingLink] = useState(false);

  if (!playbook) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto px-6">
        <p className="text-red-500 font-medium text-sm mb-4">Playbook not found or not published.</p>
        <button 
          onClick={() => navigate('/playbooks')} 
          className="text-text-secondary dark:text-zinc-400 hover:text-text-primary dark:text-white font-semibold text-sm cursor-pointer transition-colors"
        >
          Return to Playbooks
        </button>
      </div>
    );
  }

  const hasPurchased = purchasedSlugs.includes(playbook.slug);

  const handleAcquireClick = async () => {
    if (!currentUser) {
      saveIntent(playbook.slug, playbook.price);
      setAuthModalOpen(true);
      return;
    }
    setShowPaywallModal(true);
  };

  const handleOpenPlaybook = async () => {
    setIsFetchingLink(true);
    const link = await getPlaybookDownloadLink(playbook.slug);
    setIsFetchingLink(false);
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('Could not load file. Try from your Dashboard.');
    }
  };

  const stripMarkdown = (text: string) => {
    return text.replace(/[#*_>]/g, '').trim();
  };

  return (
    <div className="bg-canvas dark:bg-black min-h-screen font-sans pb-24 relative">
      
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        itemType="playbook"
        itemSlug={playbook.slug}
        itemTitle={playbook.title}
        price={playbook.price}
      />

      {/* Header with back button */}
      <section className="max-w-[1860px] mx-auto px-6 pt-12 pb-8">
        <button 
          onClick={() => navigate('/playbooks')}
          className="text-text-tertiary dark:text-zinc-500 hover:text-text-primary dark:text-white flex items-center space-x-2 transition-colors cursor-pointer text-sm font-semibold mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Playbooks</span>
        </button>
      </section>

      {/* Main Grid content segment */}
      <section className="max-w-[1860px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Cover and info specs */}
          <div className="lg:col-span-4 space-y-6 animate-fade-in-up">
            <div className="bg-canvas-white dark:bg-zinc-900 border border-border-light dark:border-zinc-800 rounded-lg p-6 flex items-center justify-center shadow-sm">
              <div className="w-full aspect-[4/5] rounded-md overflow-hidden bg-canvas dark:bg-zinc-950 relative shadow-sm">
                <img 
                  src={playbook.coverImage} 
                  alt={playbook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Quick billing summary card */}
            <div className="border border-border-light dark:border-zinc-800 p-8 space-y-6 bg-canvas-white dark:bg-zinc-900 rounded-lg shadow-sm">
              <div className="flex justify-between items-center border-b border-border-light dark:border-zinc-800 pb-4">
                <span className="text-sm font-medium text-text-secondary dark:text-zinc-400">Price</span>
                <span className="text-3xl font-display font-semibold text-text-primary dark:text-white">
                  {playbook.price === 0 ? 'Free' : `₹${playbook.price}`}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-text-secondary dark:text-zinc-400 leading-relaxed">
                  Includes comprehensive sequence specifications, architectural diagrams, and procedural styling controls.
                </p>

                {hasPurchased ? (
                  <button
                    onClick={handleOpenPlaybook}
                    disabled={isFetchingLink}
                    className="w-full bg-brand-primary text-text-primary dark:text-white hover:bg-brand-primary/90 py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isFetchingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isFetchingLink ? 'Loading...' : 'Open Playbook ↗'}
                  </button>
                ) : (
                  <button
                    onClick={handleAcquireClick}
                    className="w-full bg-brand-primary text-text-primary dark:text-white hover:bg-brand-primary/90 py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {playbook.price === 0 ? 'Get Free Access' : `Acquire Playbook`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and Blurred chapters */}
          <div className="lg:col-span-8 space-y-12 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="space-y-4">
              <div className="inline-block bg-brand-primary/20 px-3 py-1 rounded-full border border-brand-primary/30 text-xs font-medium text-brand-primary uppercase tracking-wider">
                {playbook.track} Track
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-text-primary dark:text-white font-semibold tracking-tight">
                {playbook.title}
              </h1>
              <p className="text-lg text-text-secondary dark:text-zinc-400 font-medium pt-2">
                {playbook.subtitle}
              </p>
              <p className="text-text-secondary dark:text-zinc-300 text-base leading-relaxed pt-2">
                {playbook.fullDesc}
              </p>
            </div>

            {/* Chapters Table of Contents */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-border-light dark:border-zinc-800">
                <h2 className="font-display text-2xl text-text-primary dark:text-white font-semibold tracking-tight">
                  Table of Contents
                </h2>
                <span className="bg-canvas-white dark:bg-zinc-900 border border-border-light dark:border-zinc-800 px-2 py-1 rounded-md text-xs font-semibold text-text-secondary dark:text-zinc-400">
                  {playbook.chapters?.length || 0} chapters
                </span>
              </div>

              <div className="space-y-4">
                {playbook.chapters?.map((chapter, index) => {
                  const isChapterBlurred = index > 0 && !hasPurchased;

                  return (
                    <div 
                      key={chapter.id}
                      className={`border border-border-light dark:border-zinc-800 p-6 bg-canvas-white dark:bg-zinc-900 rounded-lg transition-colors ${isChapterBlurred ? 'cursor-pointer hover:border-brand-primary/50' : ''}`}
                      onClick={isChapterBlurred ? handleAcquireClick : undefined}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {isChapterBlurred ? (
                            <div className="flex items-center space-x-2 text-text-secondary dark:text-zinc-400 font-medium">
                              <Lock className="w-4 h-4" />
                              <span>{chapter.title.split('.')[0] || `Chapter ${index + 1}`}. Locked Chapter</span>
                            </div>
                          ) : (
                            <h3 className="text-lg text-text-primary dark:text-white font-semibold">
                              {chapter.title}
                            </h3>
                          )}
                          <span className="text-xs text-text-tertiary dark:text-zinc-500 font-medium mt-1 block">
                            Estimated read time: {chapter.estimatedMinutes} min
                          </span>
                        </div>
                        
                        {!isChapterBlurred ? (
                          <span className="text-xs font-medium bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 text-text-secondary dark:text-zinc-400 px-2 py-1 rounded-md">
                            Preview available
                          </span>
                        ) : (
                          <span className="text-xs font-medium bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 text-text-secondary dark:text-zinc-400 px-2 py-1 rounded-md">
                            Locked
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <div className={`prose prose-sm max-w-none text-text-secondary dark:text-zinc-400 leading-relaxed ${isChapterBlurred ? 'blur-sm select-none pointer-events-none opacity-40' : ''}`}>
                          <p className="whitespace-pre-line">
                            {stripMarkdown(chapter.content || '').substring(0, 320)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
