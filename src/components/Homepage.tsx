import React, { useState } from 'react';
import { useAppState } from '../store';
import { Button } from './Button';
import { Card } from './Card';
import { Stepper } from './Stepper';
import { Badge } from './Badge';
import { 
  Zap, ArrowRight, BookOpen, Target, Briefcase, Rocket,
  Users, Award, Clock, ShieldCheck, CheckCircle2, HeadphonesIcon
} from 'lucide-react';

export function Homepage() {
  const { navigate } = useAppState();
  const processSteps = [
    { icon: <BookOpen className="w-8 h-8" />, title: "Choose a Playbook", description: "Browse our catalogue and pick the AI framework that matches your goal." },
    { icon: <Target className="w-8 h-8" />, title: "Purchase Access", description: "Buy once. Own the playbook forever with lifetime access." },
    { icon: <Rocket className="w-8 h-8" />, title: "Learn the System", description: "Follow step-by-step chapters built for real-world execution." },
    { icon: <Zap className="w-8 h-8" />, title: "Apply Immediately", description: "Use the templates and workflows directly in your daily work." },
    { icon: <Award className="w-8 h-8" />, title: "Scale Your Output", description: "Build compounding leverage with every playbook you master." }
  ];

  const stats = [
    { icon: <BookOpen />, value: "250+", label: "Playbooks", sub: "Actionable AI guides" },
    { icon: <Users />, value: "1,200+", label: "Professionals", sub: "Using our platform" },
    { icon: <Award />, value: "98%", label: "Success Rate", sub: "Projects executed successfully" },
    { icon: <Clock />, value: "24/7", label: "Instant Access", sub: "Start learning immediately" },
  ];

  const whyChooseUs = [
    { icon: <HeadphonesIcon className="w-6 h-6" />, title: "Expert Guidance", desc: "Learn from seasoned AI professionals" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "Practical & Actionable", desc: "Real-world solutions that deliver results" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure & Private", desc: "Your data is safe and protected" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Transparent Process", desc: "Clear steps, honest and fair pricing" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section — tightened vertical padding, no bottom gap */}
      <section className="relative pt-20 pb-20 overflow-hidden bg-canvas">
        <div className="w-full px-8 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <Badge variant="lavender" className="mb-6">
              <Zap className="w-3 h-3 mr-1" /> AI Playbooks for Execution
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
              Master AI <span className="text-brand-primary">Execution.</span><br />
              Build with <span className="text-brand-primary">Confidence.</span>
            </h1>
            <p className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
              Expert-crafted playbooks that help you deploy AI in your work the right way. Practical, step-by-step, and built for results.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Button size="lg" icon={<BookOpen className="w-5 h-5" />} onClick={() => navigate('/playbooks')}>
                Explore Playbooks
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`} alt="user" className="w-10 h-10 rounded-full border-2 border-white bg-brand-lavender" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">Trusted by 1,200+ professionals</p>
                <div className="flex items-center text-yellow-400">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  <span className="text-text-secondary ml-2 font-medium">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative animate-fade-in-up flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square mx-auto">
              <div className="absolute inset-0 bg-gradient-lavender rounded-[3rem] transform rotate-3 opacity-50 blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-lavender rounded-[3rem] transform -rotate-3 shadow-lavender border border-white/50 p-8 flex flex-col items-center justify-center relative z-10 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6 w-full max-w-xs relative z-20">
                  <div className="bg-white rounded-2xl p-6 shadow-soft transform -translate-y-4 hover:-translate-y-6 transition-transform">
                    <div className="w-12 h-12 bg-brand-lavender text-brand-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="text-center font-bold text-sm">AI Playbooks</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-soft transform translate-y-4 hover:translate-y-2 transition-transform">
                    <div className="w-12 h-12 bg-brand-lavender text-brand-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="text-center font-bold text-sm">Real Results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings */}
      <section className="py-16 bg-canvas-white">
        <div className="w-full px-8 lg:px-16 max-w-4xl mx-auto">
          <Card padding="xl" className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lavender rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <Badge variant="outline" className="mb-6"><BookOpen className="w-3 h-3 mr-1"/> PLAYBOOKS</Badge>
            <h2 className="text-3xl font-display font-bold mb-4">Learn. Apply. Master AI.</h2>
            <p className="text-text-secondary mb-8 max-w-sm">Step-by-step playbooks to help you enable AI in your work the right way. Well-researched, practical and easy to follow.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-canvas p-4 rounded-xl">
                <h4 className="font-bold text-sm mb-1">Task-Specific Playbooks</h4>
                <p className="text-xs text-text-secondary mb-4">Guides for specific tasks to help you work faster</p>
                <button onClick={() => navigate('/playbooks/all?category=task')} className="text-brand-primary text-sm font-semibold flex items-center hover:gap-2 transition-all">
                  Explore Playbooks <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="bg-canvas p-4 rounded-xl">
                <h4 className="font-bold text-sm mb-1">Industry-Specific Playbooks</h4>
                <p className="text-xs text-text-secondary mb-4">Domain-focused playbooks for your industry</p>
                <button onClick={() => navigate('/playbooks/all?category=industry')} className="text-brand-primary text-sm font-semibold flex items-center hover:gap-2 transition-all">
                  Explore Playbooks <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-canvas">
        <div className="w-full px-8 lg:px-16">
          <h2 className="text-3xl font-display font-bold mb-12">How It Works</h2>
          <Stepper steps={processSteps} />
        </div>
      </section>

      {/* Stats and Why Choose Us */}
      <section className="py-16 bg-canvas-white">
        <div className="w-full px-8 lg:px-16">
          <Card variant="elevated" padding="xl" className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:divide-x divide-border-light/50">
              {stats.map((stat, i) => (
                <div key={i} className={`flex flex-col items-center text-center ${i % 2 !== 0 ? 'sm:pl-8' : ''} ${i !== 0 ? 'md:pl-8' : ''}`}>
                  <div className="w-12 h-12 bg-brand-lavender text-brand-primary rounded-full flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-1">{stat.value}</h3>
                  <p className="font-semibold text-text-primary mb-1">{stat.label}</p>
                  <p className="text-sm text-text-secondary">{stat.sub}</p>
                </div>
              ))}
            </div>
          </Card>

          <h2 className="text-3xl font-display font-bold mb-10">Why Professionals Choose Echo Glitch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-lavender text-brand-primary flex-shrink-0 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-text-secondary">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-canvas">
        <div className="w-full px-8 lg:px-16">
          <div className="bg-gradient-blue-purple rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-lavender gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md flex-shrink-0">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to start building?</h2>
                <p className="text-white/80">Browse the full playbook catalogue and level up your workflow.</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => navigate('/playbooks')}
            >
              Browse All Playbooks
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
