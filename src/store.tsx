import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Playbook, BlogUpdate, Consultation } from './types';
import { supabase } from './supabaseClient';

interface AppContextType {
  currentUser: User | null;
  isAdmin: boolean;
  
  // App Data
  playbooks: Playbook[];
  blogUpdates: BlogUpdate[];
  
  // User Data
  purchasedSlugs: string[];
  wishlistItems: Array<{ item_type: string; item_slug: string }>;
  userConsultations: Consultation[];
  
  // State
  currentPath: string;
  routeParams: Record<string, string>;
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
  
  // Data actions
  acquirePlaybook: (slug: string, isFree: boolean, paymentRef?: string) => Promise<void>;
  hasPurchased: (slug: string) => boolean;
  
  toggleWishlist: (itemType: 'playbook' | 'problem', itemSlug: string) => Promise<void>;
  isWishlisted: (itemType: string, itemSlug: string) => boolean;
  
  submitConsultation: (data: any) => Promise<void>;
  
  saveScrollPosition: (slug: string, progress: number) => void;
  getScrollPosition: (slug: string) => number;
  
  setOfflineMode: (offline: boolean) => void;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  navigate: (path: string) => void;
  saveIntent: (slug: string, price: number) => void;
  getAndClearIntent: () => { slug: string; price: number } | null;
  setAuthModalOpen: (isOpen: boolean) => void;
  redirectAfterAuth: () => void;
  refreshGlobalData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Auth & Admin State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // App Data
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [blogUpdates, setBlogUpdates] = useState<BlogUpdate[]>([]);

  // User Data
  const [purchasedSlugs, setPurchasedSlugs] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Array<{ item_type: string; item_slug: string }>>([]);
  const [userConsultations, setUserConsultations] = useState<Consultation[]>([]);

