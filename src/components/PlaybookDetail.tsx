import React, { useState } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';

export const PlaybookDetail: React.FC = () => {
  const { routeParams, navigate, currentUser, purchasedSlugs, saveIntent, setAuthModalOpen } = useAppState();

  const slug = routeParams.slug || '';
  const playbook = PLAYBOOKS.find(p => p.slug === slug);

  if (!playbook) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto px-6">
        <p className="text-error font-medium text-sm mb-4">Playbook not found</p>
        <button 
          onClick={() => navigate('/playbooks')} 
          className="text-ink hover:underline font-semibold text-sm cursor-pointer"
        >
          Return to Playbooks
        </button>
      </div>
    );
  }

  const hasPurchased = purchasedSlugs.includes(playbook.slug);

  const [isAcquiring, setIsAcquiring] = useState(false);

  const handleAcquireClick = async () => {
    // Guard: not logged in
    if (!currentUser) {
      saveIntent(playbook.slug, playbook.price);
      setAuthModalOpen(true);
      return;
    }

    if (isAcquiring) return;
    setIsAcquiring(true);
    try {
      // Resolve the Supabase auth user to get the real UUID
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error('Session expired. Please sign in again.');

      const { error: insertError } = await supabase
        .from('user_playbooks')
        .insert({
          user_id: authData.user.id,
          playbook_id: playbook.slug,
          title: playbook.title,
          status: 'Unread',
          read_time: '0 min',
        });

      if (insertError) throw new Error(insertError.message);

      // Success — redirect to library
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      alert(`Could not acquire playbook: ${message}`);
    } finally {
      setIsAcquiring(false);
    }
  };

  const stripMarkdown = (text: string) => {
    return text.replace(/[#*_>]/g, '').trim();
  };



  return (
    <div className="bg-canvas text-ink font-sans pb-24">
      
      {/* Header with back button */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <button 
          onClick={() => navigate('/playbooks')}
          className="text-muted hover:text-ink flex items-center space-x-2 transition-colors cursor-pointer text-sm font-semibold mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Playbooks</span>
        </button>
      </section>

      {/* Main Grid content segment */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Cover and info specs */}
          <div className="lg:col-span-4 space-y-6 animate-fade-in-up">
            <div className="bg-surface-card rounded-lg p-6 flex items-center justify-center">
              <div className="w-full aspect-[4/5] rounded-md overflow-hidden bg-surface-dark relative shadow-sm">
                <img 
                  src={playbook.coverImage} 
                  alt={playbook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Quick billing summary card */}
            <div className="border border-hairline p-8 space-y-6 bg-canvas rounded-lg shadow-sm">
              <div className="flex justify-between items-center border-b border-hairline pb-4">
                <span className="text-sm font-medium text-muted">Price</span>
                <span className="text-3xl font-display font-semibold text-ink">₹{playbook.price}</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-body leading-relaxed">
                  Includes comprehensive sequence specifications, architectural diagrams, and procedural styling controls.
                </p>

                {hasPurchased ? (
                  <button
                    onClick={() => navigate(`/reader/${playbook.slug}`)}
                    className="w-full bg-primary text-on-primary hover:bg-primary-active py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Open Playbook
                  </button>
                ) : (
                  <button
                    onClick={handleAcquireClick}
                    disabled={isAcquiring}
                    className="w-full bg-primary text-on-primary hover:bg-primary-active py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer disabled:opacity-80 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {isAcquiring ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                          className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Acquiring...
                      </>
                    ) : (
                      'Acquire access'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and Blurred chapters */}
          <div className="lg:col-span-8 space-y-12 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="space-y-4">
              <div className="inline-block bg-surface-card px-3 py-1 rounded-pill text-xs font-medium text-muted">
                {playbook.track} Track
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-ink font-semibold tracking-tight">
                {playbook.title}
              </h1>
              <p className="text-lg text-muted font-medium pt-2">
                {playbook.subtitle}
              </p>
              <p className="text-body text-base leading-relaxed pt-2">
                {playbook.fullDesc}
              </p>
            </div>

            {/* Chapters Table of Contents */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-hairline">
                <h2 className="font-display text-2xl text-ink font-semibold tracking-tight">
                  Table of Contents
                </h2>
                <span className="bg-surface-card px-2 py-1 rounded-md text-xs font-semibold text-muted">
                  {playbook.chapters.length} chapters
                </span>
              </div>

              <div className="space-y-4">
                {playbook.chapters.map((chapter, index) => {
                  const isChapterBlurred = index > 0 && !hasPurchased;

                  return (
                    <div 
                      key={chapter.id}
                      className={`border border-hairline p-6 bg-canvas rounded-lg transition-colors ${isChapterBlurred ? 'cursor-pointer hover:border-surface-strong' : ''}`}
                      onClick={isChapterBlurred ? handleAcquireClick : undefined}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {isChapterBlurred ? (
                            <div className="flex items-center space-x-2 text-muted font-medium">
                              <Lock className="w-4 h-4" />
                              <span>{chapter.title.split('.')[0]}. Locked Chapter</span>
                            </div>
                          ) : (
                            <h3 className="text-lg text-ink font-semibold">
                              {chapter.title}
                            </h3>
                          )}
                          <span className="text-xs text-muted font-medium mt-1 block">
                            Estimated read time: {chapter.estimatedMinutes} min
                          </span>
                        </div>
                        
                        {!isChapterBlurred ? (
                          <span className="text-xs font-medium bg-surface-soft text-muted px-2 py-1 rounded-md">
                            Preview available
                          </span>
                        ) : (
                          <span className="text-xs font-medium bg-surface-soft text-muted px-2 py-1 rounded-md">
                            Locked
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <div className={`prose prose-sm max-w-none text-body leading-relaxed ${isChapterBlurred ? 'blur-sm select-none pointer-events-none opacity-40' : ''}`}>
                          <p className="whitespace-pre-line">
                            {stripMarkdown(chapter.content).substring(0, 320)}...
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
