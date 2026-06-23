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
    <div className={`flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="w-16 h-16 rounded-2xl bg-brand-lavender text-brand-primary flex items-center justify-center mb-4 shadow-sm">
              {step.icon}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold">
                {index + 1}
              </span>
              <h4 className="font-bold text-text-primary">{step.title}</h4>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="hidden md:block text-brand-lavender">
              <ArrowRight className="w-8 h-8" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
