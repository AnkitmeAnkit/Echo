import React, { useEffect, useState } from 'react';
import { useAppState } from '../store';
import { supabase } from '../supabaseClient';
import { Playbook, BlogUpdate, Consultation, User } from '../types';
import { LayoutDashboard, BookOpen, FileText, MessageSquare, Users, LogOut, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

type Section = 'overview' | 'playbooks' | 'updates' | 'solutions' | 'users';

export function AdminDashboard() {
  const { currentUser, isAdmin, navigate } = useAppState();
  const [isChecking, setIsChecking] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('overview');

  useEffect(() => {
    // Allow some time for Supabase to fetch profile and set isAdmin
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!currentUser || !isAdmin) {
        navigate('/');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentUser, isAdmin, navigate]);

  if (isChecking || !currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-zinc-500 text-sm font-mono tracking-widest uppercase">Verifying Clearance...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'playbooks': return <PlaybooksSection />;
      case 'updates': return <UpdatesSection />;
      case 'solutions': return <SolutionsSection />;
      case 'users': return <UsersSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row w-full font-sans text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-[220px] bg-black border-r border-zinc-800/50 flex-shrink-0 flex flex-col min-h-screen sticky top-0">
        <div className="p-6 border-b border-zinc-800/50 flex items-center gap-3">
          <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase rounded">Admin</div>
          <span className="font-display font-bold tracking-tight text-white">PANEL</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} />
          <SidebarItem icon={<BookOpen className="w-4 h-4" />} label="Playbooks" active={activeSection === 'playbooks'} onClick={() => setActiveSection('playbooks')} />
          <SidebarItem icon={<FileText className="w-4 h-4" />} label="Updates" active={activeSection === 'updates'} onClick={() => setActiveSection('updates')} />
          <SidebarItem icon={<MessageSquare className="w-4 h-4" />} label="Solutions" active={activeSection === 'solutions'} onClick={() => setActiveSection('solutions')} />
          <SidebarItem icon={<Users className="w-4 h-4" />} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} />
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-end px-8">
          <div className="text-sm text-zinc-400 font-medium">
            {currentUser.email}
          </div>
        </header>

        {/* Dynamic Section */}
        <div className="p-8 pb-24">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left w-full
        ${active 
          ? 'bg-zinc-900 text-white border-l-2 border-brand-primary' 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border-l-2 border-transparent'
        }`}
    >
      <span className={active ? 'text-brand-primary' : 'text-zinc-500'}>{icon}</span>
      {label}
    </button>
  );
}

function SectionLoader() {
  return (
    <div className="w-full flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                OVERVIEW                                    */
/* -------------------------------------------------------------------------- */

function OverviewSection() {
  const [stats, setStats] = useState({ playbooks: 0, sales: 0, pending: 0, users: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      const [pbRes, purRes, conRes, usrRes, recentRes] = await Promise.all([
        supabase.from('playbooks').select('id', { count: 'exact', head: true }),
        supabase.from('purchases').select('id', { count: 'exact', head: true }),
        supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('consultations').select('full_name, problem_title, submitted_at, status').order('submitted_at', { ascending: false }).limit(5)
      ]);

      setStats({
        playbooks: pbRes.count || 0,
        sales: purRes.count || 0,
        pending: conRes.count || 0,
        users: usrRes.count || 0,
      });

      if (recentRes.data) setRecent(recentRes.data);
      setLoading(false);
    }
    loadOverview();
  }, []);

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Playbooks" value={stats.playbooks} icon={<BookOpen className="w-6 h-6 text-brand-primary" />} />
        <StatCard label="Total Sales" value={stats.sales} icon={<FileText className="w-6 h-6 text-brand-primary" />} />
        <StatCard label="Pending Solutions" value={stats.pending} icon={<MessageSquare className="w-6 h-6 text-brand-primary" />} />
        <StatCard label="Total Users" value={stats.users} icon={<Users className="w-6 h-6 text-brand-primary" />} />
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        {recent.length === 0 ? (
          <p className="text-zinc-500">No recent consultations.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wider
                    ${r.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30' 
                    : r.status === 'in_review' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/30' 
                    : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'}`}>
                    {r.status}
                  </div>
                  <div>
                    <span className="font-medium text-zinc-200">{r.full_name}</span>
                    <span className="text-zinc-500 mx-2">•</span>
                    <span className="text-zinc-400">{r.problem_title}</span>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  {new Date(r.submitted_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-6 right-6 opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-zinc-400 font-medium">{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PLAYBOOKS                                    */
/* -------------------------------------------------------------------------- */

function PlaybooksSection() {
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPb, setEditingPb] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPlaybooks = async () => {
    setLoading(true);
    const { data } = await supabase.from('playbooks').select('*').order('created_at', { ascending: false });
    if (data) setPlaybooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaybooks();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setPlaybooks(prev => prev.map(p => p.id === id ? { ...p, is_published: newStatus } : p));
    await supabase.from('playbooks').update({ is_published: newStatus }).eq('id', id);
  };

  const handleDelete = async (id: string, slug: string, title: string) => {
    if (!window.confirm(`Delete '${title}'? This cannot be undone.`)) return;
    setPlaybooks(prev => prev.filter(p => p.id !== id));
    await supabase.from('playbook_files').delete().eq('playbook_slug', slug);
    await supabase.from('playbooks').delete().eq('id', id);
  };

  const openEdit = (pb: any) => {
    setEditingPb(pb);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingPb(null);
    setShowForm(true);
  };

  if (showForm) {
    return <PlaybookForm pb={editingPb} onBack={() => { setShowForm(false); fetchPlaybooks(); }} />;
  }

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Playbooks</h2>
        <button onClick={openAdd} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Playbook
        </button>
      </div>

      {playbooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-4">No playbooks yet.</p>
          <button onClick={openAdd} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90">
            Create First Playbook
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {playbooks.map(pb => (
            <div key={pb.id} className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  {pb.cover_image ? <img src={pb.cover_image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-zinc-800" />}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{pb.title}</div>
                  <div className="text-sm text-zinc-400 truncate">{pb.subtitle || pb.slug}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-2">
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">{pb.track || 'No track'}</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">₹{pb.price}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTogglePublish(pb.id, pb.is_published)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      pb.is_published ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500 bg-zinc-800/50'
                    }`}
                  >
                    {pb.is_published ? 'Published' : 'Hidden'}
                  </button>
                  <button onClick={() => openEdit(pb)} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(pb.id, pb.slug, pb.title)} className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors border border-red-400/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaybookForm({ pb, onBack }: { pb: any, onBack: () => void }) {
  const isEdit = !!pb;
  const [formData, setFormData] = useState({
    title: pb?.title || '',
    slug: pb?.slug || '',
    subtitle: pb?.subtitle || '',
    track: pb?.track || '',
    price: pb?.price || 0,
    featured: pb?.featured || false,
    cover_image: pb?.cover_image || '',
    summary: pb?.summary || '',
    full_desc: pb?.full_desc || '',
    drive_link: '',
    is_published: pb ? pb.is_published : true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit && pb.slug) {
      supabase.from('playbook_files').select('drive_link').eq('playbook_slug', pb.slug).single().then(({ data }) => {
        if (data) setFormData(f => ({ ...f, drive_link: data.drive_link }));
      });
    }
  }, [isEdit, pb]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!isEdit && !formData.slug) {
      const genSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData({ ...formData, title: newTitle, slug: genSlug });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      const playbookData = {
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle,
        track: formData.track,
        price: Number(formData.price),
        featured: formData.featured,
        cover_image: formData.cover_image,
        summary: formData.summary,
        full_desc: formData.full_desc,
        is_published: formData.is_published,
        chapters: pb?.chapters || []
      };

      if (isEdit) {
        const { error: pbErr } = await supabase.from('playbooks').update(playbookData).eq('id', pb.id);
        if (pbErr) throw pbErr;

        const { data: fileData } = await supabase.from('playbook_files').select('playbook_slug').eq('playbook_slug', formData.slug).single();
        if (fileData) {
          const { error: fErr } = await supabase.from('playbook_files').update({ drive_link: formData.drive_link }).eq('playbook_slug', formData.slug);
          if (fErr) throw fErr;
        } else {
          const { error: fErr2 } = await supabase.from('playbook_files').insert({ playbook_slug: formData.slug, drive_link: formData.drive_link });
          if (fErr2) throw fErr2;
        }
      } else {
        const { error: pbErr } = await supabase.from('playbooks').insert(playbookData);
        if (pbErr) throw pbErr;

        const { error: fErr } = await supabase.from('playbook_files').insert({ playbook_slug: formData.slug, drive_link: formData.drive_link });
        if (fErr) throw fErr;
      }

      setSuccess(isEdit ? 'Updated! ✓' : 'Playbook saved! ✓');
      setTimeout(() => onBack(), 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <button onClick={onBack} className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-2">
        &larr; Back to Playbooks
      </button>
      
      <h2 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Playbook' : 'Add New Playbook'}</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Title <span className="text-red-400">*</span></label>
          <input type="text" required value={formData.title} onChange={handleTitleChange} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Slug <span className="text-red-400">*</span></label>
          <input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} disabled={isEdit} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full disabled:opacity-50" />
          <p className="text-zinc-500 text-xs mt-1">Auto-generated from title. Edit if needed. (Cannot edit slug after creation)</p>
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Subtitle</label>
          <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Track</label>
            <input type="text" value={formData.track} onChange={e => setFormData({ ...formData, track: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
          </div>
          <div>
            <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Price (₹)</label>
            <input type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
            <p className="text-zinc-500 text-xs mt-1">Set 0 for a free playbook</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="featured" className="text-zinc-300 text-sm font-medium">Show as Featured on homepage</label>
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Cover Image URL</label>
          <input type="url" placeholder="https://..." value={formData.cover_image} onChange={e => setFormData({ ...formData, cover_image: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
          <p className="text-zinc-500 text-xs mt-1">Paste a direct image URL (from Unsplash, Drive, etc.)</p>
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Summary</label>
          <textarea rows={3} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full resize-none" />
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Full Description</label>
          <textarea rows={6} value={formData.full_desc} onChange={e => setFormData({ ...formData, full_desc: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full resize-none" />
        </div>

        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Google Drive Link (your .html playbook file) <span className="text-red-400">*</span></label>
          <input type="url" required placeholder="https://drive.google.com/file/d/.../view" value={formData.drive_link} onChange={e => setFormData({ ...formData, drive_link: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
          <p className="text-yellow-500/80 text-xs mt-1 flex items-center gap-1">⚠ This link is stored securely and only shown to users who have access.</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="published" className="text-zinc-300 text-sm font-medium">Make this playbook visible on the site right now</label>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Playbook'}
          </button>
          <button type="button" onClick={onBack} className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2.5 rounded-xl hover:bg-zinc-700">
            Cancel
          </button>
          {success && <span className="text-emerald-400 text-sm ml-auto">{success}</span>}
          {error && <span className="text-red-400 text-sm ml-auto">{error}</span>}
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                UPDATES                                     */
/* -------------------------------------------------------------------------- */

function UpdatesSection() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUpd, setEditingUpd] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUpdates = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_updates').select('*').order('published_at', { ascending: false });
    if (data) setUpdates(data);
    setLoading(false);
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, is_published: newStatus } : u));
    await supabase.from('blog_updates').update({ is_published: newStatus }).eq('id', id);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete '${title}'? This cannot be undone.`)) return;
    setUpdates(prev => prev.filter(u => u.id !== id));
    await supabase.from('blog_updates').delete().eq('id', id);
  };

  if (showForm) {
    return <UpdateForm upd={editingUpd} onBack={() => { setShowForm(false); fetchUpdates(); }} />;
  }

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Blog Updates</h2>
        <button onClick={() => { setEditingUpd(null); setShowForm(true); }} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Update
        </button>
      </div>

      {updates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-4">No updates yet.</p>
          <button onClick={() => { setEditingUpd(null); setShowForm(true); }} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90">
            Create First Update
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map(upd => (
            <div key={upd.id} className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{upd.title}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-300">{upd.category || 'Uncategorized'}</span>
                    <span className="text-zinc-500 text-xs font-mono">{new Date(upd.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTogglePublish(upd.id, upd.is_published)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      upd.is_published ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500 bg-zinc-800/50'
                    }`}
                  >
                    {upd.is_published ? 'Published' : 'Hidden'}
                  </button>
                  <button onClick={() => { setEditingUpd(upd); setShowForm(true); }} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(upd.id, upd.title)} className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors border border-red-400/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UpdateForm({ upd, onBack }: { upd: any, onBack: () => void }) {
  const isEdit = !!upd;
  const [formData, setFormData] = useState({
    title: upd?.title || '',
    slug: upd?.slug || '',
    category: upd?.category || '',
    excerpt: upd?.excerpt || '',
    full_content: upd?.full_content || '',
    tag_color: upd?.tag_color || 'blue',
    cover_image: upd?.cover_image || '',
    is_published: upd ? upd.is_published : true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!isEdit && !formData.slug) {
      const genSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData({ ...formData, title: newTitle, slug: genSlug });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const updateData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        excerpt: formData.excerpt,
        full_content: formData.full_content,
        tag_color: formData.tag_color,
        cover_image: formData.cover_image,
        is_published: formData.is_published,
        published_at: isEdit ? upd.published_at : new Date().toISOString()
      };

      if (isEdit) {
        const { error: err } = await supabase.from('blog_updates').update(updateData).eq('id', upd.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('blog_updates').insert(updateData);
        if (err) throw err;
      }
      setSuccess('Saved! ✓');
      setTimeout(() => onBack(), 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <button onClick={onBack} className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-2">
        &larr; Back to Updates
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">{isEdit ? 'Edit Update' : 'Add New Update'}</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Title <span className="text-red-400">*</span></label>
          <input type="text" required value={formData.title} onChange={handleTitleChange} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Slug <span className="text-red-400">*</span></label>
          <input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} disabled={isEdit} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full disabled:opacity-50" />
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Category</label>
          <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Excerpt</label>
          <textarea rows={3} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full resize-none" />
          <p className="text-zinc-500 text-xs mt-1">This is the short preview text shown on the updates page.</p>
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Full Content</label>
          <textarea rows={12} value={formData.full_content} onChange={e => setFormData({ ...formData, full_content: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full resize-none font-mono text-sm" />
          <p className="text-zinc-500 text-xs mt-1">Write the complete article content here.</p>
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Tag Color</label>
          <select value={formData.tag_color} onChange={e => setFormData({ ...formData, tag_color: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary w-full">
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
          </select>
        </div>
        <div>
          <label className="text-zinc-300 text-sm font-medium mb-1.5 block">Cover Image URL</label>
          <input type="url" placeholder="https://..." value={formData.cover_image} onChange={e => setFormData({ ...formData, cover_image: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-primary w-full" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="publishedUpd" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="publishedUpd" className="text-zinc-300 text-sm font-medium">Publish Immediately</label>
        </div>
        <div className="pt-4 flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Update'}
          </button>
          <button type="button" onClick={onBack} className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2.5 rounded-xl hover:bg-zinc-700">Cancel</button>
          {success && <span className="text-emerald-400 text-sm ml-auto">{success}</span>}
          {error && <span className="text-red-400 text-sm ml-auto">{error}</span>}
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SOLUTIONS                                     */
/* -------------------------------------------------------------------------- */

function SolutionsSection() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    async function loadConsultations() {
      const { data } = await supabase.from('consultations').select('*').order('submitted_at', { ascending: false });
      if (data) setConsultations(data);
      setLoading(false);
    }
    loadConsultations();
  }, []);

  const counts = {
    all: consultations.length,
    pending: consultations.filter(c => c.status === 'pending').length,
    in_review: consultations.filter(c => c.status === 'in_review').length,
    resolved: consultations.filter(c => c.status === 'resolved').length
  };

  const filtered = filter === 'all' ? consultations : consultations.filter(c => c.status === filter);

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">User Consultations</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${counts.all})`} />
        <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')} label={`Pending (${counts.pending})`} />
        <FilterBtn active={filter === 'in_review'} onClick={() => setFilter('in_review')} label={`In Review (${counts.in_review})`} />
        <FilterBtn active={filter === 'resolved'} onClick={() => setFilter('resolved')} label={`Resolved (${counts.resolved})`} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No consultations found in this category.</div>
      ) : (
        <div className="space-y-6">
          {filtered.map(c => <ConsultationCard key={c.id} data={c} />)}
        </div>
      )}
    </div>
  );
}

function FilterBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800/50 hover:bg-zinc-900'}`}>
      {label}
    </button>
  );
}

function ConsultationCard({ data }: { data: any; key?: any }) {
  const [status, setStatus] = useState(data.status);
  const [note, setNote] = useState(data.admin_note || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('consultations').update({ status, admin_note: note }).eq('id', data.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const statusColors: any = {
    pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
    in_review: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    resolved: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${statusColors[status]}`}>
          {status.replace('_', ' ')}
        </div>
        <div className="text-sm text-zinc-500 font-mono">Submitted: {new Date(data.submitted_at).toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-1">User Info</div>
          <div className="text-zinc-200"><span className="text-zinc-500 mr-2">Name:</span> {data.full_name}</div>
          <div className="text-zinc-200"><span className="text-zinc-500 mr-2">Email:</span> {data.email}</div>
          <div className="text-zinc-200"><span className="text-zinc-500 mr-2">Phone:</span> {data.phone || '—'}</div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-1">Payment Info</div>
          <div className="text-zinc-200"><span className="text-zinc-500 mr-2">Paid:</span> ₹{data.amount_paid}</div>
          <div className="text-zinc-200"><span className="text-zinc-500 mr-2">Ref:</span> {data.payment_ref}</div>
          <div className="text-emerald-400 mt-1 flex items-center gap-1 text-sm"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> {data.payment_status}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-1">Problem</div>
        <div className="text-white font-medium mb-2">{data.problem_title} <span className="text-zinc-500 text-sm ml-2">({data.problem_type})</span></div>
        <div className="text-zinc-300 text-sm leading-relaxed p-4 bg-zinc-950 rounded-lg whitespace-pre-wrap">{data.details}</div>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-2">Admin Actions</div>
        <textarea 
          placeholder="Add internal notes here..." 
          rows={3} 
          value={note} 
          onChange={e => setNote(e.target.value)} 
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-primary w-full resize-none mb-4"
        />
        <div className="flex items-center gap-4">
          <select value={status} onChange={e => setStatus(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-primary">
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="bg-brand-primary text-black font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  USERS                                     */
/* -------------------------------------------------------------------------- */

function UsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase.from('profiles').select('id, full_name, email, phone, is_admin, created_at').order('created_at', { ascending: false });
      if (data) setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  if (loading) return <SectionLoader />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Users</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 rounded-tr-lg">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="bg-zinc-900 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.full_name || '—'}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    {u.is_admin ? <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded uppercase tracking-wider">Admin</span> : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
