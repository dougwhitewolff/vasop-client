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
  triggerMethod: z.enum(["pound_key", "keyword"]).optional(),
}).refine(
  (data) => {
    if (data.enabled) {
      return data.forwardToNumber && data.forwardToNumber.length >= 10 && data.triggerMethod;
    }
    return true;
  },
  {
    message: "Phone number and trigger method are required when emergency forwarding is enabled",
    path: ["forwardToNumber"],
  }
);

const triggerMethods = [
  {
    value: "pound_key",
    label: "Press # Key",
    badge: "Recommended",
    description: "Customer hears: \"If this is an emergency, press the pound key now.\"",
    benefits: ["Clear and simple", "Works for all callers"],
  },
  {
    value: "keyword",
    label: "Say \"Emergency\"",
    description: "AI detects keywords like \"emergency\", \"urgent\", or \"help now\" and forwards call.",
    benefits: [],
    warning: "May have false triggers",
  },
];

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
      triggerMethod: "pound_key",
    },
  });

  const enabled = watch("enabled");
  const forwardToNumber = watch("forwardToNumber");
  const triggerMethod = watch("triggerMethod");

  const onSubmit = (formData) => {
    onNext(formData);
  };

  const businessName = businessData?.businessName || "Your Business";
  const agentName = voiceAgentData?.agentName || "the AI assistant";

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Emergency Call Handling (Optional)
        </h2>
        <p className="text-zinc-600">
          Allow customers to reach you immediately for urgent situations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Toggle */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-zinc-900 mb-2">
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
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forwardToNumber">
                  Phone Number for Emergency Forwarding <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="forwardToNumber"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="pl-10"
                    {...register("forwardToNumber")}
                  />
                </div>
                {errors.forwardToNumber && (
                  <p className="text-sm text-red-500">{errors.forwardToNumber.message}</p>
                )}
                <p className="text-xs text-zinc-500">
                  This number will receive emergency calls immediately. Make sure it's always available.
                </p>
              </div>
            </Card>

            {/* Trigger Method */}
            <Card className="p-6 space-y-4">
              <div className="space-y-3">
                <Label>
                  How Should Customers Trigger Emergency Forwarding? <span className="text-red-500">*</span>
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {triggerMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`
                        relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${triggerMethod === method.value
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-300 hover:border-zinc-400"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={method.value}
                        {...register("triggerMethod")}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${triggerMethod === method.value
                                ? "border-zinc-900"
                                : "border-zinc-300"
                              }
                            `}
                          >
                            {triggerMethod === method.value && (
                              <div className="w-3 h-3 rounded-full bg-zinc-900" />
                            )}
                          </div>
                          <span className="font-semibold text-zinc-900">
                            {method.label}
                          </span>
                        </div>
                        {method.badge && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 mb-3">
                        {method.description}
                      </p>
                      {method.benefits.length > 0 && (
                        <div className="space-y-1">
                          {method.benefits.map((benefit, i) => (
                            <p key={i} className="text-xs text-green-700 flex items-center gap-1">
                              <span>✓</span> {benefit}
                            </p>
                          ))}
                        </div>
                      )}
                      {method.warning && (
                        <p className="text-xs text-amber-700 flex items-center gap-1 mt-2">
                          <AlertCircle className="h-3 w-3" /> {method.warning}
                        </p>
                      )}
                    </label>
                  ))}
                </div>
                {errors.triggerMethod && (
                  <p className="text-sm text-red-500">{errors.triggerMethod.message}</p>
                )}
              </div>
            </Card>

            {/* Preview */}
            {forwardToNumber && triggerMethod && (
              <Card className="p-6 bg-zinc-50 border-zinc-300 animate-fade-in">
                <div className="flex items-start gap-3 mb-3">
                  <Phone className="h-5 w-5 text-zinc-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2">
                      How it will work:
                    </h4>
                    <p className="text-sm text-zinc-700 mb-3">
                      When a customer calls, they'll hear:
                    </p>
                    <div className="bg-white border border-zinc-300 rounded-lg p-4 mb-3">
                      <p className="text-zinc-900 italic">
                        "Thanks for calling {businessName}, I'm {agentName}. 
                        {triggerMethod === "pound_key" 
                          ? " If this is an emergency, press the pound key now to speak with someone immediately."
                          : " If this is an emergency, please let me know and I'll connect you immediately."
                        }"
                      </p>
                    </div>
                    <p className="text-sm text-zinc-700">
                      {triggerMethod === "pound_key" 
                        ? `If they press #, the call forwards to ${forwardToNumber}`
                        : `If they say "emergency" or similar keywords, the call forwards to ${forwardToNumber}`
                      }
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            ← Back to Step 3
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSave(handleSubmit((data) => data)())}
            >
              Save & Continue Later
            </Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800">
              Continue to Step 5 →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

