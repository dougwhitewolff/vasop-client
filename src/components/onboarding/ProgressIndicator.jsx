"use client";

import { Check } from "lucide-react";

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
      <div className="hidden md:block w-full mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-300" style={{ zIndex: 0 }}>
            <div
              className="h-full bg-zinc-900 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Step Nodes */}
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = currentStep > step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative"
                style={{ zIndex: 1 }}
              >
                <button
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300 mb-2
                    ${isCompleted
                      ? "bg-zinc-900 text-zinc-100 cursor-pointer hover:scale-110"
                      : isCurrent
                      ? "bg-zinc-900 text-zinc-100 ring-4 ring-zinc-300"
                      : "bg-white border-2 border-zinc-300 text-zinc-500"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-default"}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm">{step.number}</span>
                  )}
                </button>
                <span
                  className={`
                    text-xs text-center max-w-[80px] font-medium transition-colors
                    ${isCurrent ? "text-zinc-900 font-semibold" : "text-zinc-600"}
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
      <div className="md:hidden mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-zinc-900">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs text-zinc-600">
            {steps[currentStep - 1].label}
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

