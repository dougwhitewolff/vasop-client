"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const emailConfigSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
});

export function Step5EmailConfig({ data, onNext, onBack, onSave }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: data || {},
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">
          Email Configuration
        </h2>
        <p className="text-[#71717A] text-lg">
          Where should we send call summaries?
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Address */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <p className="text-base text-[#71717A]">
            After each call, you&apos;ll receive an email with the customer&apos;s information 
            and conversation details.
          </p>

          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="text-[#1C1C1C] font-semibold">
              Send Call Summaries To <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#71717A]" />
              <Input
                id="recipientEmail"
                type="email"
                placeholder="contact@4trades.ai"
                className="h-12 pl-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
                {...register("recipientEmail")}
              />
            </div>
            {errors.recipientEmail && (
              <p className="text-sm text-red-500 font-medium">{errors.recipientEmail.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              You&apos;ll receive an email after each customer call with their details and what they needed
            </p>
          </div>

          {/* Always Enabled */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-base font-semibold text-green-900">
                Email summaries are always enabled
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 bg-zinc-50 border-zinc-300">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-zinc-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-zinc-900 mb-3">
                📧 Email Summary Preview
              </h4>
              
              <div className="bg-white border border-zinc-300 rounded-lg p-4 mb-3">
                <p className="text-sm font-semibold text-zinc-900 mb-2">
                  Subject: New Call - [Customer Name]
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900">You'll receive:</p>
                <ul className="space-y-1.5">
                  {[
                    "Customer contact information",
                    "Reason for their call",
                    "All details they provided",
                    "Urgency level (if collected)",
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-zinc-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 px-6 border-2 border-[#E0E0E0] text-[#2E2E2E] hover:bg-[#F5F5F5] hover:border-[#FF7F11]/50 font-semibold rounded-xl transition-all duration-300"
          >
            ← Back to Step 4
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const data = getValues();
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
              Continue to Step 6 →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

