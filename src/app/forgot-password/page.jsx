"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Mail, ShieldCheck, Lock, RefreshCw, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmitEmail = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await authAPI.forgotPassword({ email: data.email });
      
      if (result.success) {
        setEmail(data.email);
        setStep(2);
        toast.success("Password reset code sent! Check your email.");
      } else {
        toast.error(result.message || "Failed to send reset code. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await authAPI.resetPassword({
        email: email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      
      if (result.success) {
        toast.success("Password reset successful! You can now log in.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      const result = await authAPI.forgotPassword({ email });
      
      if (result.success) {
        toast.success("New reset code sent! Check your email.");
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#1C1C1C] via-[#2E2E2E] to-[#1C1C1C]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF7F11]/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7F11]/15 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-orange rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            4Trades.ai Voice Agent
          </h1>
          <p className="text-[#F5F5F5] text-sm">
            Reset your password
          </p>
        </div>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-[#FF7F11] hover:text-[#E46F00] mb-6 transition-all duration-300 font-medium hover:-translate-x-1 group"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Login
        </Link>

        {/* Card */}
        <Card className="border-2 border-[#FF7F11]/30 shadow-2xl animate-slide-up backdrop-blur-xl bg-[#2E2E2E]/90 hover:shadow-[0_20px_60px_rgba(255,127,17,0.4)] hover:border-[#FF7F11]/50 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center icon-circle-hover">
                <div className="icon-circle">
                  {step === 1 ? <Mail className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {step === 1 ? "Forgot Password?" : "Reset Your Password"}
                </CardTitle>
                <CardDescription className="text-[#E0E0E0]">
                  {step === 1 
                    ? "We'll send you a reset code"
                    : "Enter the code and new password"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#FF7F11]" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-4 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                    {...registerEmail("email")}
                  />
                  {emailErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-orange hover:shadow-[0_6px_20px_rgba(255,127,17,0.4)] text-white font-semibold h-12 rounded-xl shine-effect hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Send Reset Code</span>
                      <Mail className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-5">
                {/* Email Display */}
                <div className="bg-[#1C1C1C] border-2 border-[#FF7F11]/30 rounded-xl p-4 border-accent-left">
                  <p className="text-sm text-[#A1A1AA]">Sending code to:</p>
                  <p className="text-sm font-semibold text-white mt-1">{email}</p>
                </div>

                {/* OTP */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-white font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#FF7F11]" />
                    Reset Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] text-center text-3xl tracking-[0.5em] font-mono h-16 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                    {...registerReset("otp")}
                  />
                  {resetErrors.otp && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {resetErrors.otp.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#FF7F11]" />
                    New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-12 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                      {...registerReset("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FF7F11] transition-all duration-300 hover:scale-110"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {resetErrors.newPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {resetErrors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#FF7F11]" />
                    Confirm New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-12 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                      {...registerReset("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FF7F11] transition-all duration-300 hover:scale-110"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-orange hover:shadow-[0_6px_20px_rgba(255,127,17,0.4)] text-white font-semibold h-12 rounded-xl shine-effect hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Reset Password</span>
                      <RefreshCw className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-[#FF7F11] hover:text-[#E46F00] font-medium hover:underline transition-all duration-300 disabled:opacity-50"
                  >
                    Didn&apos;t receive the code? Resend
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-[#F5F5F5] animate-fade-in" style={{ animationDelay: "0.3s" }}>
          © 2025 4Trades.ai. All rights reserved.
        </p>
      </div>
    </div>
  );
}

