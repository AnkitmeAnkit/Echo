import React from 'react';
import { useAppState } from '../store';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { 
  Zap, ArrowRight, BookOpen, Target, Rocket,
  Users, Award, Clock, ShieldCheck, CheckCircle2, HeadphonesIcon
} from 'lucide-react';

export function Homepage() {
  const { navigate } = useAppState();
  const processSteps = [
    { num: "01", title: "Choose a Playbook", description: "Browse our catalogue and pick the AI framework that matches your goal." },
    { num: "02", title: "Purchase Access", description: "Buy once. Own the playbook forever with lifetime access." },
    { num: "03", title: "Learn the System", description: "Follow step-by-step chapters built for real-world execution." },
    { num: "04", title: "Apply Immediately", description: "Use the templates and workflows directly in your daily work." },
    { num: "05", title: "Scale Your Output", description: "Build compounding leverage with every playbook you master." }
  ];

  const stats = [
    { value: "250+", label: "Playbooks" },
    { value: "1,200+", label: "Professionals" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Instant Access" },
  ];

  const whyChooseUs = [
    { icon: <HeadphonesIcon className="w-8 h-8" />, title: "Expert Guidance", desc: "Learn from seasoned AI professionals" },
    { icon: <CheckCircle2 className="w-8 h-8" />, title: "Practical & Actionable", desc: "Real-world solutions that deliver results" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Secure & Private", desc: "Your data is safe and protected" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Transparent Process", desc: "Clear steps, honest and fair pricing" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 overflow-hidden bg-bg-primary border-b-4 border-border-main">
        <div className="w-full px-8 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Badge variant="mint" className="mb-8 border-4 border-text-primary px-4 py-2">
              <Zap className="w-4 h-4 mr-2" /> AI Playbooks for Execution
            </Badge>
            <h1 className="text-6xl lg:text-[7rem] font-display font-bold leading-none mb-8 uppercase tracking-tighter text-text-primary drop-shadow-[4px_4px_0_var(--color-accent)]">
              Master AI<br />
              <span className="text-accent bg-text-primary px-2 border-4 border-border-main inline-block mt-2">Execution.</span>
            </h1>
            <p className="text-xl text-text-secondary font-mono mb-12 max-w-2xl leading-relaxed border-l-4 border-accent pl-6 py-2">
              Expert-crafted playbooks that help you deploy AI in your work the right way. Practical, step-by-step, and built for results. NO FLUFF.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              <Button size="lg" icon={<BookOpen className="w-6 h-6" />} onClick={() => navigate('/playbooks')}>
                Explore Playbooks
              </Button>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full aspect-square bg-bg-secondary border-8 border-border-main p-8 relative flex flex-col justify-between transform hover:rotate-2 transition-transform duration-200 shadow-brutal-accent">
              <div className="w-full flex justify-between items-start">
                <Target className="w-16 h-16 text-text-primary" />
                <div className="font-mono text-4xl font-bold text-accent border-4 border-accent p-2">RAW</div>
              </div>
              <div className="w-full bg-accent text-bg-primary border-4 border-border-inverse p-6">
                <h3 className="font-display font-bold text-3xl uppercase leading-none">REAL RESULTS.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Grid layout */}
      <section className="w-full border-b-4 border-border-main bg-bg-primary">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-y-0 divide-border-main">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 flex flex-col items-center justify-center text-center hover:bg-accent hover:text-accent-text transition-none group border-b-4 md:border-b-0 border-border-main">
              <div className="text-5xl font-display font-bold mb-2 group-hover:text-bg-primary">{stat.value}</div>
              <div className="text-sm font-mono font-bold uppercase tracking-widest text-text-secondary group-hover:text-bg-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Offerings */}
      <section className="py-20 bg-bg-secondary border-b-4 border-border-main">
        <div className="w-full px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <Badge variant="outline" className="mb-4 bg-bg-primary border-4 border-border-main"><BookOpen className="w-4 h-4 mr-2"/> PLAYBOOKS</Badge>
            <h2 className="text-5xl lg:text-7xl font-display font-bold uppercase leading-none mb-6">Learn. Apply.<br/>Master AI.</h2>
            <p className="text-text-secondary font-mono max-w-2xl text-lg border-l-4 border-border-light pl-6">Step-by-step playbooks to help you enable AI in your work the right way. Well-researched, practical and easy to follow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-bg-primary border-4 border-border-main p-8 shadow-brutal hover:-translate-y-2 transition-transform">
              <h4 className="font-display font-bold text-3xl mb-4 uppercase">Task-Specific</h4>
              <p className="text-sm font-mono text-text-secondary mb-8 leading-relaxed">Guides for specific tasks to help you work faster and more efficiently with AI.</p>
              <Button variant="secondary" onClick={() => navigate('/playbooks/all?category=task')}>
                EXPLORE <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="bg-bg-primary border-4 border-border-main p-8 shadow-brutal hover:-translate-y-2 transition-transform">
              <h4 className="font-display font-bold text-3xl mb-4 uppercase">Industry-Specific</h4>
              <p className="text-sm font-mono text-text-secondary mb-8 leading-relaxed">Domain-focused playbooks tailored for your specific industry challenges.</p>
              <Button variant="secondary" onClick={() => navigate('/playbooks/all?category=industry')}>
                EXPLORE <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-bg-primary border-b-4 border-border-main">
        <div className="w-full px-8 lg:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-5xl lg:text-7xl font-display font-bold uppercase leading-none sticky top-32">How<br/>It<br/>Works</h2>
          </div>
          <div className="lg:w-2/3 flex flex-col gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row border-4 border-border-main bg-bg-secondary p-8 shadow-brutal">
                <div className="font-display text-5xl font-bold text-accent mr-8 mb-4 sm:mb-0 border-b-4 sm:border-b-0 sm:border-r-4 border-border-light pb-4 sm:pb-0 sm:pr-8 flex items-center">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-2">{step.title}</h3>
                  <p className="font-mono text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-bg-secondary border-b-4 border-border-main">
        <div className="w-full px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-display font-bold uppercase mb-12">Why Echo Glitch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, i) => (
              <div key={i} className="border-4 border-border-main bg-bg-primary p-6 hover:bg-text-primary hover:text-bg-primary transition-colors group">
                <div className="w-16 h-16 border-4 border-border-main bg-accent text-accent-text flex items-center justify-center mb-6 group-hover:border-bg-primary group-hover:bg-bg-primary group-hover:text-text-primary">
                  {feature.icon}
                </div>
                <h4 className="font-display font-bold text-xl uppercase mb-3">{feature.title}</h4>
                <p className="font-mono text-sm text-text-secondary group-hover:text-bg-elevated">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-accent border-b-4 border-border-main">
        <div className="w-full px-8 lg:px-16 py-24 text-accent-text text-center flex flex-col items-center">
          <h2 className="text-6xl lg:text-9xl font-display font-bold uppercase tracking-tighter mb-8 leading-none">Ready to<br/>Build?</h2>
          <p className="font-mono text-xl max-w-2xl mb-12 border-2 border-border-inverse p-4 bg-bg-inverted text-text-inverted">
            Browse the full playbook catalogue and level up your workflow immediately.
          </p>
          <Button
            size="lg"
            className="bg-bg-primary text-text-primary border-4 border-bg-primary hover:bg-transparent hover:text-bg-primary hover:border-bg-primary shadow-brutal hover:shadow-none translate-y-0 hover:translate-y-1 hover:translate-x-1 transition-all"
            icon={<ArrowRight className="w-6 h-6" />}
            iconPosition="right"
            onClick={() => navigate('/playbooks')}
          >
            Browse All Playbooks
          </Button>
        </div>
      </section>
    </div>
  );
}
