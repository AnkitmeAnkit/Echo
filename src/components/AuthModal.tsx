import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Email format validation helper
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation error messages
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Ensure this only runs on the client to avoid SSR hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when toggling between login / register modes
  const handleModeToggle = () => {
    setIsLogin((prev) => !prev);
    setName('');
    setEmail('');
    setPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
  };

  // Reset form when drawer is closed
  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setIsLogin(true);
    onClose();
  };

  const validate = (): boolean => {
    let valid = true;

    if (!isLogin && name.trim().length < 2) {
      setNameError('Please enter your full name (at least 2 characters).');
      valid = false;
    } else {
      setNameError('');
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    // Auth logic can be wired to global state here
    handleClose();
  };

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] isolate" role="dialog" aria-modal="true" aria-label={isLogin ? 'Sign in' : 'Create account'}>
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[101] bg-black/20 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Layer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] max-w-[100vw] z-[102] bg-white shadow-2xl border-l border-gray-200 flex flex-col p-8 overflow-y-auto"
          >
            {/* Header / Close Button */}
            <div className="flex justify-end mb-8 shrink-0">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                aria-label="Close authentication panel"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-3xl font-medium tracking-tight mb-2 text-gray-900">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-500 mb-8">
                {isLogin
                  ? 'Sign in to access your execution dashboard.'
                  : 'Join Echo Glitch and architect your AI advantage.'}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 shrink-0">

                {/* Full Name — Sign Up only */}
                {!isLogin && (
                  <div>
                    <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-required="true"
                      aria-invalid={!!nameError}
                      aria-describedby={nameError ? 'auth-name-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black bg-white transition-colors ${
                        nameError ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                    {nameError && (
                      <p id="auth-name-error" role="alert" className="mt-1 text-xs text-red-500">
                        {nameError}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'auth-email-error' : undefined}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black bg-white transition-colors ${
                      emailError ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {emailError && (
                    <p id="auth-email-error" role="alert" className="mt-1 text-xs text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (min. 8 characters)'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'auth-password-error' : undefined}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black bg-white transition-colors ${
                      passwordError ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {passwordError && (
                    <p id="auth-password-error" role="alert" className="mt-1 text-xs text-red-500">
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <div className="relative flex items-center py-4" aria-hidden="true">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm uppercase">or</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  aria-label="Continue with Google account"
                >
                  Continue with Google
                </button>
              </form>

              {/* Footer toggle */}
              <div className="mt-auto pt-8 text-center shrink-0">
                <p className="text-gray-500 text-sm">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={handleModeToggle}
                    className="text-black font-medium hover:underline focus:outline-none"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};
