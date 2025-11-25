"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";

const emergencyHandlingSchema = z.object({
  enabled: z.boolean(),
  forwardToNumber: z.string().optional(),
}).refine(
  (data) => {
    if (data.enabled) {
      return data.forwardToNumber && data.forwardToNumber.length >= 10;
    }
    return true;
  },
  {
    message: "Phone number is required when emergency forwarding is enabled",
    path: ["forwardToNumber"],
  }
);

export function Step4EmergencyHandling({ data, businessData, voiceAgentData, onNext, onBack, onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emergencyHandlingSchema),
    defaultValues: data || {
      enabled: false,
      forwardToNumber: "",
    },
  });

  const enabled = watch("enabled");
  const forwardToNumber = watch("forwardToNumber");

  const onSubmit = (formData) => {
    // Always set triggerMethod to pound_key
    const dataWithTrigger = {
      ...formData,
      triggerMethod: formData.enabled ? "pound_key" : null,
    };
    onNext(dataWithTrigger);
  };

  const businessName = businessData?.businessName || "Your Business";
  const agentName = voiceAgentData?.agentName || "the AI assistant";

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">
          Emergency Call Handling (Optional)
        </h2>
        <p className="text-[#71717A] text-lg">
          Allow customers to reach you immediately for urgent situations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Toggle */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-[#1C1C1C] mb-2 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-[#FF7F11]" />
                Emergency Call Forwarding
              </h3>
              <p className="text-sm text-zinc-600">
                Allow customers to be forwarded to you immediately for urgent issues. 
                When enabled, callers can press a button or say a keyword to reach you directly.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                {...register("enabled")}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-zinc-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zinc-900"></div>
            </label>
          </div>
        </Card>

        {/* When Disabled */}
        {!enabled && (
          <Card className="p-6 bg-blue-50 border-blue-200 animate-fade-in">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Emergency forwarding is disabled
                </h4>
                <p className="text-sm text-blue-800">
                  All calls will follow the standard information collection flow. 
                  You can enable this feature later if needed.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* When Enabled */}
        {enabled && (
          <div className="space-y-6 animate-slide-up">
            {/* Forward To Number */}
            <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
              <div className="space-y-2">
                <Label htmlFor="forwardToNumber" className="text-[#1C1C1C] font-semibold">
                  Phone Number for Emergency Forwarding <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#71717A]" />
                  <Input
                    id="forwardToNumber"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="h-12 pl-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
                    {...register("forwardToNumber")}
                  />
                </div>
                {errors.forwardToNumber && (
                  <p className="text-sm text-red-500 font-medium">{errors.forwardToNumber.message}</p>
                )}
                <p className="text-sm text-[#71717A]">
                  This number will receive emergency calls immediately. Make sure it&apos;s always available.
                </p>
              </div>
            </Card>

            {/* Preview */}
           
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 px-6 border-2 border-[#E0E0E0] text-[#2E2E2E] hover:bg-[#F5F5F5] hover:border-[#FF7F11]/50 font-semibold rounded-xl transition-all duration-300"
          >
            ← Back to Step 3
          </Button>
          <div className="flex gap-4">
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
              Continue to Step 5 →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

