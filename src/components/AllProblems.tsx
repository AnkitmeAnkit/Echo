import React, { useState } from "react";
import { useAppState } from "../store";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { ArrowLeft, Clock, ArrowRight, X, QrCode, CheckCircle2, Loader2, Phone, CreditCard } from "lucide-react";

interface Problem {
  category: string;
  title: string;
  desc: string;
  time: string;
  price: number;
  tagColor: "lavender" | "mint" | "blue";
}

type PaywallStep = "info" | "verifying" | "success";

const ALL_PROBLEMS: Problem[] = [
  { category: "Business Strategy", title: "Market Entry Strategy", desc: "Need help entering a new market with the right strategy and positioning.", time: "30-45 min call", price: 9, tagColor: "lavender" },
  { category: "Operations", title: "Process Optimization", desc: "Improve efficiency and reduce costs with streamlined business processes.", time: "30-45 min call", price: 0, tagColor: "mint" },
  { category: "Technology", title: "Digital Transformation", desc: "Modernize your business with the right digital tools and strategy.", time: "30-45 min call", price: 9, tagColor: "lavender" },
  { category: "Marketing", title: "Brand Positioning & GTM", desc: "Build a compelling brand narrative and go-to-market strategy for your product.", time: "30-45 min call", price: 9, tagColor: "blue" },
  { category: "Finance", title: "Revenue Modeling & Pricing", desc: "Design sustainable pricing structures and financial models that scale.", time: "30-45 min call", price: 9, tagColor: "lavender" },
  { category: "Product", title: "Product-Market Fit Audit", desc: "Evaluate your product against market needs and identify gaps to close.", time: "30-45 min call", price: 0, tagColor: "mint" },
  { category: "HR & Talent", title: "Hiring Process Design", desc: "Build a structured hiring pipeline to attract and retain top talent.", time: "30-45 min call", price: 9, tagColor: "blue" },
  { category: "Technology", title: "AI Integration Roadmap", desc: "Map out a practical AI adoption strategy tailored to your business context.", time: "30-45 min call", price: 9, tagColor: "lavender" },
  { category: "Operations", title: "Remote Team Workflows", desc: "Establish clear async processes and communication norms for distributed teams.", time: "30-45 min call", price: 0, tagColor: "mint" },
];

export function AllProblems() {
  const { navigate, currentUser, setAuthModalOpen, bookConsulting } = useAppState();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [paywallStep, setPaywallStep] = useState<PaywallStep>("info");
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");

  const handleCardClick = (prob: Problem) => {
    if (!currentUser) { setAuthModalOpen(true); return; }
    setSelectedProblem(prob); setPaywallStep("info"); setUpiId(""); setPhone("");
  };

  const handleClosePaywall = () => { setSelectedProblem(null); setPaywallStep("info"); };

  const handleBookFree = () => {
    if (!selectedProblem) return;
    bookConsulting({ name: currentUser?.name || "", email: currentUser?.email || "", problem: selectedProblem.title, budget: "Free", date: new Date().toISOString().split("T")[0], timeSlot: selectedProblem.time });
    setPaywallStep("success");
  };

  const handlePay = () => {
    setPaywallStep("verifying");
    setTimeout(() => {
      if (!selectedProblem) return;
      bookConsulting({ name: currentUser?.name || "", email: currentUser?.email || "", problem: selectedProblem.title, budget: `₹${selectedProblem.price}`, date: new Date().toISOString().split("T")[0], timeSlot: selectedProblem.time });
      setPaywallStep("success");
    }, 2500);
  };

  return (
    <div className="w-full bg-canvas min-h-screen pb-32">
      <div className="max-w-[1860px] mx-auto px-6 pt-12">
        <button onClick={() => navigate("/solutions")} className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Solutions
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary">All Problems</h1>
            <p className="text-text-secondary mt-2">Browse all {ALL_PROBLEMS.length} predefined consulting problems. Click one to get started.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALL_PROBLEMS.map((prob, i) => (
            <Card key={i} className="flex flex-col hover:border-brand-primary/30 transition-colors group cursor-pointer" onClick={() => handleCardClick(prob)}>
              <div className="mb-4"><Badge variant={prob.tagColor}>{prob.category}</Badge></div>
              <h4 className="text-xl font-bold mb-3">{prob.title}</h4>
              <p className="text-text-secondary text-sm mb-8 flex-1">{prob.desc}</p>
              <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border-light">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {prob.time}</span>
                  <span className="font-semibold text-brand-primary">{prob.price === 0 ? "Free" : `₹${prob.price} to connect`}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-canvas flex items-center justify-center text-text-tertiary group-hover:bg-brand-lavender group-hover:text-brand-primary transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedProblem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={paywallStep !== "verifying" ? handleClosePaywall : undefined} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-t-4 border-brand-primary">
            {paywallStep !== "verifying" && (
              <button onClick={handleClosePaywall} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
            <div className="px-8 pt-7 pb-8">
              {paywallStep === "success" && (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-20 h-20 rounded-full bg-brand-mint flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Booked!</h2>
                  <p className="text-text-secondary text-sm">Your slot for <span className="font-semibold text-text-primary">{selectedProblem.title}</span> is confirmed. Check your Dashboard.</p>
                  <button onClick={() => { handleClosePaywall(); navigate("/dashboard"); }} className="mt-2 w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-colors">Go to Dashboard</button>
                </div>
              )}
              {paywallStep === "verifying" && (
                <div className="flex flex-col items-center text-center py-12 gap-4">
                  <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                  <h2 className="text-xl font-bold text-text-primary">Verifying Payment...</h2>
                  <p className="text-text-secondary text-sm">PhonePe is verifying your transaction.</p>
                </div>
              )}
              {paywallStep === "info" && (
                <>
                  <div className="mb-5">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary">Consulting Access</span>
                    <h2 className="text-xl font-bold text-text-primary mt-1">{selectedProblem.title}</h2>
                    <p className="text-text-secondary text-sm mt-1">{selectedProblem.desc}</p>
                  </div>
                  <div className="bg-canvas rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div><p className="text-xs text-text-tertiary mb-0.5">Session Type</p><p className="font-semibold text-sm">{selectedProblem.time}</p></div>
                    <div className="text-right"><p className="text-xs text-text-tertiary mb-0.5">Access Fee</p><p className="font-bold text-lg text-brand-primary">{selectedProblem.price === 0 ? "Free" : `₹${selectedProblem.price}`}</p></div>
                  </div>
                  {selectedProblem.price === 0 ? (
                    <button onClick={handleBookFree} className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Book a Slot
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                          <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-border-light bg-canvas-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">UPI ID</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                          <input type="text" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-border-light bg-canvas-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all" />
                        </div>
                      </div>
                      <div className="border border-border-light rounded-xl p-4 flex flex-col items-center gap-2 bg-canvas">
                        <QrCode className="w-16 h-16 text-text-tertiary" />
                        <p className="text-xs text-text-tertiary">Scan QR with PhonePe / GPay / Paytm</p>
                        <p className="text-xs font-bold text-text-secondary">echoglitch@upi</p>
                      </div>
                      <button onClick={handlePay} disabled={!phone || !upiId} className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        Pay ₹{selectedProblem.price} via PhonePe
                      </button>
                      <p className="text-center text-[11px] text-text-tertiary">Secured by PhonePe. Slot auto-confirmed on payment.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
