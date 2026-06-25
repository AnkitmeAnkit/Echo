import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowLeft, Send, CheckCircle2, IndianRupee } from 'lucide-react';
import { PaywallModal } from './PaywallModal';

interface FormData {
  name: string;
  email: string;
  phone: string;
  problem: string;
}

export const SubmitSolution: React.FC = () => {
  const { navigate, currentUser } = useAppState();

  const [formData, setFormData] = useState<FormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    problem: '',
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  const handleSuccess = () => {
    setShowPaymentModal(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] py-20 bg-canvas dark:bg-black flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-text-primary dark:text-white mb-3">Problem Submitted!</h2>
          <p className="text-text-secondary dark:text-zinc-400 mb-8">
            Your ₹9 registration is confirmed. Our team will review your problem within 24–48 hours. Check your dashboard for updates.
          </p>
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

  return (
    <div className="min-h-[80vh] py-20 bg-canvas dark:bg-black flex items-center justify-center relative">
      <PaywallModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        itemType="consultation"
        itemSlug="custom-problem"
        itemTitle="Custom Problem Registration"
        price={9}
        consultationFormData={{
          problem_title: 'Custom Submission',
          problem_type: 'custom',
          details: formData.problem,
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone
        }}
        onSuccess={handleSuccess}
      />

      <div className="max-w-3xl w-full mx-auto px-6 relative z-10">
        <button
          onClick={() => navigate('/solutions')}
          className="flex items-center gap-2 text-text-tertiary dark:text-zinc-500 hover:text-text-primary dark:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Solutions
        </button>

        <Card variant="elevated" padding="xl" className="!bg-canvas-white dark:!bg-zinc-900 !border-border-light dark:!border-zinc-800">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold mb-4 text-text-primary dark:text-white">Submit Your Problem</h1>
              <p className="text-text-secondary dark:text-zinc-400">
                Provide the details of your technical challenge. We'll design a custom playbook or consulting engagement to solve it.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full border border-brand-primary/20 text-sm font-semibold">
                <IndianRupee className="w-4 h-4" />
                ₹9 registration fee required to submit
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary dark:text-zinc-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary dark:text-white placeholder:text-text-tertiary dark:text-zinc-600"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary dark:text-zinc-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary dark:text-white placeholder:text-text-tertiary dark:text-zinc-600"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary dark:text-zinc-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary dark:text-white placeholder:text-text-tertiary dark:text-zinc-600"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary dark:text-zinc-300">Problem Description</label>
                <textarea
                  name="problem"
                  required
                  rows={5}
                  value={formData.problem}
                  onChange={handleFormChange}
                  className="w-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary dark:text-white resize-none placeholder:text-text-tertiary dark:text-zinc-600"
                  placeholder="Describe the technical bottleneck, architectural challenge, or scale issue you are facing..."
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" icon={<Send className="w-4 h-4" />}>
                Pay ₹9 & Submit
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
