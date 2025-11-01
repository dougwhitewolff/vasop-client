"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { Step1BusinessProfile } from "@/components/onboarding/Step1BusinessProfile";
import { Step2VoiceAgent } from "@/components/onboarding/Step2VoiceAgent";
import { Step3CollectionFields } from "@/components/onboarding/Step3CollectionFields";
import { Step4EmergencyHandling } from "@/components/onboarding/Step4EmergencyHandling";
import { Step5EmailConfig } from "@/components/onboarding/Step5EmailConfig";
import { Step6Review } from "@/components/onboarding/Step6Review";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessProfile: null,
    voiceAgent: null,
    collectionFields: null,
    emergencyHandling: null,
    emailConfig: null,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load saved draft from localStorage
    const savedDraft = localStorage.getItem("vasop-onboarding-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.data);
        setCurrentStep(draft.currentStep);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [user, router]);

  const saveDraft = (data, step) => {
    const draft = {
      data,
      currentStep: step,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem("vasop-onboarding-draft", JSON.stringify(draft));
    toast.success("Progress saved!");
  };

  const handleNext = (stepData, stepNumber) => {
    const updatedData = { ...formData };
    
    switch (stepNumber) {
      case 1:
        updatedData.businessProfile = stepData;
        break;
      case 2:
        updatedData.voiceAgent = stepData;
        break;
      case 3:
        updatedData.collectionFields = stepData;
        break;
      case 4:
        updatedData.emergencyHandling = stepData;
        break;
      case 5:
        updatedData.emailConfig = stepData;
        break;
    }
    
    setFormData(updatedData);
    saveDraft(updatedData, stepNumber + 1);
    setCurrentStep(stepNumber + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (stepData, stepNumber) => {
    const updatedData = { ...formData };
    
    switch (stepNumber) {
      case 1:
        updatedData.businessProfile = stepData;
        break;
      case 2:
        updatedData.voiceAgent = stepData;
        break;
      case 3:
        updatedData.collectionFields = stepData;
        break;
      case 4:
        updatedData.emergencyHandling = stepData;
        break;
      case 5:
        updatedData.emailConfig = stepData;
        break;
    }
    
    setFormData(updatedData);
    saveDraft(updatedData, stepNumber);
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Clear draft
    localStorage.removeItem("vasop-onboarding-draft");
    
    // Store submission
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
      submissionId: `4t-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${new Date().toISOString().split('T')[0]}`,
    };
    localStorage.setItem("vasop-submission", JSON.stringify(submission));
    
    toast.success("Your information has been successfully submitted. Admin will review and contact you soon.");
    
    setTimeout(() => {
      router.push("/status");
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-300 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">
              4Trades Voice Agent Onboarding
            </h1>
            <p className="text-sm text-zinc-600">Welcome, {user.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-zinc-600 hover:text-zinc-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProgressIndicator currentStep={currentStep} onStepClick={handleStepClick} />

        <div className="mt-8">
          {currentStep === 1 && (
            <Step1BusinessProfile
              data={formData.businessProfile}
              onNext={(data) => handleNext(data, 1)}
              onSave={(data) => handleSave(data, 1)}
            />
          )}

          {currentStep === 2 && (
            <Step2VoiceAgent
              data={formData.voiceAgent}
              businessData={formData.businessProfile}
              onNext={(data) => handleNext(data, 2)}
              onBack={handleBack}
              onSave={(data) => handleSave(data, 2)}
            />
          )}

          {currentStep === 3 && (
            <Step3CollectionFields
              data={formData.collectionFields}
              onNext={(data) => handleNext(data, 3)}
              onBack={handleBack}
              onSave={(data) => handleSave(data, 3)}
            />
          )}

          {currentStep === 4 && (
            <Step4EmergencyHandling
              data={formData.emergencyHandling}
              businessData={formData.businessProfile}
              voiceAgentData={formData.voiceAgent}
              onNext={(data) => handleNext(data, 4)}
              onBack={handleBack}
              onSave={(data) => handleSave(data, 4)}
            />
          )}

          {currentStep === 5 && (
            <Step5EmailConfig
              data={formData.emailConfig}
              onNext={(data) => handleNext(data, 5)}
              onBack={handleBack}
              onSave={(data) => handleSave(data, 5)}
            />
          )}

          {currentStep === 6 && (
            <Step6Review
              businessProfile={formData.businessProfile}
              voiceAgent={formData.voiceAgent}
              collectionFields={formData.collectionFields}
              emergencyHandling={formData.emergencyHandling}
              emailConfig={formData.emailConfig}
              onEdit={handleStepClick}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onSave={() => handleSave(formData, 6)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-300 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-sm text-center text-zinc-600">
            © 2024 4Trades Voice Agent Onboarding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

