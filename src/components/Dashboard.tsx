import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { useAppState } from '../store';
import {
  BookOpen, LogOut, ShieldAlert, Loader2,
  ArrowRight, Library, CalendarDays, Clock,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type SupabaseUser = {
  id?: string;
  email?: string;
  user_metadata?: { full_name?: string };
  created_at?: string;
};

/**
 * Shape of an acquired playbook row.
 * Ready to be swapped for a Supabase `select()` result:
 *   const { data } = await supabase
 *     .from('user_playbooks')
 *     .select('id, title, purchase_date, read_time, status')
 *     .eq('user_id', user.id);
 */
type AcquiredPlaybook = {
  id: string;
  title: string;
  purchase_date: string; // ISO string
  read_time: string;     // e.g. "42 min"
  status: 'unread' | 'in_progress' | 'completed';
};



// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const STATUS_LABEL: Record<AcquiredPlaybook['status'], string> = {
  unread: 'Unread',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const STATUS_STYLE: Record<AcquiredPlaybook['status'], string> = {
  unread: 'bg-surface-soft text-muted',
  in_progress: 'bg-blue-50 text-blue-600',
  completed: 'bg-emerald-50 text-emerald-600',
};

// ── Component ──────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const { navigate, logout } = useAppState();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // Library state — structured for easy Supabase swap
  const [library, setLibrary] = useState<AcquiredPlaybook[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

  // ── Fetch authenticated user ─────────────────────────────────────────────
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

  // ── Fetch acquired playbooks from Supabase ──────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchLibrary = async () => {
      setLibraryLoading(true);

      const { data, error } = await supabase
        .from('user_playbooks')
        .select('id, title, purchase_date, read_time, status')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (!error && data) {
        setLibrary(data as AcquiredPlaybook[]);
      } else {
        console.error('Error fetching library:', error?.message);
        setLibrary([]);
      }

      setLibraryLoading(false);
    };

    fetchLibrary();
  }, [user]);

  // ── Sign out ─────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    logout();
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted animate-spin" />
      </div>
    );
  }

  // ── Unauthenticated guard ─────────────────────────────────────────────────
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

  // ── Authenticated dashboard ───────────────────────────────────────────────
  return (
    <div className="bg-canvas text-ink font-sans pb-24">

      {/* ── Welcome Header ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-hairline"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs text-muted font-semibold uppercase tracking-widest">Member Access</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-muted">
              {user.email}&nbsp;·&nbsp;Member since {memberSince}
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

      {/* ── My Library Section ── */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-12">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <Library className="w-5 h-5 text-muted" />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
            My Library
          </h2>
          {!libraryLoading && (
            <span className="ml-1 bg-surface-card border border-hairline text-muted text-xs font-semibold px-2.5 py-1 rounded-md">
              {library.length} {library.length === 1 ? 'playbook' : 'playbooks'}
            </span>
          )}
        </motion.div>

        {/* ── Library states ── */}
        <AnimatePresence mode="wait">

          {/* Loading skeleton */}
          {libraryLoading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-[88px] bg-surface-soft border border-hairline rounded-xl animate-pulse"
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!libraryLoading && library.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center py-20 border border-dashed border-hairline rounded-xl bg-surface-soft text-center gap-4"
            >
              <BookOpen className="w-10 h-10 text-muted/50" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">No playbooks yet</p>
                <p className="text-xs text-muted max-w-xs">
                  Acquire a playbook from the catalogue and it will appear here instantly.
                </p>
              </div>
              <button
                onClick={() => navigate('/playbooks')}
                className="mt-2 bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-primary-active transition-colors cursor-pointer"
              >
                Browse Playbooks
              </button>
            </motion.div>
          )}

          {/* Populated list */}
          {!libraryLoading && library.length > 0 && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-hairline border border-hairline rounded-xl overflow-hidden"
            >
              {library.map((playbook, index) => (
                <motion.div
                  key={playbook.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.05 * index,
                  }}
                  className="group flex items-center gap-5 px-6 py-5 bg-canvas hover:bg-surface-soft transition-colors duration-200 cursor-default"
                >
                  {/* Icon */}
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-muted group-hover:border-surface-strong transition-colors duration-200">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  {/* Middle: title + meta */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-semibold text-ink text-sm leading-snug truncate">
                      {playbook.title}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <CalendarDays className="w-3 h-3" />
                        Acquired on {formatDate(playbook.purchase_date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {playbook.read_time} read
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md ${STATUS_STYLE[playbook.status]}`}
                      >
                        {STATUS_LABEL[playbook.status]}
                      </span>
                    </div>
                  </div>

                  {/* Right: Read button */}
                  <button
                    onClick={() => navigate(`/reader/${playbook.id}`)}
                    className="shrink-0 inline-flex items-center gap-2 bg-primary text-on-primary text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-primary-active transition-all duration-200 group-hover:gap-3 cursor-pointer"
                  >
                    Read Playbook
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </section>
    </div>
  );
};
