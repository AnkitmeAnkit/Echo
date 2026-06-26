import React, { useState } from "react";
import { useAppState } from "../store";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { ArrowLeft, Clock, ArrowRight, Heart } from "lucide-react";
import { PaywallModal } from "./PaywallModal";
import { PREDEFINED_PROBLEMS } from "../data";

interface Problem {
  category: string;
  title: string;
  desc: string;
  time: string;
  price: number;
  tagColor: "lavender" | "mint" | "blue" | string;
}

export function AllProblems() {
  const { navigate, currentUser, setAuthModalOpen, isWishlisted, toggleWishlist } = useAppState();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleCardClick = (prob: Problem) => {
    if (!currentUser) { setAuthModalOpen(true); return; }
    setSelectedProblem(prob);
    setShowPaywall(true);
  };

  return (
    <div className="w-full bg-canvas dark:bg-black min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        <button onClick={() => navigate("/solutions")} className="flex items-center gap-2 text-text-tertiary dark:text-zinc-500 hover:text-text-primary dark:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Solutions
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary dark:text-white">All Problems</h1>
            <p className="text-text-secondary dark:text-zinc-400 mt-2">Browse all {PREDEFINED_PROBLEMS.length} predefined consulting problems. Click one to get started.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREDEFINED_PROBLEMS.map((prob, i) => (
            <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer !bg-canvas-white dark:!bg-zinc-900 !border-border-light dark:!border-zinc-800" onClick={() => handleCardClick(prob)}>
              <div className="mb-4"><Badge variant={prob.tagColor as any}>{prob.category}</Badge></div>
              <h4 className="text-xl font-bold mb-3 text-text-primary dark:text-white">{prob.title}</h4>
              <p className="text-text-secondary dark:text-zinc-400 text-sm mb-8 flex-1">{prob.desc}</p>
              <div className="flex items-center justify-between text-xs text-text-tertiary dark:text-zinc-500 pt-4 border-t border-border-light dark:border-zinc-800">
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
                        : 'text-text-tertiary dark:text-zinc-500 hover:bg-brand-primary/10 hover:text-brand-primary'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted('problem', prob.title) ? "currentColor" : "none"} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-canvas dark:bg-zinc-950 border border-border-light dark:border-zinc-800 flex items-center justify-center text-text-tertiary dark:text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

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
    </div>
  );
}
