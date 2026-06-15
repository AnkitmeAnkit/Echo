import React, { useState, useEffect } from 'react';
import { useAppState } from '../store';
import { PLAYBOOKS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface PlaybookBlueprint {
  id: string;
  tag: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

const BLUEPRINTS: PlaybookBlueprint[] = [
  {
    id: 'hyper-scale-backend',
    tag: 'Professional Track',
    title: 'AI Playbooks',
    description: "Learn to push AI platforms to their absolute limit. Get the exact frameworks to integrate tools like Claude into specific workflows whether you are 'vibe coding' a web application from scratch or a data analyst automating your daily reporting to outperform the competition.",
    price: 49,
    features: [
      'Advanced Claude & GPT Prompt Library',
      'Task-Specific Integration Workflows',
      'Video Implementation Guide',
      'Execution Checklist & Templates'
    ]
  },
  {
    id: 'digital-couture-design',
    tag: 'Custom Track',
    title: 'Custom AI Architecture',
    description: "Have a unique execution goal? We build the blueprint for you. Whether you are a non-technical founder establishing a solo venture or a data analyst looking to automate your specific toolset, we will custom-architect a definitive, step-by-step playbook tailored exactly to your workflow.",
    price: 399,
    features: [
      'Tailored System Integration Guide',
      'Custom Automation Workflows',
      'Ready-to-Use Personalized Prompts',
      'Step-by-Step Execution Plan'
    ]
  },
  {
    id: 'product-glitch-operations',
    tag: 'Consulting Track',
    title: 'Elite 1-on-1 Implementation',
    description: 'Direct-access consulting to wire up your specific automation systems. Fill out your intake form to book a private session where we audit your stack, troubleshoot technical bottlenecks, and actively build the infrastructure required to scale your output.',
    price: 999,
    features: [
      '1-on-1 Strategic Consulting Call',
      'Comprehensive Tech Stack Audit',
      'Custom Integration & Scripting',
      'Direct-Access Advisory Channel'
    ]
  }
];

export const Homepage: React.FC = () => {
  const { navigate, currentUser, purchasedSlugs, saveIntent } = useAppState();
  const [selectedCard, setSelectedCard] = useState<PlaybookBlueprint | null>(null);
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);

  // Disable body scroll when modal is active
  useEffect(() => {
    if (selectedCard || isBookingExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCard, isBookingExpanded]);

  const handleAcquire = (slug: string, price: number) => {
    if (!currentUser) {
      saveIntent(slug, price);
      navigate('/auth');
    } else {
      navigate(`/checkout/${slug}`);
    }
  };

  const springTransition = { type: 'spring' as const, bounce: 0.2, duration: 0.6 };

  return (
    <div className="bg-canvas text-ink font-sans pb-24">

      {/* Hero Section */}
      <section className="w-full px-6 md:px-10 pt-16 lg:pt-0 min-h-[calc(100vh-64px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-tight text-ink tracking-tight pr-4">
              Cut Through the AI Hype. Execute with Precision.
            </h1>

            <p className="text-lg text-body md:w-4/5 leading-relaxed">
              EchoGlitch is a premium ecosystem delivering actionable, densified AI Playbooks and 1-on-1 consulting for ambitious professionals. No generic tutorials. Just proven blueprints and pure execution.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/playbooks')}
                className="bg-primary text-on-primary hover:bg-primary-active px-6 py-3 rounded-md font-semibold text-sm transition-colors flex items-center justify-center space-x-2 h-12 cursor-pointer"
              >
                <span>Browse Playbooks</span>
              </button>

              <button
                onClick={() => navigate('/consulting')}
                className="bg-canvas border border-hairline text-ink hover:bg-surface-soft px-6 py-3 rounded-md font-semibold text-sm transition-colors flex items-center justify-center h-12 cursor-pointer"
              >
                <span>Book Consulting</span>
              </button>
            </div>
          </div>

          {/* Hero App Mockup Card */}
          <div className="lg:col-span-5 border border-hairline bg-canvas rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center font-medium text-ink">
                  EG
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">Echo Glitch Consulting</h3>
                  <p className="text-muted text-xs">30 min meeting</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted">{day}</div>
              ))}
              {[...Array(31)].map((_, i) => (
                <div
                  key={`day-${i}`}
                  className={`aspect-square flex items-center justify-center text-sm rounded-full ${i === 14 ? 'bg-primary text-on-primary font-semibold' : 'text-ink hover:bg-surface-soft cursor-pointer'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <button className="w-full bg-primary text-on-primary py-3 rounded-md text-sm font-semibold mt-4 cursor-pointer">
              Confirm Time
            </button>
          </div>

        </div>
      </section>

      {/* Featured Playbooks Section */}
      <section className="w-full px-6 md:px-10 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-ink tracking-tight">
            Actionable AI Blueprints
          </h2>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Tactical workflows and system playbooks designed for specific careers, engineered to eliminate noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLUEPRINTS.map((item) => {
            const hasPurchased = purchasedSlugs.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layoutId={item.id}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                transition={springTransition}
                className="bg-surface-card rounded-lg p-8 flex flex-col justify-between border border-hairline/60"
              >
                <div className="space-y-4">
                  <motion.div
                    layoutId={`tag-${item.id}`}
                    transition={springTransition}
                    className="inline-block bg-canvas px-3 py-1 rounded-pill text-xs font-medium border border-hairline text-muted self-start"
                  >
                    {item.tag}
                  </motion.div>

                  <motion.h3
                    layoutId={`title-${item.id}`}
                    transition={springTransition}
                    className="font-display text-2xl font-semibold text-ink tracking-tight"
                  >
                    {item.title}
                  </motion.h3>

                  <motion.p
                    layoutId={`desc-${item.id}`}
                    transition={springTransition}
                    className="text-body text-sm leading-relaxed mt-4"
                  >
                    {item.description}
                  </motion.p>
                </div>

                <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Starting from</span>
                    <motion.span
                      layoutId={`price-text-${item.id}`}
                      transition={springTransition}
                      className="font-display text-2xl font-semibold text-ink"
                    >
                      ₹{item.price}
                    </motion.span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedCard(item)}
                      className="bg-canvas border border-hairline hover:bg-surface-soft px-4 py-2 rounded-md text-sm font-semibold text-ink transition-colors cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(item.id === 'hyper-scale-backend' ? '/playbooks' : '/consulting')}
                      className="bg-primary text-on-primary hover:bg-primary-active px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Expanded Modal (Active State) */}
      <AnimatePresence>
        {selectedCard && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998] cursor-pointer"
            />

            {/* Expanded Card Container */}
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              onClick={() => setSelectedCard(null)}
            >
              <motion.div
                layoutId={selectedCard.id}
                transition={springTransition}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/85 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl max-w-2xl w-full overflow-hidden relative text-zinc-900 pointer-events-auto flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50 rounded-full transition-colors cursor-pointer z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content Area */}
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    <motion.div
                      layoutId={`tag-${selectedCard.id}`}
                      transition={springTransition}
                      className="inline-block bg-zinc-100 px-3 py-1 rounded-pill text-xs font-medium border border-zinc-200 text-zinc-600 self-start"
                    >
                      {selectedCard.tag}
                    </motion.div>

                    <motion.h3
                      layoutId={`title-${selectedCard.id}`}
                      transition={springTransition}
                      className="font-display text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight"
                    >
                      {selectedCard.title}
                    </motion.h3>

                    <motion.p
                      layoutId={`desc-${selectedCard.id}`}
                      transition={springTransition}
                      className="text-zinc-600 text-base leading-relaxed"
                    >
                      {selectedCard.description}
                    </motion.p>
                  </div>

                  {/* Checklist Section */}
                  <div className="pt-6 border-t border-zinc-100 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                      What's Included in this Blueprint
                    </h4>
                    <ul className="space-y-3">
                      {selectedCard.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-zinc-700 text-sm font-medium">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sticky Footer / CTA */}
                <div className="bg-zinc-50/90 border-t border-zinc-100 p-8 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Starting from</span>
                    <motion.span
                      layoutId={`price-text-${selectedCard.id}`}
                      transition={springTransition}
                      className="font-display text-3xl font-semibold text-zinc-900"
                    >
                      ₹{selectedCard.price}
                    </motion.span>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setSelectedCard(null);
                        navigate(selectedCard.id === 'hyper-scale-backend' ? '/playbooks' : '/consulting');
                      }}
                      className="bg-primary text-on-primary hover:bg-primary-active px-6 py-3 rounded-md text-sm font-semibold transition-colors cursor-pointer shadow-md"
                    >
                      Explore
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="w-full px-6 md:px-10 py-24">
        {!isBookingExpanded && (
          <motion.div
            layoutId="booking-cta-container"
            onClick={() => setIsBookingExpanded(true)}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            className="bg-surface-card rounded-lg p-12 md:p-24 text-center max-w-4xl mx-auto space-y-6 cursor-pointer border border-hairline/60 flex flex-col items-center justify-center"
          >
            <motion.h2
              layoutId="booking-title"
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              className="font-display text-3xl md:text-4xl font-semibold text-ink tracking-tight"
            >
              Book a Free Consultancy Call
            </motion.h2>
            <motion.p
              layoutId="booking-desc"
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              className="text-body text-lg max-w-2xl mx-auto"
            >
              Schedule a high-touch, complimentary session to understand our ecosystem, map out your custom automation workflows, and see exactly how our playbooks can accelerate your mastery.
            </motion.p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary text-on-primary hover:bg-primary-active px-6 py-3 rounded-md text-sm font-semibold transition-colors h-12 cursor-pointer"
              >
                Book Your Free Call
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Booking Modal (Active State) */}
      <AnimatePresence>
        {isBookingExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              key="booking-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingExpanded(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998] cursor-pointer"
            />

            {/* Expanded Modal Container */}
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              onClick={() => setIsBookingExpanded(false)}
            >
              <motion.div
                layoutId="booking-cta-container"
                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh] relative p-8 text-zinc-900 pointer-events-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsBookingExpanded(false)}
                  className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50 rounded-full transition-colors cursor-pointer z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header Section */}
                <div className="space-y-2 pr-12 text-center md:text-left">
                  <motion.h2
                    layoutId="booking-title"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    className="font-display text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight"
                  >
                    Book a Free Consultancy Call
                  </motion.h2>
                  <motion.p
                    layoutId="booking-desc"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    className="text-zinc-600 text-base leading-relaxed"
                  >
                    Schedule a high-touch, complimentary session to understand our ecosystem, map out your custom automation workflows, and see exactly how our playbooks can accelerate your mastery.
                  </motion.p>
                </div>

                {/* Lead Capture Form */}
                <div className="bg-white rounded-xl flex-grow mt-6 border border-zinc-200 p-6 overflow-y-auto">
                  <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-6">Let's Architect Your Blueprint</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="text-sm font-semibold text-zinc-700">Full Name</label>
                      <input type="text" id="fullName" required className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-sm font-semibold text-zinc-700">Email Address</label>
                      <input type="email" id="email" required className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all" />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-sm font-semibold text-zinc-700">Phone Number</label>
                      <input type="tel" id="phone" required placeholder="+91 00000 00000" className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400" />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="goals" className="text-sm font-semibold text-zinc-700">What specific workflows or AI goals do you want to discuss?</label>
                      <textarea id="goals" rows={4} required className="w-full border border-zinc-300 rounded-md px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-y"></textarea>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-3 rounded-md text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                        Request Session
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

