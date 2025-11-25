"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Mic, Volume2, Pause, Square, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const voiceAgentSchema = z.object({
  agentName: z.string().min(2, "Please enter an agent name").max(20, "Agent name must be 20 characters or less"),
  agentPersonality: z.enum(["professional", "friendly", "formal"], {
    required_error: "Please select a personality type",
  }),
  greeting: z.string().min(20, "Greeting must be at least 20 characters").max(500, "Greeting must be 500 characters or less"),
  voice: z.string().min(1, "Please select a voice"),
});

const personalities = [
  {
    value: "professional",
    label: "Professional",
    description: "Efficient and business-focused. Gets to the point.",
  },
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and conversational. Casual but helpful.",
  },
  {
    value: "formal",
    label: "Formal",
    description: "Business-like and corporate tone. Very professional.",
  },
];

const voices = [
  { value: "ash", label: "Voice 1", gender: "male" },
  { value: "alloy", label: "Voice 2", gender: "female" },
  { value: "coral", label: "Voice 3", gender: "female" },
  { value: "echo", label: "Voice 4", gender: "male" },
  { value: "sage", label: "Voice 5", gender: "female" },
  { value: "shimmer", label: "Voice 6", gender: "female" },
];

export function Step2VoiceAgent({ data, businessData, onNext, onBack, onSave }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voiceAgentSchema),
    defaultValues: data || { voice: "ash" },
  });

  const agentName = watch("agentName", "");
  const greeting = watch("greeting", "");
  const selectedPersonality = watch("agentPersonality");
  const selectedVoice = watch("voice", "ash");

  const generateGreeting = () => {
    setIsGenerating(true);
    
    // Simulate greeting generation
    setTimeout(() => {
      const businessName = businessData?.businessName || "Your Business";
      const name = agentName || "the AI assistant";
      
      const greetingTemplate = `Hi there, I'm ${name}, ${businessName}'s virtual assistant. Parts of this call may be recorded so we can better understand your needs and improve our service. To get started, what are you calling about today?`;
      
      setValue("greeting", greetingTemplate);
      toast.success("Greeting generated! Feel free to customize it");
      setIsGenerating(false);
    }, 1000);
  };

  const onSubmit = (formData) => {
    onNext(formData);
  };

  const playVoicePreview = async () => {
    if (!greeting || !selectedVoice) {
      toast.error("Please enter a greeting message and select a voice");
      return;
    }

    // If audio exists and is paused, resume it
    if (currentAudio && isPaused) {
      currentAudio.play();
      setIsPlayingAudio(true);
      setIsPaused(false);
      return;
    }

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setIsPlayingAudio(true);
    setIsPaused(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/preview-voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: greeting,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Failed to generate voice preview";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);

      audio.onended = () => {
        setIsPlayingAudio(false);
        setIsPaused(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setIsPaused(false);
        toast.error("Failed to play audio");
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Voice preview error:", error);
      toast.error(error.message || "Failed to generate voice preview");
      setIsPlayingAudio(false);
      setIsPaused(false);
    }
  };

  const pauseVoicePreview = () => {
    if (currentAudio && isPlayingAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
      setIsPaused(true);
    }
  };

  const stopVoicePreview = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlayingAudio(false);
      setIsPaused(false);
      setCurrentAudio(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">
          Configure Your Voice Agent
        </h2>
        <p className="text-[#71717A] text-lg">
          Customize how your AI assistant will interact with callers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Agent Identity */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <User className="h-6 w-6 text-[#FF7F11]" />
            Agent Identity
          </h3>

          <div className="space-y-2">
            <Label htmlFor="agentName" className="text-[#1C1C1C] font-semibold">
              Agent Name <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <Input
                  id="agentName"
                  placeholder="Alex"
                  className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
                  {...register("agentName")}
                />
                {errors.agentName && (
                  <p className="text-sm text-red-500 font-medium">{errors.agentName.message}</p>
                )}
                <p className="text-sm text-[#71717A]">
                  Choose a friendly, professional name for your AI assistant (e.g., Mason, Alex, Sarah)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[#1C1C1C] font-semibold">
              Agent Personality <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-[#71717A] mb-3">
              How should your agent communicate with callers?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalities.map((personality) => (
                <label
                  key={personality.value}
                  className={`
                    relative flex flex-col p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 group
                    ${selectedPersonality === personality.value
                      ? "border-[#FF7F11] bg-[#FF7F11]/5 shadow-lg scale-105"
                      : "border-[#E0E0E0] hover:border-[#FF7F11]/50 hover:bg-[#F5F5F5]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={personality.value}
                    {...register("agentPersonality")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${selectedPersonality === personality.value
                          ? "border-[#FF7F11] bg-gradient-orange"
                          : "border-[#E0E0E0]"
                        }
                      `}
                    >
                      {selectedPersonality === personality.value && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`font-bold transition-colors ${selectedPersonality === personality.value ? "text-[#FF7F11]" : "text-[#1C1C1C]"}`}>
                      {personality.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#71717A] leading-relaxed">
                    {personality.description}
                  </p>
                </label>
              ))}
            </div>
            {errors.agentPersonality && (
              <p className="text-sm text-red-500 font-medium">{errors.agentPersonality.message}</p>
            )}
          </div>
        </Card>

        {/* Greeting Message */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#FF7F11]" />
            Greeting Message
          </h3>

          <div className="space-y-2">
            <Label htmlFor="greeting" className="text-[#1C1C1C] font-semibold">
              Greeting Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="greeting"
              rows={4}
              placeholder="Hi there, I'm [Agent Name], [Business Name]'s virtual assistant..."
              className="border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300 resize-none"
              {...register("greeting")}
            />
            {errors.greeting && (
              <p className="text-sm text-red-500 font-medium">{errors.greeting.message}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#71717A]">
                This is what your agent will say when answering calls
              </p>
              <span className="text-xs text-zinc-500">
                {greeting.length} / 500 characters
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={generateGreeting}
            disabled={isGenerating || !agentName || !selectedPersonality}
            className="w-full h-12 border-2 border-[#FF7F11]/50 text-[#FF7F11] hover:bg-[#FF7F11]/10 hover:border-[#FF7F11] font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {isGenerating ? "Generating..." : "Auto-Generate Greeting"}
          </Button>
        </Card>

        {/* Voice Selection */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <Mic className="h-6 w-6 text-[#FF7F11]" />
            Voice Selection
          </h3>

          <div className="space-y-3">
            <Label className="text-[#1C1C1C] font-semibold flex items-center gap-2">
              <Mic className="h-5 w-5 text-[#FF7F11]" />
              Choose Voice <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-[#71717A] mb-4">
              Select the voice that will be used for your AI assistant
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {voices.map((voice) => (
                <label
                  key={voice.value}
                  className={`
                    relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group
                    ${selectedVoice === voice.value
                      ? "border-[#FF7F11] bg-[#FF7F11]/5 shadow-lg scale-105"
                      : "border-[#E0E0E0] hover:border-[#FF7F11]/50 hover:bg-[#F5F5F5]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={voice.value}
                    {...register("voice")}
                    className="sr-only"
                  />
                  
                  {/* Gender Icon */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${selectedVoice === voice.value
                      ? "bg-gradient-orange text-white scale-110"
                      : "bg-[#F5F5F5] text-[#71717A] group-hover:bg-[#FF7F11]/10 group-hover:text-[#FF7F11]"
                    }
                  `}>
                    {voice.gender === "male" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  
                  {/* Voice Label */}
                  <span className={`text-sm font-semibold transition-colors ${selectedVoice === voice.value ? "text-[#FF7F11]" : "text-[#2E2E2E] group-hover:text-[#FF7F11]"}`}>
                    {voice.label}
                  </span>
                  
                  {/* Gender Label */}
                  <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full transition-colors ${selectedVoice === voice.value ? "text-[#FF7F11] bg-[#FF7F11]/10" : "text-[#71717A]"}`}>
                    {voice.gender === "male" ? "Male" : "Female"}
                  </span>
                  
                  {/* Selection indicator */}
                  {selectedVoice === voice.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-orange rounded-full flex items-center justify-center animate-scale-in">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.voice && (
              <p className="text-sm text-red-500">{errors.voice.message}</p>
            )}
          </div>

          {/* Preview Card */}
          {greeting && (
            <div className="bg-zinc-50 border border-zinc-300 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-zinc-700" />
                  <span className="text-sm font-semibold text-zinc-900">Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={playVoicePreview}
                    disabled={isPlayingAudio || !greeting || !selectedVoice}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    {isPaused ? "Resume" : isPlayingAudio ? "Playing..." : "Listen"}
                  </Button>
                  {(isPlayingAudio || isPaused) && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={pauseVoicePreview}
                        disabled={!isPlayingAudio}
                        className="flex items-center gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={stopVoicePreview}
                        className="flex items-center gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-zinc-700 italic leading-relaxed">
                &quot;{greeting}&quot;
              </p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            ← Back to Step 1
          </Button>
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const data = watch();
                onSave(data);
              }}
              className="h-12 px-6 border-2 border-[#E0E0E0] text-[#2E2E2E] hover:bg-[#F5F5F5] hover:border-[#FF7F11]/50 font-semibold rounded-xl transition-all duration-300"
            >
              Save & Continue Later
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-8 bg-gradient-orange hover:shadow-[0_8px_24px_rgba(255,127,17,0.4)] text-white font-bold rounded-xl shine-effect hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              Continue to Step 3 →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

