"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            4Trades.ai Voice Agent Onboarding
          </h1>
          <p className="text-zinc-600 text-sm">
            Reset your password
          </p>
        </div>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </Link>

        {/* Card */}
        <Card className="border-zinc-300 shadow-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-zinc-900">
              {step === 1 ? "Forgot Password?" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-zinc-600">
              {step === 1 
                ? "Enter your email address and we'll send you a reset code"
                : "Enter the code from your email and your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-900 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-500"
                    {...registerEmail("email")}
                  />
                  {emailErrors.email && (
                    <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
                {/* Email Display */}
                <div className="bg-zinc-100 border border-zinc-300 rounded-md p-3">
                  <p className="text-sm text-zinc-600">Sending code to:</p>
                  <p className="text-sm font-medium text-zinc-900">{email}</p>
                </div>

                {/* OTP */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-zinc-900 font-medium">
                    Reset Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-500 text-center text-2xl tracking-widest font-mono"
                    {...registerReset("otp")}
                  />
                  {resetErrors.otp && (
                    <p className="text-sm text-red-500">{resetErrors.otp.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-zinc-900 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-500"
                    {...registerReset("newPassword")}
                  />
                  {resetErrors.newPassword && (
                    <p className="text-sm text-red-500">{resetErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-900 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-500"
                    {...registerReset("confirmPassword")}
                  />
                  {resetErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{resetErrors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                {/* Resend Code */}
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-zinc-600 hover:text-zinc-900 underline"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

