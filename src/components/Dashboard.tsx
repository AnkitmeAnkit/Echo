import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../supabaseClient';
import { useAppState } from '../store';
import { BookOpen, CalendarClock, Settings, LogOut, ShieldAlert, Loader2 } from 'lucide-react';

type SupabaseUser = {
  email?: string;
  user_metadata?: { full_name?: string };
  created_at?: string;
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const Dashboard: React.FC = () => {
  const { navigate, logout } = useAppState();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    logout(); // clear local store state & navigate to '/'
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  // ── Unauthenticated guard ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="py-24 max-w-sm mx-auto text-center px-6">
        <ShieldAlert className="w-12 h-12 text-error mx-auto mb-4" />
        <p className="text-error text-sm font-semibold mb-2">Unauthorized Access</p>
        <p className="text-sm text-muted mb-8">Please sign in to view your dashboard.</p>
        <button
          onClick={() => {
            const loginTrigger = document.getElementById('login-trigger-btn');
            if (loginTrigger) loginTrigger.click();
          }}
          className="bg-primary text-on-primary py-3 px-6 text-sm font-semibold block w-full hover:bg-primary-active transition-colors rounded-md cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Member';

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  // ── Placeholder section card ───────────────────────────────────────────────
  const PlaceholderCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
  }> = ({ icon, title, description, delay }) => (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className="bg-surface-card border border-hairline rounded-xl p-8 flex flex-col gap-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-muted">
          {icon}
        </div>
        <h2 className="font-display text-xl font-semibold text-ink tracking-tight">{title}</h2>
      </div>

      <div className="flex-1 border border-dashed border-hairline rounded-lg bg-canvas flex flex-col items-center justify-center py-14 gap-3">
        <p className="text-sm text-muted font-medium">Nothing here yet.</p>
        <p className="text-xs text-muted/70 text-center max-w-[200px]">{description}</p>
      </div>
    </motion.div>
  );

  // ── Authenticated dashboard ────────────────────────────────────────────────
  return (
    <div className="bg-canvas text-ink font-sans pb-24">

      {/* ── Welcome Header ── */}
      <motion.section
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-hairline"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted font-semibold uppercase tracking-widest">Member Access</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-muted">
              {user.email} &nbsp;·&nbsp; Member since {memberSince}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 border border-hairline bg-canvas hover:bg-surface-soft text-ink text-sm font-semibold px-5 py-2.5 rounded-md transition-colors disabled:opacity-60 cursor-pointer self-start sm:self-auto shrink-0"
          >
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Sign Out
          </button>
        </div>
      </motion.section>

      {/* ── Placeholder Sections Grid ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <PlaceholderCard
            icon={<BookOpen className="w-5 h-5" />}
            title="My Custom Playbooks"
            description="Your requested custom AI playbooks will appear here once delivered."
            delay={0.1}
          />

          <PlaceholderCard
            icon={<CalendarClock className="w-5 h-5" />}
            title="My Consultancy Sessions"
            description="Upcoming and past 1-on-1 consulting sessions will be listed here."
            delay={0.2}
          />

          <PlaceholderCard
            icon={<Settings className="w-5 h-5" />}
            title="Account Settings"
            description="Manage your profile, email preferences, and security settings here."
            delay={0.3}
          />

        </div>
      </section>

    </div>
  );
};
