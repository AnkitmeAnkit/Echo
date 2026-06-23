import React from 'react';
import { useAppState } from '../store';
import { Button } from './Button';
import { Card } from './Card';
import { Stepper } from './Stepper';
import { Badge } from './Badge';
import { 
  Zap, ArrowRight, BookOpen, Target, Briefcase, FileCheck, 
  Wallet, HeadphonesIcon, MessageSquare, IndianRupee, Rocket,
  Users, Award, Clock, ShieldCheck, CheckCircle2, PhoneCall
} from 'lucide-react';

export function Homepage() {
  const { navigate } = useAppState();

  const processSteps = [
    { icon: <FileCheck className="w-8 h-8" />, title: "Choose a Problem", description: "Pick a listed problem or submit your own for just ₹9." },
    { icon: <Wallet className="w-8 h-8" />, title: "Pay ₹9 to Connect", description: "Make a secure payment and unlock consultant review & call-back." },
    { icon: <HeadphonesIcon className="w-8 h-8" />, title: "Discuss Your Need", description: "Our consultant will call you to understand the problem in detail." },
    { icon: <IndianRupee className="w-8 h-8" />, title: "Receive Final Pricing", description: "Get the final execution price after discussion. No hidden charges." },
    { icon: <Rocket className="w-8 h-8" />, title: "Start the Work", description: "Approve the price and we'll begin executing your solution." }
  ];

  const stats = [
    { icon: <BookOpen />, value: "250+", label: "Playbooks", sub: "Actionable AI guides" },
    { icon: <Users />, value: "1,200+", label: "Professionals", sub: "Using our platform" },
    { icon: <Award />, value: "98%", label: "Success Rate", sub: "Projects executed successfully" },
    { icon: <Clock />, value: "24hrs", label: "Avg. Response", sub: "Consultant connect time" },
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
              <Zap className="w-3 h-3 mr-1" /> AI Playbooks & Expert Solutions
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
              Find the Right <span className="text-brand-primary">Solution.</span><br />
              Execute with <span className="text-brand-primary">Confidence.</span>
            </h1>
            <p className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
              Access expert-crafted playbooks or get tailored solutions for your unique challenges. Start with just ₹9, connect with our consultants, and receive the final pricing after discussion.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Button size="lg" icon={<BookOpen className="w-5 h-5" />} onClick={() => navigate('/playbooks')}>
                Explore Playbooks
              </Button>
              <Button variant="secondary" size="lg" icon={<Zap className="w-5 h-5" />} onClick={() => navigate('/solutions')}>
                Find a Solution
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
                    <p className="text-center font-bold text-sm">Expert Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offerings */}
      <section className="py-16 bg-canvas-white">
        <div className="w-full px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <Card padding="xl" className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mint rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            <Badge variant="mint" className="mb-6"><Zap className="w-3 h-3 mr-1"/> SOLUTIONS</Badge>
            <h2 className="text-3xl font-display font-bold mb-4">Get Expert Help, When You Need It</h2>
            <p className="text-text-secondary mb-8 max-w-sm">Choose from predefined problems or submit your own. Our consultants will call you, understand your needs, and share the final execution price.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-canvas p-4 rounded-xl">
                <h4 className="font-bold text-sm mb-1">Browse Predefined Problems</h4>
                <p className="text-xs text-text-secondary mb-4">Pick a common problem and connect for just ₹9</p>
                <button onClick={() => navigate('/solutions')} className="text-success text-sm font-semibold flex items-center hover:gap-2 transition-all">
                  Explore Problems <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="bg-canvas p-4 rounded-xl">
                <h4 className="font-bold text-sm mb-1">Submit Your Own Problem</h4>
                <p className="text-xs text-text-secondary mb-4">Can't find your problem? Submit it for just ₹9</p>
                <button onClick={() => navigate('/solutions')} className="text-success text-sm font-semibold flex items-center hover:gap-2 transition-all">
                  Submit Now <ArrowRight className="w-4 h-4 ml-1" />
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
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Have a question before getting started?</h2>
                <p className="text-white/80">Talk to our team and find the right way forward.</p>
              </div>
            </div>
            <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
              Book a Free Consultancy Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
