import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MailCheck, Lock, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAppState } from '../store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { redirectAfterAuth } = useAppState();
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setNameError(''); setEmailError(''); setPasswordError('');
    setAuthError(''); setSignUpSuccess(false); setSignUpEmail('');
  };

  const handleModeToggle = () => { reset(); setIsLogin(prev => !prev); };

  const handleClose = () => { reset(); setIsLogin(true); onClose(); };

  const validate = (): boolean => {
    let valid = true;
    if (!isLogin && name.trim().length < 2) {
      setNameError('Please enter your full name (at least 2 characters).');
      valid = false;
    } else setNameError('');
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else setEmailError('');
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        handleClose();
        redirectAfterAuth();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, phone } }
        });
        if (error) throw error;
        
        if (data.user) {
          await supabase.from('profiles').update({ phone }).eq('id', data.user.id);
        }
        
        setSignUpEmail(email);
        setSignUpSuccess(true);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-sans text-text-primary bg-canvas-white
     placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/40
     focus:border-brand-primary transition-all duration-200
     ${hasError ? 'border-red-400 bg-red-50/30' : 'border-border-light hover:border-brand-primary/40'}`;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] isolate"
          role="dialog"
          aria-modal="true"
          aria-label={isLogin ? 'Sign in' : 'Create account'}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[101] bg-slate-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-[420px] max-w-[100vw] z-[102] flex flex-col overflow-y-auto"
            style={{
              background: 'var(--color-canvas-white)',
              borderLeft: '1px solid var(--color-border-light)',
              boxShadow: '-8px 0 40px rgba(79,70,229,0.08), -2px 0 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-primary to-violet-500 shrink-0" />

            {/* Close button */}
            <div className="flex justify-end px-6 pt-5 pb-2 shrink-0">
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-full text-text-tertiary hover:text-text-primary hover:bg-canvas transition-all duration-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col flex-grow px-8 pb-10">

              {/* ── SIGNUP SUCCESS ── */}
              {signUpSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col flex-grow items-center justify-center text-center gap-6"
                >
                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--color-brand-lavender)' }}
                  >
                    <MailCheck className="w-10 h-10 text-brand-primary" />
                  </div>

                  {/* Copy */}
                  <div className="space-y-2">
                    <p
                      className="text-[10px] font-bold tracking-widest uppercase text-brand-primary"
                    >
                      Verification Sent
                    </p>
                    <h2 className="text-2xl font-display font-bold text-text-primary">
                      Check your inbox
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      We've sent a verification link to:
                    </p>
                    <p className="font-semibold text-text-primary text-sm break-all px-4 py-2 rounded-lg bg-brand-lavender">
                      {signUpEmail}
                    </p>
                    <p className="text-text-tertiary text-sm leading-relaxed pt-1">
                      Click the link to verify your account, then sign in below.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-full space-y-3 pt-2">
                    <button
                      onClick={() => { setSignUpSuccess(false); setIsLogin(true); }}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                      style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)' }}
                    >
                      Go to Sign In
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-text-secondary border border-border-light hover:bg-canvas hover:text-text-primary transition-all duration-200"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── AUTH FORM ── */
                <div className="flex flex-col flex-grow">

                  {/* Header */}
                  <div className="mb-8">
                    {/* Mode icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: 'var(--color-brand-lavender)' }}
                    >
                      {isLogin
                        ? <Lock className="w-6 h-6 text-brand-primary" />
                        : <UserPlus className="w-6 h-6 text-brand-primary" />
                      }
                    </div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-brand-primary mb-1">
                      {isLogin ? 'Member Access' : 'Join Echo Glitch'}
                    </p>
                    <h2 className="text-3xl font-display font-bold text-text-primary">
                      {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="text-text-secondary text-sm mt-2">
                      {isLogin
                        ? 'Sign in to access your execution dashboard.'
                        : 'Build your AI advantage with premium playbooks.'}
                    </p>
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-5"
                      >
                        <span className="shrink-0 mt-0.5">⚠️</span>
                        <span>{authError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                    {/* Full Name — signup only */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="auth-name" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <input
                          id="auth-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          aria-required="true"
                          aria-invalid={!!nameError}
                          className={inputClass(!!nameError)}
                        />
                        {nameError && (
                          <p role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <span>⚠</span> {nameError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Phone Number — signup only */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="auth-phone" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          id="auth-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className={inputClass(false)}
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label htmlFor="auth-email" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        aria-required="true"
                        aria-invalid={!!emailError}
                        className={inputClass(!!emailError)}
                      />
                      {emailError && (
                        <p role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {emailError}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="auth-password" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <input
                        id="auth-password"
                        type="password"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        placeholder={isLogin ? 'Enter your password' : 'Min. 8 characters'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        aria-required="true"
                        aria-invalid={!!passwordError}
                        className={inputClass(!!passwordError)}
                      />
                      {passwordError && (
                        <p role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <span>⚠</span> {passwordError}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-brand-primary/25 active:scale-[0.98]"
                      style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)' }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : isLogin ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-border-light" />
                    <span className="text-xs text-text-tertiary font-medium">or</span>
                    <div className="flex-1 h-px bg-border-light" />
                  </div>

                  {/* Toggle mode */}
                  <div className="text-center">
                    <p className="text-text-secondary text-sm">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      {' '}
                      <button
                        type="button"
                        onClick={handleModeToggle}
                        className="text-brand-primary font-semibold hover:underline focus:outline-none transition-colors"
                      >
                        {isLogin ? 'Sign up free' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  {/* Footer trust line */}
                  <p className="text-center text-[11px] text-text-tertiary mt-auto pt-8">
                    By continuing you agree to our Terms of Service &amp; Privacy Policy
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};
