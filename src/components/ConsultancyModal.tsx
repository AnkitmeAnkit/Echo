import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, AlertCircle, PhoneCall,
  Loader2, User, Mail, Phone, MessageSquare
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ConsultancyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export const ConsultancyModal: React.FC<ConsultancyModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted]         = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg]       = useState('');

  /* ── form state ── */
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [details,  setDetails]  = useState('');

  /* ── field errors ── */
  const [nameErr,    setNameErr]    = useState('');
  const [emailErr,   setEmailErr]   = useState('');
  const [phoneErr,   setPhoneErr]   = useState('');
  const [detailsErr, setDetailsErr] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const reset = () => {
    setFullName(''); setEmail(''); setPhone(''); setDetails('');
    setNameErr(''); setEmailErr(''); setPhoneErr(''); setDetailsErr('');
    setErrorMsg(''); setSubmitState('idle');
  };

  const handleClose = () => { reset(); onClose(); };

  const validate = (): boolean => {
    let ok = true;
    if (fullName.trim().length < 2) {
      setNameErr('Please enter your full name.'); ok = false;
    } else setNameErr('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr('Please enter a valid email address.'); ok = false;
    } else setEmailErr('');

    if (phone.trim().length < 7) {
      setPhoneErr('Please enter a valid phone number.'); ok = false;
    } else setPhoneErr('');

    if (details.trim().length < 10) {
      setDetailsErr('Please describe your project (at least 10 characters).'); ok = false;
    } else setDetailsErr('');

    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          name:    fullName.trim(),
          email:   email.trim().toLowerCase(),
          phone:   phone.trim(),
          details: details.trim(),
        }]);

      if (error) throw error;
      setSubmitState('success');
    } catch (err: any) {
      console.error('Consultancy submission error:', err);
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
      setSubmitState('error');
    }
  };

  if (!mounted) return null;

  /* ── shared input class builder ── */
  const inputCls = (hasError: boolean) => [
    'w-full px-4 py-3 rounded-xl border text-sm font-sans',
    'text-gray-800 bg-white placeholder:text-gray-400',
    'transition-all duration-200 outline-none',
    'focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500',
    hasError
      ? 'border-red-400 bg-red-50'
      : 'border-gray-200 hover:border-purple-300',
  ].join(' ');

  const portal = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Book a Free Consultancy Call"
        >
          {/* ── dark backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          {/* ── modal card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.96, y: 24  }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-purple-600"
          >
            {/* ── close button ── */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="px-8 pt-7 pb-8">

              {/* ══════════════════════════════════
                  SUCCESS STATE
              ══════════════════════════════════ */}
              {submitState === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0  }}
                  className="flex flex-col items-center text-center py-8 gap-5"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                      Submitted Successfully!
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                      We'll be in touch soon!
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed pt-1">
                      Thank you, <span className="font-semibold text-gray-700">{fullName}</span>. Our team
                      will review your request and contact you shortly.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-2 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    Close
                  </button>
                </motion.div>

              ) : (
              /* ══════════════════════════════════
                  FORM STATE
              ══════════════════════════════════ */
                <>
                  {/* ── header ── */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* phone icon badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5 text-purple-600" />
                    </div>

                    {/* title block */}
                    <div className="pt-0.5">
                      <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-purple-600 mb-1">
                        Free Consultation
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        Book a Free Consultancy Call
                      </h2>
                    </div>
                  </div>

                  {/* ── description ── */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Fill in your details and our expert will reach out to understand your needs
                    and guide you to the best solution.
                  </p>

                  {/* ── error banner ── */}
                  <AnimatePresence>
                    {submitState === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0  }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMsg || 'Submission failed. Please try again.'}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── form ── */}
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        <User className="w-3.5 h-3.5" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={e => { setFullName(e.target.value); setNameErr(''); }}
                        className={inputCls(!!nameErr)}
                      />
                      {nameErr && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{nameErr}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                        className={inputCls(!!emailErr)}
                      />
                      {emailErr && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{emailErr}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        <Phone className="w-3.5 h-3.5" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setPhoneErr(''); }}
                        className={inputCls(!!phoneErr)}
                      />
                      {phoneErr && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{phoneErr}
                        </p>
                      )}
                    </div>

                    {/* Details textarea */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Project / Consultation Details
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Briefly describe what you need help with..."
                        value={details}
                        onChange={e => { setDetails(e.target.value); setDetailsErr(''); }}
                        className={inputCls(!!detailsErr) + ' resize-none'}
                      />
                      {detailsErr && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{detailsErr}
                        </p>
                      )}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitState === 'loading'}
                      className="w-full mt-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-purple-200"
                    >
                      {submitState === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4" />
                          Book My Free Call
                        </>
                      )}
                    </button>

                    {/* Footer note */}
                    <p className="text-center text-[11px] text-gray-400 -mt-1">
                      No spam. We'll only contact you about your request.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(portal, document.body);
};
