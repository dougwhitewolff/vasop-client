"use client";

import { Check, CircleDot } from "lucide-react";

const steps = [
  { number: 1, label: "Business Profile" },
  { number: 2, label: "Voice Agent Config" },
  { number: 3, label: "Collection Fields" },
  { number: 4, label: "Emergency Handling" },
  { number: 5, label: "Review & Submit" },
];

export function ProgressIndicator({ currentStep, onStepClick }) {
  return (
    <>
      {/* Desktop Progress Bar */}
      <div className="hidden md:block w-full mb-10">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-[#E0E0E0] rounded-full" style={{ zIndex: 0 }}>
            <div
              className="h-full bg-gradient-orange rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            >
              <div className="absolute inset-0 loading-shimmer"></div>
            </div>
          </div>

          {/* Step Nodes */}
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative animate-scale-in"
                style={{ zIndex: 1, animationDelay: `${step.number * 0.1}s` }}
              >
                <button
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold
                    transition-all duration-300 mb-3 relative group
                    ${isCompleted
                      ? "bg-gradient-orange text-white shadow-lg hover:shadow-[0_8px_20px_rgba(255,127,17,0.4)] cursor-pointer hover:scale-110"
                      : isCurrent
                      ? "bg-gradient-orange text-white shadow-lg ring-4 ring-[#FF7F11]/20 animate-pulse-subtle"
                      : "bg-white border-2 border-[#E0E0E0] text-[#71717A]"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-default"}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 animate-scale-in" />
                  ) : isCurrent ? (
                    <CircleDot className="h-6 w-6 animate-pulse" />
                  ) : (
                    <span className="text-base">{step.number}</span>
                  )}
                  
                  {/* Shine effect on completed/current */}
                  {(isCompleted || isCurrent) && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  )}
                </button>
                <span
                  className={`
                    text-sm text-center max-w-[90px] font-medium transition-all duration-300
                    ${isCurrent 
                      ? "text-[#FF7F11] font-bold scale-105" 
                      : isCompleted
                      ? "text-[#1C1C1C] font-semibold"
                      : "text-[#71717A]"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden mb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-[#1C1C1C]">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs text-[#FF7F11] font-semibold bg-[#FF7F11]/10 px-3 py-1 rounded-full">
            {steps[currentStep - 1].label}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#E0E0E0] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-orange transition-all duration-700 ease-out relative"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          >
            <div className="absolute inset-0 loading-shimmer"></div>
          </div>
        </div>
        
        {/* Step number indicator for mobile */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${currentStep >= step.number
                  ? "bg-[#FF7F11] w-8"
                  : "bg-[#E0E0E0]"
                }
              `}
            />
          ))}
        </div>
      </div>
    </>
  );
}
