import React, { useState, useEffect } from 'react';
import { useAppState } from '../store';
import { supabase, getPlaybookDownloadLink } from '../supabaseClient';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { BookOpen, Zap, Bell, Users, Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { Playbook, BlogUpdate, Consultation } from '../types';

export function AdminDashboard() {
  const { currentUser, isAdmin, navigate, playbooks, blogUpdates, refreshGlobalData } = useAppState();
  const [activeTab, setActiveTab] = useState<'playbooks' | 'consultations' | 'updates' | 'users'>('playbooks');

  const [allConsultations, setAllConsultations] = useState<Consultation[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Modals / forms states
  const [showPlaybookForm, setShowPlaybookForm] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Partial<Playbook> | null>(null);
  const [editingDriveLink, setEditingDriveLink] = useState('');

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Partial<BlogUpdate> | null>(null);

  useEffect(() => {
    if (currentUser && !isAdmin) {
      navigate('/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    // Fetch all consultations
    const { data: cData } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
    if (cData) setAllConsultations(cData as Consultation[]);

    // Fetch all profiles
    const { data: uData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (uData) setAllUsers(uData);
  };

  // ── Playbooks Handlers ──
  const handleSavePlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlaybook) return;

    if (editingPlaybook.id) {
      // update
      await supabase.from('playbooks').update(editingPlaybook).eq('id', editingPlaybook.id);
      
      // Update drive link
      const { data } = await supabase.from('playbook_files').update({ drive_link: editingDriveLink }).eq('playbook_slug', editingPlaybook.slug).select();
      if (!data || data.length === 0) {
         await supabase.from('playbook_files').insert({ playbook_slug: editingPlaybook.slug, drive_link: editingDriveLink });
      }
    } else {
      // insert
      const { error } = await supabase.from('playbooks').insert(editingPlaybook);
      if (!error && editingDriveLink) {
         const { error: fileError } = await supabase.from('playbook_files').insert({ playbook_slug: editingPlaybook.slug, drive_link: editingDriveLink });
         if (fileError) {
             alert('Playbook added, but failed to save the drive link. Please edit and try again.');
         }
      }
    }
    setShowPlaybookForm(false);
    setEditingPlaybook(null);
    setEditingDriveLink('');
    refreshGlobalData();
  };

  const handleDeletePlaybook = async (id: string) => {
    if (confirm('Are you sure you want to delete this playbook?')) {
      await supabase.from('playbooks').delete().eq('id', id);
      refreshGlobalData();
    }
  };

  // ── Updates Handlers ──
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUpdate?.id) {
      await supabase.from('blog_updates').update(editingUpdate).eq('id', editingUpdate.id);
    } else {
      await supabase.from('blog_updates').insert(editingUpdate);
    }
    setShowUpdateForm(false);
    setEditingUpdate(null);
    refreshGlobalData();
  };

  const handleDeleteUpdate = async (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      await supabase.from('blog_updates').delete().eq('id', id);
      refreshGlobalData();
    }
  };

  // ── Consultations Handlers ──
  const handleUpdateConsultationStatus = async (id: string, status: string) => {
    await supabase.from('consultations').update({ status }).eq('id', id);
    fetchAdminData();
  };

  if (!currentUser || !isAdmin) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-6">You do not have administrative privileges.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'playbooks', icon: <BookOpen className="w-4 h-4" />, label: 'Playbooks' },
    { id: 'consultations', icon: <Zap className="w-4 h-4" />, label: 'Consultations' },
    { id: 'updates', icon: <Bell className="w-4 h-4" />, label: 'Updates' },
    { id: 'users', icon: <Users className="w-4 h-4" />, label: 'Users' },
  ];

  return (
    <div className="w-full bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Admin Console</h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">SUPERUSER ACCESS</p>
          </div>
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === t.id 
                    ? 'bg-brand-primary text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Playbooks Tab */}
        {activeTab === 'playbooks' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Manage Playbooks</h2>
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setEditingPlaybook({}); setEditingDriveLink(''); setShowPlaybookForm(true); }}>
                Add Playbook
              </Button>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title / Slug</th>
                    <th className="px-6 py-4 font-semibold">Track / Price</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {playbooks.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white mb-1">{p.title}</div>
                        <div className="text-xs text-zinc-500 font-mono">{p.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="capitalize mb-1">{p.track}</div>
                        <div className="text-xs font-bold text-brand-primary">₹{p.price}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={async () => { setEditingPlaybook(p); const link = await getPlaybookDownloadLink(p.slug); setEditingDriveLink(link || ''); setShowPlaybookForm(true); }} className="p-2 text-zinc-400 hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => p.id && handleDeletePlaybook(p.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {playbooks.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No playbooks found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">Manage Consultations & Submissions</h2>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">User Details</th>
                    <th className="px-6 py-4 font-semibold">Problem</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {allConsultations.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white mb-1">{c.full_name}</div>
                        <div className="text-xs text-zinc-500">{c.email}</div>
                        <div className="text-xs text-zinc-500">{c.phone}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-brand-primary mb-1 text-xs uppercase tracking-wider">{c.problem_type}</div>
                        <div className="font-bold text-white mb-1 line-clamp-1">{c.problem_title}</div>
                        <div className="text-xs text-zinc-500 line-clamp-2">{c.details}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={c.status}
                          onChange={(e) => handleUpdateConsultationStatus(c.id, e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">In Review</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white mb-1">₹{c.price}</div>
                        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800 inline-block">{c.payment_ref}</div>
                      </td>
                    </tr>
                  ))}
                  {allConsultations.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No consultations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Manage Blog Updates</h2>
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setEditingUpdate({}); setShowUpdateForm(true); }}>
                Add Update
              </Button>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title / Date</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {blogUpdates.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white mb-1">{u.title}</div>
                        <div className="text-xs text-zinc-500">{new Date(u.publishedAt || new Date()).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="lavender">{u.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => { setEditingUpdate(u); setShowUpdateForm(true); }} className="p-2 text-zinc-400 hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => u.id && handleDeleteUpdate(u.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {blogUpdates.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No updates found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">User Directory</h2>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-950/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{u.full_name || 'N/A'}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4 text-zinc-400">{u.phone || '-'}</td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Playbook Form Modal */}
      {showPlaybookForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !bg-zinc-900 !border-zinc-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{editingPlaybook?.id ? 'Edit Playbook' : 'New Playbook'}</h2>
            <form onSubmit={handleSavePlaybook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Title</label>
                  <input type="text" required value={editingPlaybook?.title || ''} onChange={e => setEditingPlaybook({...editingPlaybook, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Slug</label>
                  <input type="text" required value={editingPlaybook?.slug || ''} onChange={e => setEditingPlaybook({...editingPlaybook, slug: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Summary</label>
                <textarea required rows={2} value={editingPlaybook?.summary || ''} onChange={e => setEditingPlaybook({...editingPlaybook, summary: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Track</label>
                  <select value={editingPlaybook?.track || 'design'} onChange={e => setEditingPlaybook({...editingPlaybook, track: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white">
                    <option value="design">Design</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="management">Management</option>
                    <option value="sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Price (₹)</label>
                  <input type="number" required value={editingPlaybook?.price || 0} onChange={e => setEditingPlaybook({...editingPlaybook, price: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Google Drive Link (.html file)</label>
                <input type="url" value={editingDriveLink} onChange={e => setEditingDriveLink(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowPlaybookForm(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Playbook</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto !bg-zinc-900 !border-zinc-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{editingUpdate?.id ? 'Edit Update' : 'New Update'}</h2>
            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Title</label>
                  <input type="text" required value={editingUpdate?.title || ''} onChange={e => setEditingUpdate({...editingUpdate, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Category</label>
                  <input type="text" required value={editingUpdate?.category || ''} onChange={e => setEditingUpdate({...editingUpdate, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white" placeholder="e.g. RELEASE NOTES" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Excerpt</label>
                <textarea required rows={2} value={editingUpdate?.excerpt || ''} onChange={e => setEditingUpdate({...editingUpdate, excerpt: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white resize-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Full Content</label>
                <textarea required rows={5} value={editingUpdate?.fullContent || ''} onChange={e => setEditingUpdate({...editingUpdate, fullContent: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowUpdateForm(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Update</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
