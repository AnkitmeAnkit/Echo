import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ConsultingBooking, Playbook, ProblemSubmission } from './types';
import { PLAYBOOKS } from './data';
import { supabase } from './supabaseClient';

interface AppContextType {
  currentUser: User | null;
  purchasedSlugs: string[];
  currentPath: string;
  routeParams: Record<string, string>;
  bookings: ConsultingBooking[];
  problemSubmissions: ProblemSubmission[];
  offlineMode: boolean;
  notificationsEnabled: boolean;
  isDarkMode: boolean;
  isAuthModalOpen: boolean;
  isLoading: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  login: (email: string, name: string, role: string, isPremium?: boolean) => void;
  register: (email: string, name: string, role: string) => void;
  logout: () => void;
  setProfessionalRole: (role: string) => void;
  acquirePlaybook: (slug: string) => void;
  saveScrollPosition: (slug: string, progress: number) => void;
  getScrollPosition: (slug: string) => number;
  bookConsulting: (booking: Omit<ConsultingBooking, 'id' | 'submittedAt'>) => void;
  submitProblem: (data: Omit<ProblemSubmission, 'id' | 'submittedAt' | 'status' | 'paymentRef'>) => ProblemSubmission;
  setOfflineMode: (offline: boolean) => void;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  navigate: (path: string) => void;
  saveIntent: (slug: string, price: number) => void;
  getAndClearIntent: () => { slug: string; price: number } | null;
  setAuthModalOpen: (isOpen: boolean) => void;
  redirectAfterAuth: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Auth & Storage State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoadingState] = useState<boolean>(false);
  const [bookings, setBookings] = useState<ConsultingBooking[]>([]);
  const [problemSubmissions, setProblemSubmissions] = useState<ProblemSubmission[]>([]);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Helper: Route Parser — reads from window.location.pathname
  const parsePath = (pathname: string) => {
    const path = pathname || '/';

    // Match /playbooks/[slug] — but not /playbooks or /playbooks/all
    if (path.startsWith('/playbooks/') && path !== '/playbooks/all') {
      const slug = path.split('/playbooks/')[1].split('?')[0];
      const queryParams = parseQuery(path);
      setCurrentPath('/playbooks/[slug]');
      setRouteParams({ slug, ...queryParams });
      return;
    }

    // Match /reader/[slug]
    if (path.startsWith('/reader/')) {
      const slug = path.split('/reader/')[1].split('?')[0];
      setCurrentPath('/reader/[slug]');
      setRouteParams({ slug });
      return;
    }

    // Match /checkout/[slug]
    if (path.startsWith('/checkout/')) {
      const slug = path.split('/checkout/')[1].split('?')[0];
      setCurrentPath('/checkout/[slug]');
      setRouteParams({ slug });
      return;
    }

    // Default route — strip query params
    const queryParams = parseQuery(path);
    setCurrentPath(path.split('?')[0]);
    setRouteParams(queryParams);
  };

  const parseQuery = (path: string): Record<string, string> => {
    const qIndex = path.indexOf('?');
    if (qIndex === -1) return {};
    const queryParams: Record<string, string> = {};
    const searchParams = new URLSearchParams(path.slice(qIndex + 1));
    searchParams.forEach((value, key) => { queryParams[key] = value; });
    return queryParams;
  };

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      parsePath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    // Initial parse
    parsePath(window.location.pathname + window.location.search);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync Storage & Supabase Auth
  useEffect(() => {
    // 1. Supabase Auth State Listener — single source of truth for auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Build a User object from the Supabase session
        const supaUser = session.user;
        const appUser: User = {
          email: supaUser.email || '',
          name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'Member',
          role: supaUser.user_metadata?.role || 'Member',
          isPremium: false,
          phone: supaUser.user_metadata?.phone || '',
          joinedAt: supaUser.created_at || new Date().toISOString(),
          savedScrollPositions: {}
        };
        localStorage.setItem('eg_user', JSON.stringify(appUser));
        setCurrentUser(appUser);
      } else {
        // Signed out — clear state
        localStorage.removeItem('eg_user');
        setCurrentUser(null);
      }
    });

    // 2. Purchases
    const savedPurchases = localStorage.getItem('eg_purchases');
    if (savedPurchases) {
      try {
        setPurchasedSlugs(JSON.parse(savedPurchases));
      } catch (e) {
        console.error('Error parsing saved purchases', e);
      }
    } else {
      localStorage.setItem('eg_purchases', JSON.stringify([]));
    }

    // 3. Consulting Bookings
    const savedBookings = localStorage.getItem('eg_bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Error parsing saved bookings', e);
      }
    }

    // 3b. Problem Submissions
    const savedSubmissions = localStorage.getItem('eg_problem_submissions');
    if (savedSubmissions) {
      try {
        setProblemSubmissions(JSON.parse(savedSubmissions));
      } catch (e) {
        console.error('Error parsing saved problem submissions', e);
      }
    }

    // 4. Notifications state
    const savedNotif = localStorage.getItem('eg_notifications') === '1';
    setNotificationsEnabled(savedNotif);

    // 5. Dark Mode state
    const savedTheme = localStorage.getItem('eg_theme');
    setIsDarkMode(savedTheme === 'dark');

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Action: Navigate — uses History API for clean URLs
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    parsePath(path);
  };

  // Action: Set Loading
  const setLoading = (loading: boolean) => {
    setIsLoadingState(loading);
  };

  // Action: Login (also used post-Supabase-auth to redirect)
  const login = (email: string, name: string, role: string, isPremium: boolean = false) => {
    const newUser: User = {
      email,
      name,
      role,
      isPremium,
      joinedAt: new Date().toISOString(),
      savedScrollPositions: {}
    };
    localStorage.setItem('eg_user', JSON.stringify(newUser));
    setCurrentUser(newUser);

    // Check for redirect param
    if (routeParams.redirect) {
      navigate(routeParams.redirect);
      return;
    }

    // After logging in, check for intent
    const intent = getAndClearIntent();
    if (intent) {
      navigate(`/checkout/${intent.slug}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Action: Register
  const register = (email: string, name: string, role: string) => {
    login(email, name, role, false);
  };

  // Action: Navigate to dashboard (used after auth without rebuilding user object)
  const redirectAfterAuth = () => {
    if (routeParams.redirect) {
      navigate(routeParams.redirect);
      return;
    }
    const intent = getAndClearIntent();
    if (intent) {
      navigate(`/checkout/${intent.slug}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Action: Logout
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('eg_user');
    setCurrentUser(null);
    navigate('/');
  };

  // Action: Set role
  const setProfessionalRole = (role: string) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      localStorage.setItem('eg_user', JSON.stringify(updated));
      setCurrentUser(updated);
    }
  };

  // Action: Acquire Playbook
  const acquirePlaybook = (slug: string) => {
    const updated = Array.from(new Set([...purchasedSlugs, slug]));
    localStorage.setItem('eg_purchases', JSON.stringify(updated));
    setPurchasedSlugs(updated);
  };

  // Action: Save scroll progress
  const saveScrollPosition = (slug: string, progress: number) => {
    if (!currentUser) return;
    const currentPositions = currentUser.savedScrollPositions || {};
    const updated = {
      ...currentUser,
      savedScrollPositions: {
        ...currentPositions,
        [slug]: progress
      }
    };
    localStorage.setItem('eg_user', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  // Action: Get scroll progress
  const getScrollPosition = (slug: string): number => {
    if (!currentUser || !currentUser.savedScrollPositions) return 0;
    return currentUser.savedScrollPositions[slug] || 0;
  };

  // Action: Booking Consulting
  const bookConsulting = (booking: Omit<ConsultingBooking, 'id' | 'submittedAt'>) => {
    const newBooking: ConsultingBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString()
    };
    const updated = [...bookings, newBooking];
    localStorage.setItem('eg_bookings', JSON.stringify(updated));
    setBookings(updated);
  };

  // Action: Submit Problem (after ₹9 payment)
  const submitProblem = (data: Omit<ProblemSubmission, 'id' | 'submittedAt' | 'status' | 'paymentRef'>): ProblemSubmission => {
    const newSubmission: ProblemSubmission = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      paymentRef: 'PAY-' + Math.random().toString(36).substr(2, 8).toUpperCase()
    };
    const updated = [...problemSubmissions, newSubmission];
    localStorage.setItem('eg_problem_submissions', JSON.stringify(updated));
    setProblemSubmissions(updated);
    return newSubmission;
  };

  // Action: Toggle Notifications
  const toggleNotifications = () => {
    const updated = !notificationsEnabled;
    localStorage.setItem('eg_notifications', updated ? '1' : '0');
    setNotificationsEnabled(updated);
  };

  // Action: Toggle Dark Mode
  const toggleDarkMode = () => {
    const updated = !isDarkMode;
    localStorage.setItem('eg_theme', updated ? 'dark' : 'light');
    setIsDarkMode(updated);
  };

  // Handle Intent Persistence
  const saveIntent = (slug: string, price: number) => {
    sessionStorage.setItem('eg_purchase_intent', JSON.stringify({ slug, price }));
  };

  const getAndClearIntent = () => {
    const raw = sessionStorage.getItem('eg_purchase_intent');
    if (!raw) return null;
    try {
      sessionStorage.removeItem('eg_purchase_intent');
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      redirectAfterAuth,
      currentUser,
      purchasedSlugs,
      isLoading,
      currentPath,
      routeParams,
      bookings,
      problemSubmissions,
      submitProblem,
      offlineMode,
      notificationsEnabled,
      isDarkMode,
      setLoading,
      login,
      register,
      logout,
      setProfessionalRole,
      acquirePlaybook,
      saveScrollPosition,
      getScrollPosition,
      bookConsulting,
      setOfflineMode,
      toggleNotifications,
      toggleDarkMode,
      navigate,
      saveIntent,
      getAndClearIntent,
      isAuthModalOpen,
      setAuthModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }
  return context;
};
