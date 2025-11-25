"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingAPI } from "@/lib/api";
import { CheckCircle2, Circle, Clock, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STEPS = [
  { number: 1, title: "Business Profile", description: "Basic business information" },
  { number: 2, title: "Voice Agent", description: "Configure your AI assistant" },
  { number: 3, title: "Collection Fields", description: "Information to collect from callers" },
  { number: 4, title: "Emergency Handling", description: "Emergency call forwarding" },
  { number: 5, title: "Email Configuration", description: "Call summary settings" },
  { number: 6, title: "Review & Submit", description: "Final review" },
];

export default function ProgressPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't redirect while still checking authentication
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const loadProgress = async () => {
      try {
        const result = await onboardingAPI.getMySubmission();
        
        if (!result || !result.submission || Object.keys(result.submission).length === 0) {
          // No draft found, redirect to onboarding
          router.push("/onboarding");
          return;
        }

        const sub = result.submission;
        
        // If already submitted, go to status page
        if (sub.isSubmitted) {
          router.push("/status");
          return;
        }

        setSubmission(sub);
      } catch (error) {
        console.error("Failed to load progress:", error);
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, router, authLoading]);

  const handleContinue = () => {
    router.push("/onboarding");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || loading || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const currentStep = submission.currentStep || 1;
  const lastSaved = new Date(submission.lastSavedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const completedSteps = currentStep - 1;
  const progressPercentage = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF7F11]/5 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-[#FF7F11]/5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: "1.5s" }}></div>
      </div>

      {/* Header */}
      <header className="bg-[#1C1C1C]/95 backdrop-blur-md border-b-2 border-[#FF7F11]/20 shadow-lg relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/assets/logos/4Trades_Banner_Logo.webp" 
              alt="4Trades.ai Logo" 
              width={180}
              height={36}
              priority
              className="h-9 w-auto"
            />
            <div className="border-l-2 border-[#E0E0E0] pl-4">
              <h1 className="text-lg font-bold text-white">
                Voice Agent Onboarding
              </h1>
              <p className="text-sm text-[#FFB266] font-medium">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white hover:text-[#FFB266] hover:bg-[#FF7F11]/20 transition-all duration-300 font-medium"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        {/* Progress Card */}
        <Card className="p-8 mb-6 animate-slide-up border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-orange rounded-2xl shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#1C1C1C]">Your Progress</h2>
              <p className="text-[#71717A] font-medium">
                Last saved: {lastSaved}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-semibold text-[#1C1C1C]">
                {completedSteps} of {STEPS.length} steps completed
              </span>
              <span className="text-lg font-bold text-[#FF7F11]">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-[#E0E0E0] rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-gradient-orange h-4 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 loading-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleContinue}
              className="flex-1 bg-gradient-orange hover:shadow-[0_8px_24px_rgba(255,127,17,0.4)] text-white font-bold py-7 text-lg rounded-xl shine-effect hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Continue Where You Left Off
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </Card>

        {/* Steps Overview */}
        <Card className="p-8 animate-slide-up border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-[#FF7F11]" />
            Onboarding Steps
          </h3>
          <div className="space-y-4">
            {STEPS.map((step) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div
                  key={step.number}
                  className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-300 animate-slide-up ${
                    isCurrent
                      ? "border-[#FF7F11] bg-[#FF7F11]/5 shadow-lg scale-[1.02]"
                      : isCompleted
                      ? "border-green-300 bg-green-50/50"
                      : "border-[#E0E0E0] bg-white"
                  }`}
                  style={{ animationDelay: `${step.number * 0.1}s` }}
                >
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center shadow-lg animate-scale-in">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full border-3 border-[#FF7F11] bg-white flex items-center justify-center shadow-lg animate-pulse-subtle">
                        <div className="w-3 h-3 rounded-full bg-gradient-orange"></div>
                      </div>
                    ) : (
                      <Circle className="h-8 w-8 text-[#E0E0E0]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-base mb-1 ${
                        isCurrent ? "text-[#FF7F11]" : isCompleted ? "text-green-700" : "text-[#71717A]"
                      }`}
                    >
                      Step {step.number}: {step.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        isCurrent ? "text-[#2E2E2E]" : isCompleted ? "text-green-600" : "text-[#71717A]"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1.5 text-xs font-bold bg-gradient-orange text-white rounded-full shadow-md animate-scale-in">
                        Current
                      </span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <span className="inline-block px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow-md">
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-5 bg-[#FF7F11]/10 border-2 border-[#FF7F11]/30 rounded-xl border-accent-left animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-[#2E2E2E] font-medium flex items-start gap-2">
              <span className="text-2xl flex-shrink-0">💡</span>
              <span><strong className="text-[#FF7F11]">Tip:</strong> Your progress is automatically saved. You can return anytime to continue from where you left off.</span>
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t-2 border-[#E0E0E0] mt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-center text-[#71717A]">
            © 2025 4Trades.ai Voice Agent Onboarding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

