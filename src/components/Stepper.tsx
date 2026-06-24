import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className = '' }: StepperProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-0 min-w-0">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step card */}
            <div className="flex flex-col items-center text-center flex-1 min-w-0 px-2 py-4">
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center mb-4 shadow-sm flex-shrink-0">
                {step.icon}
              </div>

              {/* Step number badge + title on same line */}
              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">
                  {index + 1}
                </span>
                <h4 className="font-bold text-text-primary text-sm leading-snug">
                  {step.title}
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary leading-relaxed max-w-[160px]">
                {step.description}
              </p>
            </div>

            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center flex-shrink-0 -mt-10 text-brand-lavender">
                <ArrowRight className="w-6 h-6 text-brand-primary/40" strokeWidth={2} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
