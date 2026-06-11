import React from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { Playbook } from '../types';
import { ShieldAlert, Compass, Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, purchasedSlugs, navigate, getScrollPosition } = useAppState();

  if (!currentUser) {
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

  const purchasedPlaybooks = PLAYBOOKS.filter(p => purchasedSlugs.includes(p.slug));

  const getRoleRecommendations = (role: string): Playbook[] => {
    const unowned = PLAYBOOKS.filter(p => !purchasedSlugs.includes(p.slug));
    if (unowned.length === 0) return [];
    
    if (role.toLowerCase().includes('engineering')) {
      return unowned.filter(p => p.track === 'engineering' || p.track === 'gct');
    }
    if (role.toLowerCase().includes('strategist') || role.toLowerCase().includes('marketing') || role.toLowerCase().includes('design')) {
      return unowned.filter(p => p.track === 'design' || p.track === 'strategy');
    }
    return unowned.slice(0, 2);
  };

  const recommendedPlaybooks = getRoleRecommendations(currentUser.role);

  return (
    <div className="bg-canvas text-ink font-sans pb-24">
      
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 border-b border-hairline-soft">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink">
          Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted">
          <span>Welcome back, <span className="text-ink font-medium">{currentUser.name}</span></span>
          <span className="text-hairline">|</span>
          <span>Role: <span className="text-ink font-medium">{currentUser.role}</span></span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: My Library */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-display text-2xl text-ink font-semibold tracking-tight pb-4 border-b border-hairline">
              Your Playbooks
            </h2>

            {purchasedPlaybooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {purchasedPlaybooks.map((playbook) => {
                  const scrollPctDecimal = getScrollPosition(playbook.slug);
                  const scrollPct = Math.round(scrollPctDecimal * 100);
                  
                  const radius = 24;
                  const strokeWidth = 4;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (scrollPct / 100) * circumference;

                  return (
                    <div 
                      key={playbook.slug}
                      className="border border-hairline bg-surface-card hover:border-surface-strong transition-colors rounded-lg flex flex-col justify-between p-6 shadow-sm min-h-[220px]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <span className="text-xs text-muted font-medium bg-canvas px-2 py-1 rounded-md border border-hairline mb-2 inline-block">
                            {playbook.track}
                          </span>
                          <h3 className="font-semibold text-lg text-ink line-clamp-2 leading-tight">
                            {playbook.title}
                          </h3>
                        </div>

                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              stroke="var(--color-hairline)"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              stroke="var(--color-primary)"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-semibold text-ink">{scrollPct}%</span>
                        </div>
                      </div>

                      <div className="pt-6 mt-auto flex justify-between items-center text-sm">
                        <div className="text-muted">
                          <span className="block text-xs font-medium">Current Progress</span>
                          <span className="text-ink font-medium">Chapter {Math.floor(scrollPctDecimal * playbook.chapters.length) + 1}</span>
                        </div>

                        <button
                          onClick={() => navigate(`/reader/${playbook.slug}`)}
                          className="bg-canvas border border-hairline hover:bg-surface-soft text-ink px-4 py-2 text-sm font-semibold transition-colors rounded-md"
                        >
                          {scrollPct > 0 ? 'Continue' : 'Start'}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-hairline border-dashed bg-surface-soft rounded-lg">
                <p className="text-sm text-muted font-medium mb-4">
                  You haven't acquired any playbooks yet.
                </p>
                <button
                  onClick={() => navigate('/playbooks')}
                  className="text-sm font-semibold text-ink hover:underline"
                >
                  Browse Playbooks
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Recommendations */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-hairline p-6 bg-surface-card rounded-lg shadow-sm space-y-6">
              <div className="flex items-center space-x-2 border-b border-hairline pb-4">
                <Compass className="w-5 h-5 text-muted" />
                <h2 className="font-display text-xl text-ink font-semibold tracking-tight">
                  Recommended for you
                </h2>
              </div>
              
              <div className="space-y-4">
                {recommendedPlaybooks.length > 0 ? (
                  recommendedPlaybooks.map((blueprint) => (
                    <div 
                      key={blueprint.slug}
                      className="border border-hairline bg-canvas hover:border-surface-strong transition-colors p-4 rounded-md cursor-pointer shadow-sm group flex flex-col justify-between"
                      onClick={() => navigate(`/playbooks/${blueprint.slug}`)}
                    >
                      <div>
                        <span className="text-xs text-muted font-medium mb-1 block">{blueprint.track} track</span>
                        <h4 className="font-semibold text-sm text-ink group-hover:underline line-clamp-1">
                          {blueprint.title}
                        </h4>
                        <p className="text-xs text-muted line-clamp-1 mt-1">
                          {blueprint.summary}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 bg-canvas border border-hairline rounded-md text-xs text-muted font-medium">
                    You have acquired all available playbooks.
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="border border-hairline p-6 bg-canvas rounded-lg shadow-sm space-y-4 text-sm text-ink">
              <span className="block text-ink font-semibold border-b border-hairline pb-4 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Account Security</span>
              </span>
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="font-medium truncate ml-4">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Joined</span>
                <span className="font-medium">{new Date(currentUser.joinedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Auth Status</span>
                <span className="font-medium text-success bg-surface-soft px-2 py-0.5 rounded text-xs">Secure</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
