import React, { useState } from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowLeft, Send } from 'lucide-react';

export const SubmitSolution: React.FC = () => {
  const { navigate } = useAppState();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

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
            {submitted ? (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="w-16 h-16 bg-brand-mint text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Problem Submitted</h2>
                <p className="text-text-secondary mb-8">
                  Our consulting team will review your problem scope and get back to you within 24-48 hours.
                </p>
                <Button variant="primary" onClick={() => navigate('/solutions')}>
                  Return to Solutions
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-display font-bold mb-4">Submit Your Problem</h1>
                  <p className="text-text-secondary">
                    Provide the details of your technical challenge. We'll design a custom playbook or consulting engagement to solve it.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-primary">Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary" 
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-primary">Email</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary" 
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Company / Organization</label>
                    <input 
                      type="text" 
                      className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary" 
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Problem Description</label>
                    <textarea 
                      required 
                      rows={5}
                      className="w-full bg-canvas-white border border-border-light rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-text-primary resize-none" 
                      placeholder="Describe the technical bottleneck, architectural challenge, or scale issue you are facing..."
                    ></textarea>
                  </div>

                  <Button type="submit" variant="primary" fullWidth size="lg" icon={<Send className="w-4 h-4" />}>
                    Submit Problem
                  </Button>
                </form>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
