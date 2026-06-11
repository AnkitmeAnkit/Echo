import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ConsultingBooking, Playbook } from './types';
import { PLAYBOOKS } from './data';

interface AppContextType {
  currentUser: User | null;
  purchasedSlugs: string[];
  introSeen: boolean;
  currentPath: string;
  routeParams: Record<string, string>;
  bookings: ConsultingBooking[];
  offlineMode: boolean;
  notificationsEnabled: boolean;
  isAuthModalOpen: boolean;
  
  // Actions
  setIntroSeen: (seen: boolean) => void;
  login: (email: string, name: string, role: string, isPremium?: boolean) => void;
  register: (email: string, name: string, role: string) => void;
  logout: () => void;
  setProfessionalRole: (role: string) => void;
  acquirePlaybook: (slug: string) => void;
  saveScrollPosition: (slug: string, progress: number) => void;
  getScrollPosition: (slug: string) => number;
  bookConsulting: (booking: Omit<ConsultingBooking, 'id' | 'submittedAt'>) => void;
  setOfflineMode: (offline: boolean) => void;
  toggleNotifications: () => void;
  navigate: (path: string) => void;
  saveIntent: (slug: string, price: number) => void;
  getAndClearIntent: () => { slug: string; price: number } | null;
  setAuthModalOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Auth & Storage State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>([]);
  const [introSeen, setIntroSeenState] = useState<boolean>(false);
  const [bookings, setBookings] = useState<ConsultingBooking[]>([]);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Helper: Route Parser
  const parseHash = (hash: string) => {
    const rawHash = hash.replace(/^#/, '') || '/';
    const [pathPart, queryPart] = rawHash.split('?');
    
    // Parse query params
    const queryParams: Record<string, string> = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
    }

    // Match /playbooks/[slug]
    if (pathPart.startsWith('/playbooks/')) {
      const slug = pathPart.split('/playbooks/')[1];
      setCurrentPath('/playbooks/[slug]');
      setRouteParams({ slug, ...queryParams });
      return;
    }
    
    // Match /reader/[slug]
    if (pathPart.startsWith('/reader/')) {
      const slug = pathPart.split('/reader/')[1];
      setCurrentPath('/reader/[slug]');
      setRouteParams({ slug, ...queryParams });
      return;
    }

    // Match /checkout/[slug]
    if (pathPart.startsWith('/checkout/')) {
      const slug = pathPart.split('/checkout/')[1];
      setCurrentPath('/checkout/[slug]');
      setRouteParams({ slug, ...queryParams });
      return;
    }

    // Default route match
    setCurrentPath(pathPart);
    setRouteParams(queryParams);
  };

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      parseHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial parse
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync Storage
  useEffect(() => {
    // 1. Intro SEEN
    // Always show intro on load/reload
    setIntroSeenState(false);

    // 2. Auth State
    const savedUser = localStorage.getItem('eg_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }

    // 3. Purchases
    const savedPurchases = localStorage.getItem('eg_purchases');
    if (savedPurchases) {
      try {
        setPurchasedSlugs(JSON.parse(savedPurchases));
      } catch (e) {
        console.error('Error parsing saved purchases', e);
      }
    } else {
      // Free default purchases can be empty
      localStorage.setItem('eg_purchases', JSON.stringify([]));
    }

    // 4. Consulting Bookings
    const savedBookings = localStorage.getItem('eg_bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Error parsing saved bookings', e);
      }
    }

    // 5. Notifications state
    const savedNotif = localStorage.getItem('eg_notifications') === '1';
    setNotificationsEnabled(savedNotif);
  }, []);

  // Action: Navigate
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // Action: Intro Seen
  const setIntroSeen = (seen: boolean) => {
    setIntroSeenState(seen);
  };

  // Action: Login
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

  // Action: Logout
  const logout = () => {
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

  // Action: Toggle Notifications
  const toggleNotifications = () => {
    const updated = !notificationsEnabled;
    localStorage.setItem('eg_notifications', updated ? '1' : '0');
    setNotificationsEnabled(updated);
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
      currentUser,
      purchasedSlugs,
      introSeen,
      currentPath,
      routeParams,
      bookings,
      offlineMode,
      notificationsEnabled,
      setIntroSeen,
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
