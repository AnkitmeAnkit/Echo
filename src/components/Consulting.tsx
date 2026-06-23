import React from 'react';
import { useAppState } from '../store';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Stepper, Step } from './Stepper';
import { 
  Lightbulb, Play, BookOpen, Edit3, Wallet, HeadphonesIcon, 
  MessageSquare, IndianRupee, Clock, ArrowRight, ShieldCheck, Lock
} from 'lucide-react';

export function Consulting() {
  const { navigate } = useAppState();

  const processSteps: Step[] = [
    { icon: <Wallet className="w-8 h-8" />, title: "1. Pay â‚¹9", description: "Pay a nominal fee of â‚¹9 to connect with our consultant." },
    { icon: <HeadphonesIcon className="w-8 h-8" />, title: "2. Expert Connect", description: "Our consultant will call you to understand your requirements." },
    { icon: <MessageSquare className="w-8 h-8" />, title: "3. Discussion & Analysis", description: "We analyze the problem and discuss the best approach." },
    { icon: <IndianRupee className="w-8 h-8" />, title: "4. Final Pricing", description: "We provide the final execution plan and pricing after discussion." }
  ];

  const predefinedProblems = [
    {
      category: "Business Strategy",
      title: "Market Entry Strategy",
      desc: "Need help entering a new market with the right strategy and positioning.",
      time: "30-45 min call",
      price: "â‚¹9 to connect",
      tagColor: "lavender" as const
    },
    {
      category: "Operations",
      title: "Process Optimization",
      desc: "Improve efficiency and reduce costs with streamlined business processes.",
      time: "30-45 min call",
      price: "â‚¹9 to connect",
      tagColor: "mint" as const
    },
    {
      category: "Technology",
      title: "Digital Transformation",
      desc: "Modernize your business with the right digital tools and strategy.",
      time: "30-45 min call",
      price: "â‚¹9 to connect",
      tagColor: "blue" as const
    }
  ];

  return (
    <div className="w-full bg-canvas min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        {/* Hero Banner */}
        <div className="bg-gradient-lavender rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden mb-12 shadow-lavender animate-fade-in-up">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-text-primary leading-tight">
              Get Tailored Solutions, Backed by Experts
            </h1>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Choose from our predefined problems or submit your own. For just â‚¹9, our consultant will connect with you, understand your needs, and provide the best solution along with the final execution price.
            </p>
            <Button variant="primary" icon={<Play className="w-4 h-4" />}>
              How It Works
            </Button>
          </div>
          
          <div className="relative z-10 w-full max-w-md aspect-video md:aspect-square flex items-center justify-center">
            {/* 3D Lightbulb placeholder */}
            <div className="w-48 h-48 bg-white/50 backdrop-blur-xl rounded-full shadow-2xl border border-white/60 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-brand-lavender blur-2xl opacity-50 rounded-full"></div>
               <Lightbulb className="w-24 h-24 text-brand-primary relative z-20" />
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Card padding="xl" className="flex items-start gap-6 hover:shadow-card transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Browse Predefined Problems</h3>
              <p className="text-text-secondary mb-6">Choose from our list of common business challenges. Pay â‚¹9 to connect with our expert.</p>
              <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => document.getElementById('predefined-problems')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Problems
              </Button>
            </div>
          </Card>

          <Card padding="xl" className="flex items-start gap-6 hover:shadow-card transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center flex-shrink-0">
              <Edit3 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Submit Your Own Problem</h3>
              <p className="text-text-secondary mb-6">Can't find your problem listed? Submit your own. Pay â‚¹9 and our expert will reach out to you.</p>
              <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => navigate('/solutions/submit')}>
                Submit Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Process Flow */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-display font-bold mb-8">How It Works</h2>
          <Stepper steps={processSteps} />
        </div>

        {/* Predefined Problems */}
        <div id="predefined-problems" className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">Predefined Problems</h2>
            <button className="text-brand-primary font-semibold flex items-center hover:gap-1 transition-all text-sm">
              View all problems <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predefinedProblems.map((prob, i) => (
              <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer">
                <div className="mb-4">
                  <Badge variant={prob.tagColor}>{prob.category}</Badge>
                </div>
                <h4 className="text-xl font-bold mb-3">{prob.title}</h4>
                <p className="text-text-secondary text-sm mb-8 flex-1">{prob.desc}</p>
                
                <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border-light">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prob.time}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {prob.price}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand-lavender group-hover:text-brand-primary transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <Card variant="elevated" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-brand-lavender text-brand-primary flex items-center justify-center flex-shrink-0">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-lg">Expert Guidance. Transparent Process. Fair Pricing.</h4>
               <p className="text-text-secondary text-sm">Pay only â‚¹9 to connect. No hidden charges. Final pricing only after expert discussion.</p>
             </div>
          </div>
          <Button icon={<Lock className="w-4 h-4" />} className="flex-shrink-0">
            Get Started for â‚¹9
          </Button>
        </Card>
      </div>
    </div>
  );
}


