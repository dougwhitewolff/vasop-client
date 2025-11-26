"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingAPI } from "@/lib/api";
import { Clock, Copy, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function StatusPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Don't redirect while still checking authentication
    if (isLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    // Load submission from server
    const loadSubmission = async () => {
      try {
        const result = await onboardingAPI.getMySubmission();
        if (!result || !result.submission || !result.submission.isSubmitted) {
          // No submitted application found, redirect to onboarding
          router.push("/onboarding");
          return;
        }
        setSubmission(result.submission);
      } catch (error) {
        console.error("Failed to load submission:", error);
        router.push("/onboarding");
      }
    };

    loadSubmission();
  }, [user, router, isLoading]);

  const handleCopyId = () => {
    if (submission?.submissionId) {
      navigator.clipboard.writeText(submission.submissionId);
      setCopied(true);
      toast.success("Submission ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading || !user || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  const submittedDate = new Date(submission.submittedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF7F11]/5 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-[#FF7F11]/5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: "1.5s" }}></div>
      </div>

      {/* Header */}
      <header className="bg-[#1C1C1C]/95 backdrop-blur-md border-b-2 border-[#FF7F11]/20 shadow-lg relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
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
              <p className="text-sm text-[#FFB266] font-medium">Welcome, {user.name}</p>
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
      <main className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-10 text-center animate-slide-up border-2 border-[#E0E0E0] shadow-2xl backdrop-blur-sm bg-white/80">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl animate-scale-in">
                <Clock className="h-12 w-12 text-white animate-pulse-subtle" />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-[#1C1C1C] mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Under Review
            </h2>

            <p className="text-lg text-[#2E2E2E] mb-8 font-medium animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Your request is being reviewed by our team
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-center gap-2 text-base text-green-700 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-600 animate-scale-in" />
                Submitted: {submittedDate}
              </div>
            </div>

            <div className="text-center space-y-3 mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <p className="text-[#2E2E2E] font-medium text-lg">
                We&apos;ll contact you within <span className="text-[#FF7F11] font-bold text-xl">2-3 business days</span>
              </p>
              <p className="text-base text-[#71717A]">
                Our team will reach out with your phone number and next steps
              </p>
            </div>

            {/* Submission ID */}
            <div className="border-t-2 border-[#E0E0E0] pt-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <p className="text-sm text-[#71717A] mb-3 font-medium">Your Submission ID:</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-xl font-mono font-bold text-[#1C1C1C] bg-[#F5F5F5] px-6 py-3 rounded-xl border-2 border-[#E0E0E0] shadow-md">
                  {submission.submissionId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="text-[#71717A] hover:text-[#FF7F11] hover:bg-[#FF7F11]/10 transition-all duration-300 h-12 w-12 rounded-xl"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-600 animate-scale-in" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-[#71717A] mt-3 font-medium">
                Save this ID for reference
              </p>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-8 bg-[#FF7F11]/10 animate-slide-up border-accent-left" style={{ animationDelay: "0.6s" }}>
            <h3 className="font-bold text-[#FF7F11] mb-5 text-xl flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              What&apos;s Next?
            </h3>
            <div className="space-y-4 text-base text-[#2E2E2E]">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
                <p className="font-medium pt-1">Our team will review your business information and requirements</p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
                <p className="font-medium pt-1">We&apos;ll set up your custom voice agent with your specifications</p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">3</span>
                </div>
                <p className="font-medium pt-1">We will notify you when your voice agent is ready</p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-gradient-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <span className="text-sm font-bold text-white">4</span>
                </div>
                <p className="font-medium pt-1">Start receiving calls through your AI voice agent!</p>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6 text-center animate-slide-up border-2 border-[#E0E0E0] shadow-lg backdrop-blur-sm bg-white/80" style={{ animationDelay: "0.7s" }}>
            <p className="text-sm text-[#71717A] mb-2">
              Have questions? Need to make changes?
            </p>
            <p className="text-[#1C1C1C] font-semibold text-base">
              Contact us at{" "}
              <a
                href="mailto:info@4trades.ai"
                className="text-[#FF7F11] underline hover:text-[#E46F00] transition-colors duration-300 font-bold"
              >
                info@4trades.ai
              </a>
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t-2 border-[#E0E0E0] mt-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-sm text-center text-[#71717A]">
            © 2025 4Trades.ai Voice Agent Onboarding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

