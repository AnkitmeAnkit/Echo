import React, { useState } from "react";
import { useAppState } from "../store";
import { Problem } from "../types";
import { PREDEFINED_PROBLEMS } from "../data";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Stepper, Step } from "./Stepper";
import { PaywallModal } from "./PaywallModal";
import { Lightbulb, Play, BookOpen, Edit3, Wallet, HeadphonesIcon, MessageSquare, IndianRupee, Clock, ArrowRight, ShieldCheck, Lock, Heart } from "lucide-react";

export function Consulting() {
  const { navigate, currentUser, setAuthModalOpen, wishlistItems, toggleWishlist, isWishlisted } = useAppState();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const processSteps: Step[] = [
    { icon: <Wallet className="w-8 h-8" />, title: "Pay ₹9", description: "Pay a nominal fee of ₹9 to connect with our consultant." },
    { icon: <HeadphonesIcon className="w-8 h-8" />, title: "Expert Connect", description: "Our consultant will call you to understand your requirements." },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Discussion & Analysis", description: "We analyze the problem and discuss the best approach." },
    { icon: <IndianRupee className="w-8 h-8" />, title: "Final Pricing", description: "We provide the final execution plan and pricing after discussion." }
  ];

  const handleCardClick = (prob: Problem) => {
    if (!currentUser) { setAuthModalOpen(true); return; }
    setSelectedProblem(prob);
    setShowPaywall(true);
  };

  const handleSubmitNow = () => {
    if (!currentUser) { setAuthModalOpen(true); return; }
    navigate("/solutions/submit");
  };

  return (
    <div className="w-full bg-black min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">

        {selectedProblem && (
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            itemType="consultation"
            itemSlug={`predefined-${selectedProblem.title}`}
            itemTitle={selectedProblem.title}
            price={selectedProblem.price}
            consultationFormData={{
              problem_title: selectedProblem.title,
              problem_type: 'predefined',
              details: selectedProblem.desc,
              full_name: currentUser?.name || '',
              email: currentUser?.email || '',
              phone: currentUser?.phone || ''
            }}
          />
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden mb-12 animate-fade-in-up">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">Get Tailored Solutions, Backed by Experts</h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">Choose from our predefined problems or submit your own. Get a structured solution from an AI Expert in 24 hrs for just ₹9.</p>
            <Button variant="primary" icon={<Play className="w-4 h-4" />} onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>How It Works</Button>
          </div>
          <div className="relative z-10 w-full max-w-md flex items-center justify-center">
            <div className="w-48 h-48 bg-brand-primary/10 backdrop-blur-xl rounded-full border border-brand-primary/20 flex items-center justify-center relative">
              <Lightbulb className="w-24 h-24 text-brand-primary relative z-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Card padding="xl" className="flex items-start gap-6 hover:shadow-card transition-shadow !bg-zinc-900 !border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0"><BookOpen className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Browse Predefined Problems</h3>
              <p className="text-zinc-400 mb-6">Choose from our list of common business challenges. Pay ₹9 to connect with our expert.</p>
              <Button variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => document.getElementById("predefined-problems")?.scrollIntoView({ behavior: "smooth" })}>Explore Problems</Button>
            </div>
          </Card>
          <Card padding="xl" className="flex items-start gap-6 hover:shadow-card transition-shadow !bg-zinc-900 !border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0"><Edit3 className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Submit Your Own Problem</h3>
              <p className="text-zinc-400 mb-6">Can't find your problem? Submit your own and our expert will reach out to you.</p>
              <Button variant="outline" icon={currentUser ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />} iconPosition="right" onClick={handleSubmitNow}>
                {currentUser ? "Submit Now" : "Login to Submit"}
              </Button>
            </div>
          </Card>
        </div>

        <div id="how-it-works" className="mb-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-display font-bold mb-8 text-white">How It Works</h2>
          <Stepper steps={processSteps} />
        </div>

        <div id="predefined-problems" className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Predefined Problems</h2>
            <button onClick={() => navigate("/solutions/all")} className="text-brand-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
              View all problems <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREDEFINED_PROBLEMS.map((prob, i) => (
              <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer !bg-zinc-900 !border-zinc-800" onClick={() => handleCardClick(prob)}>
                <div className="mb-4"><Badge variant={prob.tagColor}>{prob.category}</Badge></div>
                <h4 className="text-xl font-bold mb-3 text-white">{prob.title}</h4>
                <p className="text-zinc-400 text-sm mb-8 flex-1">{prob.desc}</p>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prob.time}</span>
                    <span className="font-semibold text-brand-primary">{prob.price === 0 ? "Free" : `₹${prob.price} to connect`}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        if (!currentUser) setAuthModalOpen(true);
                        else await toggleWishlist('problem', prob.title); 
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isWishlisted('problem', prob.title) 
                          ? 'text-red-500 bg-red-500/10' 
                          : 'text-zinc-500 hover:bg-brand-primary/10 hover:text-brand-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted('problem', prob.title) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card variant="elevated" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up !bg-zinc-900 !border-zinc-800" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-lg text-white">Expert Guidance. Transparent Process. Fair Pricing.</h4>
              <p className="text-zinc-400 text-sm">Get a structured solution from an AI Expert in 24 hrs for just ₹9.</p>
            </div>
          </div>
          <Button
            icon={currentUser ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            className="flex-shrink-0"
            onClick={() => currentUser ? navigate('/solutions/submit') : setAuthModalOpen(true)}
          >
            {currentUser ? 'Get Started for ₹9' : 'Login to Get Started'}
          </Button>
        </Card>
      </div>

    </div>
  );
}
