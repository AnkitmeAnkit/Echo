import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowLeft, Send, X, Shield, CheckCircle2, Smartphone, CreditCard, IndianRupee } from 'lucide-react';

type PaymentMethod = 'upi' | 'card';

interface FormData {
  name: string;
  email: string;
  phone: string;
  problem: string;
}

export const SubmitSolution: React.FC = () => {
  const { navigate, submitProblem, currentUser } = useAppState();

  const [formData, setFormData] = useState<FormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    problem: '',
  });

  // Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Flow state
  const [paying, setPaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handlePayAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      const result = submitProblem({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        problem: formData.problem,
      });
      setPaymentRef(result.paymentRef);
      setPaying(false);
      setShowPaymentModal(false);
      setSubmitted(true);
    }, 1800);
  };

  // ── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[80vh] py-20 bg-canvas flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">Problem Submitted!</h2>
          <p className="text-text-secondary mb-2">
            Your ₹9 registration is confirmed. Our team will review your problem within 24–48 hours.
          </p>
          <p className="text-xs text-text-tertiary font-mono mb-8">Ref: {paymentRef}</p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
              View on Dashboard
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/solutions')}>
              Back to Solutions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ───────────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] py-20 bg-canvas flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-6">
        <button
          onClick={() => navigate('/solutions')}
          className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Solutions
        </button>

        <Card variant="elevated" padding="xl">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold mb-4">Submit Your Problem</h1>
              <p className="text-text-secondary">
                Provide the details of your technical challenge. We'll design a custom playbook or consulting engagement to solve it.
              </p>
              {/* Fee notice */}
              <div className="mt-5 inline-flex items-center gap-2 bg-brand-lavender text-brand-primary px-4 py-2 rounded-full text-sm font-semibold">
                <IndianRupee className="w-4 h-4" />
                ₹9 registration fee required to submit
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Problem Description</label>
                <textarea
                  name="problem"
                  required
                  rows={5}
                  value={formData.problem}
                  onChange={handleFormChange}
                  className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary resize-none"
                  placeholder="Describe the technical bottleneck, architectural challenge, or scale issue you are facing..."
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" icon={<Send className="w-4 h-4" />}>
                Submit Problem — Pay ₹9
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* ── Payment Modal ─────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !paying && setShowPaymentModal(false)}
          />

          {/* Modal Sheet */}
          <div className="relative w-full max-w-md bg-canvas-white rounded-t-3xl md:rounded-2xl shadow-2xl p-8 animate-fade-in-up z-10">
            {/* Close */}
            {!paying && (
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-5 right-5 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest text-brand-primary uppercase mb-1">Registration Fee</p>
              <h2 className="text-2xl font-display font-bold">Pay ₹9 to Submit</h2>
              <p className="text-sm text-text-secondary mt-1">
                One-time fee to register your problem. Your submission will appear on your Dashboard.
              </p>
            </div>

            {/* Amount Badge */}
            <div className="flex items-center justify-between bg-brand-lavender rounded-xl px-5 py-4 mb-6">
              <span className="text-sm font-semibold text-text-primary">Problem Registration</span>
              <span className="text-2xl font-display font-bold text-brand-primary">₹9</span>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex rounded-lg border border-border-light overflow-hidden mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                  paymentMethod === 'upi' ? 'bg-brand-primary text-white' : 'text-text-secondary hover:bg-canvas'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                  paymentMethod === 'card' ? 'bg-brand-primary text-white' : 'text-text-secondary hover:bg-canvas'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card
              </button>
            </div>

            <form onSubmit={handlePayAndSubmit} className="space-y-4">
              {paymentMethod === 'upi' ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">UPI ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full bg-canvas border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm text-text-primary"
                  />
                  <p className="text-xs text-text-tertiary mt-1">e.g. name@paytm · name@gpay · name@ybl</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full bg-canvas border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm text-text-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-primary">Expiry</label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={5}
                        className="w-full bg-canvas border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-primary">CVC</label>
                      <input
                        type="text"
                        required
                        value={cvc}
                        onChange={e => setCvc(e.target.value)}
                        placeholder="123"
                        maxLength={3}
                        className="w-full bg-canvas border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm text-text-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={paying}
                className="w-full bg-brand-primary text-white rounded-xl py-4 font-bold text-sm hover:bg-brand-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {paying ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-4 h-4" />
                    Pay ₹9 &amp; Submit Problem
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-text-tertiary">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure &amp; encrypted payment</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
