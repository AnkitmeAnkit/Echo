import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, QrCode, Loader2 } from 'lucide-react';
import { useAppState } from '../store';
import { getPlaybookDownloadLink } from '../supabaseClient';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'playbook';
  itemSlug: string;
  itemTitle: string;
  price: number;
  onSuccess?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemSlug,
  itemTitle,
  price,
  onSuccess
}) => {
  const { currentUser, acquirePlaybook } = useAppState();
  
  const [step, setStep] = useState<'confirm' | 'payment' | 'verifying' | 'success'>('confirm');
  const [upiId, setUpiId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState(currentUser?.phone || '');
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setUpiId('');
      setPaymentPhone(currentUser?.phone || '');
      setIsFetchingLink(false);
      setDownloadError(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleFreeAccess = async () => {
    await acquirePlaybook(itemSlug, true);
    setStep('success');
  };

  const handlePayClick = () => {
    if (!upiId || !paymentPhone) return;
    setStep('verifying');
    setTimeout(async () => {
      const mockRef = 'MOCK_' + Date.now();
      await acquirePlaybook(itemSlug, false, mockRef);
      setStep('success');
    }, 2500);
  };

  const handleDone = () => {
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleOpenPlaybook = async () => {
    setIsFetchingLink(true);
    setDownloadError(null);
    const link = await getPlaybookDownloadLink(itemSlug);
    setIsFetchingLink(false);
    
    if (link) {
      window.open(link, '_blank');
    } else {
      setDownloadError("Could not load file. Try from your Dashboard.");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-canvas dark:bg-black/80 backdrop-blur-sm"
        onClick={step !== 'verifying' ? onClose : undefined}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-canvas-white dark:bg-zinc-900 border border-border-light/50 dark:border-zinc-700/50 rounded-2xl p-8 shadow-2xl z-50 overflow-hidden"
      >
        {step !== 'verifying' && step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-tertiary dark:text-zinc-500 hover:text-text-primary dark:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col">
          {step === 'confirm' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">{itemTitle}</h2>
              <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8">
                Acquire full access to this playbook.
              </p>

              {price === 0 ? (
                <div className="flex flex-col items-center gap-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 font-bold tracking-widest text-sm uppercase">
                    FREE <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <button
                    onClick={handleFreeAccess}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold text-text-primary dark:text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors"
                  >
                    Get Free Access
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="text-5xl font-bold text-text-primary dark:text-white tracking-tight">₹{price}</div>
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold text-text-primary dark:text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors"
                  >
                    Proceed to Pay
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">Complete Payment</h2>
                <p className="text-text-secondary dark:text-zinc-400 text-sm">Pay ₹{price} to acquire access</p>
              </div>

              <div className="border-2 border-dashed border-zinc-600 rounded-xl p-8 text-center mb-6 flex flex-col items-center">
                <QrCode className="w-16 h-16 text-text-secondary dark:text-zinc-400 mb-3" />
                <span className="text-text-secondary dark:text-zinc-300 font-medium">Scan QR to pay ₹{price} via PhonePe</span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-zinc-400 uppercase tracking-wider mb-2">PhonePe / UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-zinc-700 bg-canvas dark:bg-zinc-950 text-text-primary dark:text-white placeholder:text-text-tertiary dark:text-zinc-600 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-zinc-700 bg-canvas dark:bg-zinc-950 text-text-primary dark:text-white placeholder:text-text-tertiary dark:text-zinc-600 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handlePayClick}
                disabled={!upiId || !paymentPhone}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-text-primary dark:text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay ₹{price}
              </button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center py-12 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-brand-primary animate-spin mb-6" />
              <h2 className="text-xl font-bold text-text-primary dark:text-white mb-2">Verifying Payment...</h2>
              <p className="text-text-secondary dark:text-zinc-400 text-sm">Please don't close this window.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                Access Granted!
              </h2>
              <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8">
                Check your Dashboard to see this added.
              </p>

              <div className="w-full space-y-3">
                <div className="space-y-2">
                  <button
                    onClick={handleOpenPlaybook}
                    disabled={isFetchingLink}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold text-text-primary dark:text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isFetchingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isFetchingLink ? 'Loading...' : 'Open Playbook ↗'}
                  </button>
                  {downloadError && (
                    <p className="text-red-400 text-xs mt-2">{downloadError}</p>
                  )}
                </div>
                <button
                  onClick={handleDone}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-text-secondary dark:text-zinc-300 border border-border-light dark:border-zinc-700 hover:bg-border-light dark:bg-zinc-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
};