  const [isLoading, setIsLoadingState] = useState<boolean>(false);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Helper: Route Parser
  const parsePath = (pathname: string) => {
    const path = pathname || '/';
    if (path.startsWith('/playbooks/') && path !== '/playbooks/all') {
      const slug = path.split('/playbooks/')[1].split('?')[0];
      const queryParams = parseQuery(path);
      setCurrentPath('/playbooks/[slug]');
      setRouteParams({ slug, ...queryParams });
      return;
    }
    if (path.startsWith('/reader/')) {
      const slug = path.split('/reader/')[1].split('?')[0];
      setCurrentPath('/reader/[slug]');
      setRouteParams({ slug });
      return;
    }
    if (path.startsWith('/checkout/')) {
      const slug = path.split('/checkout/')[1].split('?')[0];
      setCurrentPath('/checkout/[slug]');
      setRouteParams({ slug });
      return;
    }
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

  useEffect(() => {
    const handlePopState = () => parsePath(window.location.pathname + window.location.search);
    window.addEventListener('popstate', handlePopState);
    parsePath(window.location.pathname + window.location.search);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchGlobalData = async () => {
    const [{ data: pData }, { data: bData }] = await Promise.all([
      supabase.from('playbooks').select('*').eq('is_published', true).order('created_at', { ascending: false }),
      supabase.from('blog_updates').select('*').eq('is_published', true).order('published_at', { ascending: false })
    ]);
    
    if (pData) {
      const mappedPlaybooks = pData.map((p: any) => ({
        ...p,
        coverImage: p.cover_image,
        fullDesc: p.full_desc,
        isPublished: p.is_published,
        createdAt: p.created_at
      }));
      setPlaybooks(mappedPlaybooks);
    }
    
    if (bData) {
      const mappedBlogs = bData.map((b: any) => ({
        ...b,
        fullContent: b.full_content,
        tagColor: b.tag_color,
        coverImage: b.cover_image,
        isPublished: b.is_published,
        publishedAt: b.published_at
      }));
      setBlogUpdates(mappedBlogs);
    }
  };

  // App Mount: Fetch global data
  useEffect(() => {
    fetchGlobalData();
  }, []);

  // Sync Storage & Supabase Auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        const appUser: User = {
          id: supaUser.id,
          email: supaUser.email || '',
          name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'Member',
          role: supaUser.user_metadata?.role || 'Member',
          isPremium: false,
          phone: supaUser.user_metadata?.phone || '',
          joinedAt: supaUser.created_at || new Date().toISOString(),
          savedScrollPositions: {}
        };
        
        try {
          const storedUser = localStorage.getItem('eg_user');
          if (storedUser) {
             const parsed = JSON.parse(storedUser);
             if (parsed.savedScrollPositions) appUser.savedScrollPositions = parsed.savedScrollPositions;
          }
        } catch (e) {}

        localStorage.setItem('eg_user', JSON.stringify(appUser));
        setCurrentUser(appUser);
        
        // Fetch user data
        const [profileRes, purchasesRes, wishlistRes, consultationsRes] = await Promise.all([
          supabase.from('profiles').select('is_admin').eq('id', supaUser.id).single(),
          supabase.from('purchases').select('playbook_slug').eq('user_id', supaUser.id),
          supabase.from('wishlist').select('item_type, item_slug').eq('user_id', supaUser.id),
          supabase.from('consultations').select('*').eq('user_id', supaUser.id).order('submitted_at', { ascending: false })
        ]);

        if (profileRes.data) setIsAdmin(!!profileRes.data.is_admin);
        if (purchasesRes.data) setPurchasedSlugs(purchasesRes.data.map((p: any) => p.playbook_slug));
        if (wishlistRes.data) setWishlistItems(wishlistRes.data);
        if (consultationsRes.data) setUserConsultations(consultationsRes.data);

      } else {
        localStorage.removeItem('eg_user');
        setCurrentUser(null);
        setIsAdmin(false);
        setPurchasedSlugs([]);
        setWishlistItems([]);
        setUserConsultations([]);
      }
    });

    const savedNotif = localStorage.getItem('eg_notifications') === '1';
    setNotificationsEnabled(savedNotif);

    const savedTheme = localStorage.getItem('eg_theme');
    setIsDarkMode(savedTheme === 'dark');

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    parsePath(path);
  };

  const setLoading = (loading: boolean) => setIsLoadingState(loading);

  const login = (email: string, name: string, role: string, isPremium: boolean = false) => {
    // Note: actual auth is handled by Supabase in AuthModal. This just handles redirection.
    if (routeParams.redirect) {
      navigate(routeParams.redirect);
      return;
    }
    const intent = getAndClearIntent();
    if (intent) navigate(`/checkout/${intent.slug}`);
    else navigate('/dashboard');
  };

  const register = (email: string, name: string, role: string) => login(email, name, role, false);

  const redirectAfterAuth = () => {
    if (routeParams.redirect) {
      navigate(routeParams.redirect);
      return;
    }
    const intent = getAndClearIntent();
    if (intent) navigate(`/checkout/${intent.slug}`);
    else navigate('/dashboard');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('eg_user');
    setCurrentUser(null);
    setIsAdmin(false);
    setPurchasedSlugs([]);
    setWishlistItems([]);
    setUserConsultations([]);
    navigate('/');
  };

  const setProfessionalRole = (role: string) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      localStorage.setItem('eg_user', JSON.stringify(updated));
      setCurrentUser(updated);
    }
  };

  // Acquire Playbook
  const acquirePlaybook = async (slug: string, isFree: boolean, paymentRef?: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from('purchases').insert({
      user_id: currentUser.id,
      playbook_slug: slug,
      amount_paid: isFree ? 0 : 9,
      payment_ref: paymentRef || 'free',
      payment_status: 'completed'
    });
    if (!error || error.code === '23505') {
      if (!purchasedSlugs.includes(slug)) {
        setPurchasedSlugs(prev => [...prev, slug]);
      }
    } else {
      console.error("Error acquiring playbook:", error);
    }
  };

  const hasPurchased = (slug: string): boolean => {
    return purchasedSlugs.includes(slug);
  };

  // Toggle Wishlist
  const toggleWishlist = async (itemType: 'playbook' | 'problem', itemSlug: string) => {
    if (!currentUser) return;
    const isW = isWishlisted(itemType, itemSlug);
    
    if (isW) {
      await supabase.from('wishlist').delete().match({ user_id: currentUser.id, item_type: itemType, item_slug: itemSlug });
      setWishlistItems(prev => prev.filter(i => !(i.item_type === itemType && i.item_slug === itemSlug)));
    } else {
      await supabase.from('wishlist').insert({ user_id: currentUser.id, item_type: itemType, item_slug: itemSlug });
      setWishlistItems(prev => [...prev, { item_type: itemType, item_slug: itemSlug }]);
    }
  };

  const isWishlisted = (itemType: string, itemSlug: string): boolean => {
    return wishlistItems.some(i => i.item_type === itemType && i.item_slug === itemSlug);
  };

  // Submit Consultation
  const submitConsultation = async (data: any) => {
    if (!currentUser) return;
    const insertData = {
      ...data,
      user_id: currentUser.id
    };
    const { data: newRow, error } = await supabase.from('consultations').insert(insertData).select().single();
    if (!error && newRow) {
      setUserConsultations(prev => [newRow, ...prev]);
    } else {
      console.error("Error submitting consultation:", error);
    }
  };

  // Save scroll progress locally for reader
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

  const getScrollPosition = (slug: string): number => {
    if (!currentUser || !currentUser.savedScrollPositions) return 0;
    return currentUser.savedScrollPositions[slug] || 0;
  };


  const toggleNotifications = () => {
    const updated = !notificationsEnabled;
    localStorage.setItem('eg_notifications', updated ? '1' : '0');
    setNotificationsEnabled(updated);
  };
  const toggleDarkMode = () => {
    const updated = !isDarkMode;
    localStorage.setItem('eg_theme', updated ? 'dark' : 'light');
    setIsDarkMode(updated);
  };

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
      isAdmin,
      playbooks,
      blogUpdates,
      purchasedSlugs,
      wishlistItems,
      userConsultations,
      isLoading,
      currentPath,
      routeParams,
      offlineMode,
      notificationsEnabled,
      isDarkMode,
      setLoading,
      login,
      register,
      logout,
      setProfessionalRole,
      acquirePlaybook,
      hasPurchased,
      toggleWishlist,
      isWishlisted,
      submitConsultation,
      saveScrollPosition,
      getScrollPosition,
      setOfflineMode,
      toggleNotifications,
      toggleDarkMode,
      navigate,
      saveIntent,
      getAndClearIntent,
      isAuthModalOpen,
      setAuthModalOpen,
      refreshGlobalData: fetchGlobalData
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
