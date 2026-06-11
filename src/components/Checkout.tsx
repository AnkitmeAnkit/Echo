import React, { useState, useEffect } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { CreditCard, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { routeParams, purchasedSlugs, currentUser, acquirePlaybook, navigate, toggleNotifications, notificationsEnabled } = useAppState();
  
  const slug = routeParams.slug || '';
  const playbook = PLAYBOOKS.find(p => p.slug === slug);

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/29');
  const [cvc, setCvc] = useState('424');
  const [nameOnCard, setNameOnCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState<'cc' | 'saved'>('cc');

  useEffect(() => {
    if (currentUser) {
      setNameOnCard(currentUser.name);
      setActiveTab('saved');
    }
  }, [currentUser]);

  if (!playbook) {
    return (
      <div className="py-24 max-w-sm mx-auto text-center px-6">
        <p className="text-error font-semibold text-sm mb-4">Invalid playbook route.</p>
        <button onClick={() => navigate('/playbooks')} className="text-ink font-semibold hover:underline text-sm">
          Return to Playbooks
        </button>
      </div>
    );
  }

  const isAlreadyOwned = purchasedSlugs.includes(playbook.slug);

  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPurchased(true);
      acquirePlaybook(playbook.slug);
      
      if (!notificationsEnabled) {
        toggleNotifications();
      }
    }, 1500);
  };

  return (
    <div className="bg-canvas text-ink font-sans pb-24">
      
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-8 border-b border-hairline-soft">
        <div className="inline-block bg-surface-soft px-3 py-1 rounded-pill text-xs font-medium text-muted mb-4 border border-hairline">
          Secure Checkout
        </div>
        <h1 className="font-display text-3xl md:text-5xl tracking-tight text-ink font-semibold">
          Complete Purchase
        </h1>
        <p className="text-body text-lg mt-2">
          Get instant access to full documentation and resources.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        {isAlreadyOwned && !purchased ? (
          <div className="bg-surface-card border border-hairline rounded-lg p-8 text-center space-y-6">
            <p className="text-success text-sm font-semibold">You already own this playbook.</p>
            <p className="text-sm text-body">Full access is active on your account.</p>
            <button
              onClick={() => navigate(`/reader/${playbook.slug}`)}
              className="bg-primary text-on-primary hover:bg-primary-active py-3 px-6 rounded-md font-semibold text-sm transition-colors"
            >
              Open Playbook
            </button>
          </div>
        ) : purchased ? (
          <div className="bg-surface-card border border-hairline rounded-lg p-8 text-center space-y-8 shadow-sm">
            <div className="flex justify-center text-success">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-3xl text-ink font-semibold tracking-tight">
                Purchase successful
              </h2>
              <p className="text-sm text-body">
                A receipt has been sent to your email.
              </p>
            </div>

            <div className="bg-canvas border border-hairline rounded-md p-6 text-sm text-ink text-left space-y-4">
              <div className="flex justify-between border-b border-hairline pb-4">
                <span className="text-muted">Transaction ID:</span>
                <span className="font-medium">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Item:</span>
                <span className="font-semibold">{playbook.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Amount:</span>
                <span className="font-semibold">${playbook.price} USD</span>
              </div>
            </div>

            {notificationsEnabled && (
              <div className="bg-surface-soft border border-hairline rounded-md p-4 text-xs text-muted font-medium text-left">
                Notifications are enabled. We'll update you on new playbook releases.
              </div>
            )}

            <button
              onClick={() => navigate(`/reader/${playbook.slug}`)}
              className="w-full bg-primary text-on-primary hover:bg-primary-active py-4 rounded-md font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Open Reader</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <div className="md:col-span-5 space-y-6">
              <div className="border border-hairline bg-surface-card rounded-lg p-6 shadow-sm">
                <span className="text-xs text-muted font-semibold block mb-2">Order Summary</span>
                <h3 className="font-display text-xl text-ink font-semibold leading-tight">
                  {playbook.title}
                </h3>
                <p className="text-sm text-body leading-relaxed mt-2 mb-6 border-b border-hairline pb-6">
                  {playbook.subtitle}
                </p>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted">Total Due:</span>
                  <span className="text-2xl font-display font-semibold text-ink">${playbook.price}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="border border-hairline bg-surface-card rounded-lg p-8 shadow-sm">
                <div className="flex space-x-6 border-b border-hairline pb-4 mb-6 text-sm font-semibold">
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('saved')}
                      className={`${activeTab === 'saved' ? 'text-ink border-b-2 border-ink pb-4 -mb-4.5' : 'text-muted'}`}
                    >
                      Saved Card
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('cc')}
                    className={`${activeTab === 'cc' ? 'text-ink border-b-2 border-ink pb-4 -mb-4.5' : 'text-muted'}`}
                  >
                    Credit Card
                  </button>
                </div>

                <form onSubmit={handleProcessTransaction} className="space-y-6">
                  {activeTab === 'saved' ? (
                    <div className="space-y-4 text-sm">
                      <div className="bg-canvas border border-hairline p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-muted" />
                          <div>
                            <div className="font-semibold text-ink">Mastercard ending in 4242</div>
                            <div className="text-muted text-xs">Expires 12/29</div>
                          </div>
                        </div>
                        <span className="text-success bg-surface-soft px-2 py-1 text-xs font-semibold rounded-md">Ready</span>
                      </div>
                      <p className="text-sm text-body leading-relaxed">
                        Use your saved payment method for a faster checkout experience.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 text-sm">
                      <div className="space-y-2">
                        <label className="block font-medium text-ink">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                          <input 
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block font-medium text-ink">Expiry</label>
                          <input 
                            type="text"
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-canvas border border-hairline px-4 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block font-medium text-ink">CVC</label>
                          <input 
                            type="text"
                            required
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="123"
                            className="w-full bg-canvas border border-hairline px-4 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block font-medium text-ink">Name on Card</label>
                        <input 
                          type="text"
                          required
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-on-primary hover:bg-primary-active py-3 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : `Pay $${playbook.price}`}
                    </button>

                    <div className="flex items-center justify-center space-x-2 text-xs text-muted font-medium">
                      <Shield className="w-4 h-4" />
                      <span>Payments are secure and encrypted.</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
          </div>
        )}
      </section>

    </div>
  );
};
