import React, { useState } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { Lock, ArrowLeft, X, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';

export const PlaybookDetail: React.FC = () => {
  const { routeParams, navigate, currentUser, purchasedSlugs, saveIntent, setAuthModalOpen, acquirePlaybook } = useAppState();

  const slug = routeParams.slug || '';
  const playbook = PLAYBOOKS.find(p => p.slug === slug);

  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentUpi, setPaymentUpi] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

    // Show Paywall/Download Modal
    setShowPaywallModal(true);
  };

  const handleProcessPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAcquiring || isVerifying) return;
    
    if (playbook.price > 0) {
      setIsVerifying(true);
      // Simulate PhonePe Verification Delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerifying(false);
    }

    setIsAcquiring(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
         acquirePlaybook(playbook.slug); // fallback if no supabase auth
      } else {
         const { error: insertError } = await supabase
           .from('user_playbooks')
           .insert({
             user_id: authData.user.id,
             playbook_id: playbook.slug,
             title: playbook.title,
             status: 'Unread',
             read_time: '0 min',
           });
         if (insertError && insertError.code !== '23505') throw new Error(insertError.message);
         acquirePlaybook(playbook.slug);
      }
      
      setShowPaywallModal(false);
      
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
    <div className="bg-canvas min-h-screen font-sans pb-24 relative">
      
      {/* Paywall Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-canvas-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up border border-border-light relative">
            <button 
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Acquire Access</h2>
              <p className="text-text-secondary text-sm mb-6">{playbook.title}</p>
              
              {playbook.price === 0 ? (
                <div className="space-y-6">
                  <div className="bg-brand-lavender/20 p-4 rounded-lg border border-brand-lavender text-center">
                    <p className="font-semibold text-brand-primary">This playbook is completely free!</p>
                  </div>
                  <button
                    onClick={() => handleProcessPayment()}
                    disabled={isAcquiring}
                    className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 py-3 rounded-md font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isAcquiring ? 'Processing...' : 'Read for free'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-5">
                  <div className="bg-brand-lavender/20 p-4 rounded-lg border border-brand-lavender flex items-center justify-between mb-4">
                    <span className="font-semibold text-text-primary">Total Amount</span>
                    <span className="font-bold text-brand-primary text-lg">₹{playbook.price}</span>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                     <div className="w-32 h-32 bg-canvas border-2 border-border-light rounded-lg flex items-center justify-center text-text-secondary flex-col">
                       <QrCode className="w-10 h-10 mb-2" />
                       <span className="text-xs font-medium">Scan to Pay</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-canvas border border-border-light rounded-md text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">UPI ID</label>
                      <input 
                        type="text" 
                        required
                        value={paymentUpi}
                        onChange={(e) => setPaymentUpi(e.target.value)}
                        className="w-full px-3 py-2 bg-canvas border border-border-light rounded-md text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                        placeholder="e.g. number@upi"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAcquiring || isVerifying}
                    className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 py-3 rounded-md font-semibold transition-colors mt-6 disabled:opacity-50 flex justify-center cursor-pointer"
                  >
                    {isVerifying ? 'Verifying with PhonePe...' : isAcquiring ? 'Processing...' : `Pay ₹${playbook.price}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header with back button */}
      <section className="max-w-[1860px] mx-auto px-6 pt-12 pb-8">
        <button 
          onClick={() => navigate('/playbooks')}
          className="text-text-secondary hover:text-text-primary flex items-center space-x-2 transition-colors cursor-pointer text-sm font-semibold mb-8"
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
            <div className="bg-white border border-border-light rounded-lg p-6 flex items-center justify-center shadow-sm">
              <div className="w-full aspect-[4/5] rounded-md overflow-hidden bg-canvas relative shadow-sm">
                <img 
                  src={playbook.coverImage} 
                  alt={playbook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Quick billing summary card */}
            <div className="border border-border-light p-8 space-y-6 bg-canvas-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center border-b border-border-light pb-4">
                <span className="text-sm font-medium text-text-secondary">Price</span>
                <span className="text-3xl font-display font-semibold text-text-primary">
                  {playbook.price === 0 ? 'Free' : `₹${playbook.price}`}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Includes comprehensive sequence specifications, architectural diagrams, and procedural styling controls.
                </p>

                {hasPurchased ? (
                  <button
                    onClick={() => window.open('https://drive.google.com/file/d/dummy-link/view', '_blank')}
                    className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Download Playbook
                  </button>
                ) : (
                  <button
                    onClick={handleAcquireClick}
                    className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 py-3 text-center rounded-md font-semibold text-sm transition-colors cursor-pointer disabled:opacity-80 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    Acquire access
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and Blurred chapters */}
          <div className="lg:col-span-8 space-y-12 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="space-y-4">
              <div className="inline-block bg-brand-lavender/50 px-3 py-1 rounded-pill text-xs font-medium text-brand-primary">
                {playbook.track} Track
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-text-primary font-semibold tracking-tight">
                {playbook.title}
              </h1>
              <p className="text-lg text-text-secondary font-medium pt-2">
                {playbook.subtitle}
              </p>
              <p className="text-text-secondary text-base leading-relaxed pt-2">
                {playbook.fullDesc}
              </p>
            </div>

            {/* Chapters Table of Contents */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-2 border-b border-border-light">
                <h2 className="font-display text-2xl text-text-primary font-semibold tracking-tight">
                  Table of Contents
                </h2>
                <span className="bg-canvas border border-border-light px-2 py-1 rounded-md text-xs font-semibold text-text-secondary">
                  {playbook.chapters.length} chapters
                </span>
              </div>

              <div className="space-y-4">
                {playbook.chapters.map((chapter, index) => {
                  const isChapterBlurred = index > 0 && !hasPurchased;

                  return (
                    <div 
                      key={chapter.id}
                      className={`border border-border-light p-6 bg-canvas-white rounded-lg transition-colors ${isChapterBlurred ? 'cursor-pointer hover:border-brand-primary/50' : ''}`}
                      onClick={isChapterBlurred ? handleAcquireClick : undefined}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {isChapterBlurred ? (
                            <div className="flex items-center space-x-2 text-text-secondary font-medium">
                              <Lock className="w-4 h-4" />
                              <span>{chapter.title.split('.')[0]}. Locked Chapter</span>
                            </div>
                          ) : (
                            <h3 className="text-lg text-text-primary font-semibold">
                              {chapter.title}
                            </h3>
                          )}
                          <span className="text-xs text-text-secondary font-medium mt-1 block">
                            Estimated read time: {chapter.estimatedMinutes} min
                          </span>
                        </div>
                        
                        {!isChapterBlurred ? (
                          <span className="text-xs font-medium bg-canvas border border-border-light text-text-secondary px-2 py-1 rounded-md">
                            Preview available
                          </span>
                        ) : (
                          <span className="text-xs font-medium bg-canvas border border-border-light text-text-secondary px-2 py-1 rounded-md">
                            Locked
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <div className={`prose prose-sm max-w-none text-text-secondary leading-relaxed ${isChapterBlurred ? 'blur-sm select-none pointer-events-none opacity-40' : ''}`}>
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


