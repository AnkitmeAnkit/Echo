import React, { useState } from 'react';
import { useAppState } from '../store';
import { User, Mail, Phone, Briefcase, FileText, Code, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Consulting: React.FC = () => {
  const { currentUser } = useAppState();

  const [formMode, setFormMode] = useState<'playbook' | 'consulting'>('playbook');
  
  // Universal
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [whatsapp, setWhatsapp] = useState('');

  // Playbook fields
  const [profession, setProfession] = useState('');
  const [workflows, setWorkflows] = useState('');

  // Consulting fields
  const [techStack, setTechStack] = useState('');
  const [bottleneck, setBottleneck] = useState('');

  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setCompleted(true);
  };

  return (
    <div className="bg-canvas text-ink font-sans pb-24">
      
      <section className="w-full px-6 md:px-10 pt-16 pb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink">
          Architect Your Solution
        </h1>
        <p className="text-body text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
          Provide your execution parameters below. Our advisory team will analyze your requirements and reach out directly via WhatsApp and Email with a tailored execution plan and personalized pricing.
        </p>

        {/* Toggle Switch */}
        <div className="mt-10 flex justify-center">
          <div className="bg-surface-soft p-1 rounded-full inline-flex border border-hairline shadow-sm">
            <button
              type="button"
              onClick={() => setFormMode('playbook')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                formMode === 'playbook' 
                  ? 'bg-canvas text-ink shadow-sm border border-hairline' 
                  : 'text-muted hover:text-ink border border-transparent'
              }`}
            >
              Custom AI Playbook
            </button>
            <button
              type="button"
              onClick={() => setFormMode('consulting')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                formMode === 'consulting' 
                  ? 'bg-canvas text-ink shadow-sm border border-hairline' 
                  : 'text-muted hover:text-ink border border-transparent'
              }`}
            >
              1-on-1 Consulting
            </button>
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-10">
        {completed ? (
          <div className="max-w-xl mx-auto bg-surface-card rounded-xl p-8 md:p-12 text-center space-y-6 shadow-sm border border-hairline animate-fade-in-up">
            <div className="flex justify-center text-success">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-semibold text-ink tracking-tight">Request Received</h2>
              <p className="text-body text-base">
                Your parameters have been logged. Our advisory team will review your requirements and reach out shortly with a tailored plan.
              </p>
            </div>

            <button
              onClick={() => setCompleted(false)}
              className="bg-primary text-on-primary hover:bg-primary-active py-3 px-8 rounded-md text-sm font-semibold transition-colors mt-8 inline-block w-full cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-8 bg-surface-card border border-hairline rounded-xl shadow-sm animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-canvas border border-hairline px-10 py-3 text-ink focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas border border-hairline px-10 py-3 text-ink focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input 
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                  />
                </div>
              </div>

              {formMode === 'playbook' ? (
                <div className="space-y-6 animate-fade-in-up pt-4 border-t border-hairline">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">Profession / Industry</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input 
                        type="text"
                        required
                        placeholder="e.g., Data Analyst, Corporate Lawyer"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">Target Workflows</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-4 w-4 h-4 text-muted" />
                      <textarea 
                        rows={4}
                        required
                        placeholder="Detail the specific daily tasks or workflows you want to automate..."
                        value={workflows}
                        onChange={(e) => setWorkflows(e.target.value)}
                        className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-up pt-4 border-t border-hairline">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">Current Tech Stack</label>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input 
                        type="text"
                        required
                        placeholder="e.g., Claude, Supabase, Vercel"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-ink">Primary Bottleneck</label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-4 w-4 h-4 text-muted" />
                      <textarea 
                        rows={4}
                        required
                        placeholder="What is the exact technical hurdle you need us to solve on this call?"
                        value={bottleneck}
                        onChange={(e) => setBottleneck(e.target.value)}
                        className="w-full bg-canvas border border-hairline px-10 py-3 text-ink placeholder-muted focus:outline-none focus:border-surface-strong rounded-md transition-colors text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-hairline text-center space-y-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary hover:bg-primary-active py-4 text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
                >
                  Request Custom Proposal
                </button>
                <p className="text-xs text-muted">
                  By submitting, you agree to receive a follow-up via WhatsApp and Email regarding your custom architecture and pricing.
                </p>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};
