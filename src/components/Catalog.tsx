import React, { useState } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { PlaybookTrack } from '../types';
import { Search } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { navigate, currentUser, purchasedSlugs, saveIntent, setAuthModalOpen } = useAppState();
  const [selectedTrack, setSelectedTrack] = useState<PlaybookTrack | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTrackSelect = (track: PlaybookTrack | 'all') => {
    setSelectedTrack(track);
  };

  const filteredPlaybooks = PLAYBOOKS.filter(p => {
    const matchesTrack = selectedTrack === 'all' || p.track === selectedTrack;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTrack && matchesSearch;
  });

  const handleAcquire = (slug: string, price: number) => {
    if (!currentUser) {
      saveIntent(slug, price);
      // Trigger Member Access modal
      setAuthModalOpen(true);
    } else {
      navigate(`/checkout/${slug}`);
    }
  };

  return (
    <div className="bg-canvas text-ink font-sans pb-24">
      
      {/* Header section */}
      <section className="w-full px-6 md:px-10 pt-24 pb-12 border-b border-hairline-soft">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink">
          Playbooks
        </h1>
        <p className="text-body text-lg mt-4 max-w-2xl">
          Detailed operational guides, system architecture documentation, and high-fidelity design standards.
        </p>
      </section>

      {/* Filters and Search */}
      <section className="w-full px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Nav pill group for filters */}
        <div className="inline-flex bg-surface-soft p-1.5 rounded-pill space-x-1 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => handleTrackSelect('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrack === 'all' ? 'bg-canvas text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
          >
            All
          </button>
          <button
            onClick={() => handleTrackSelect('engineering')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrack === 'engineering' ? 'bg-canvas text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
          >
            Engineering
          </button>
          <button
            onClick={() => handleTrackSelect('design')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrack === 'design' ? 'bg-canvas text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
          >
            Design
          </button>
          <button
            onClick={() => handleTrackSelect('strategy')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrack === 'strategy' ? 'bg-canvas text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
          >
            Strategy
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search playbooks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* Grid */}
      <section className="w-full px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaybooks.slice(0, 1).map((playbook, index) => {
            const hasPurchased = purchasedSlugs.includes(playbook.slug);
            return (
              <div 
                key={playbook.slug}
                className="bg-surface-card rounded-lg p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="inline-block bg-canvas px-3 py-1 rounded-pill text-xs font-medium border border-hairline text-muted">
                    {playbook.track} Track
                  </div>

                  {hasPurchased && (
                    <div className="inline-block bg-surface-soft px-3 py-1 rounded-pill text-xs font-medium border border-hairline text-success ml-2">
                      Active Access
                    </div>
                  )}
                  
                  <h3 className="font-display text-2xl font-semibold text-ink tracking-tight">
                    {playbook.title}
                  </h3>
                  <p className="text-sm font-medium text-muted">
                    {playbook.subtitle}
                  </p>
                  <p className="text-body text-sm leading-relaxed mt-4">
                    {playbook.summary}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between">
                  <div>
                    <span className="font-display text-2xl font-semibold text-ink">₹{playbook.price}</span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/playbooks/${playbook.slug}`)}
                      className="bg-canvas border border-hairline hover:bg-surface-soft px-4 py-2 rounded-md text-sm font-semibold text-ink transition-colors"
                    >
                      View
                    </button>

                    {hasPurchased ? (
                      <button
                        onClick={() => navigate(`/reader/${playbook.slug}`)}
                        className="bg-primary text-on-primary hover:bg-primary-active px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Open
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAcquire(playbook.slug, playbook.price)}
                        className="bg-primary text-on-primary hover:bg-primary-active px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                      >
                        Acquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlaybooks.length === 0 && (
          <div className="text-center py-24 bg-surface-soft rounded-lg mt-6">
            <p className="text-muted text-sm font-medium">No playbooks found matching your criteria.</p>
            <button
              onClick={() => { handleTrackSelect('all'); setSearchQuery(''); }}
              className="mt-4 text-sm font-semibold text-ink hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
