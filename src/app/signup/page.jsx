"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, CheckCircle2, User, Mail, Phone, Lock, UserPlus, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const isPasswordValid = password.length >= 8;

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    const result = await signup(data);
    
    if (result.success) {
      toast.success("Account created successfully!");
      router.push("/onboarding");
    } else {
      toast.error(result.error || "Signup failed. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#1C1C1C] via-[#2E2E2E] to-[#1C1C1C]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#FF7F11]/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FF7F11]/15 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <Image 
              src="/assets/logos/4Trades_Banner_Logo.webp" 
              alt="4Trades.ai Logo" 
              width={240}
              height={48}
              priority
              className="h-12 w-auto animate-scale-in"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Voice Agent Onboarding
          </h1>
          <p className="text-[#F5F5F5] text-base">
            Set up your AI voice agent onboarding
          </p>
        </div>

        {/* Signup Card */}
        <Card className="border-2 border-[#FF7F11]/30 shadow-2xl animate-slide-up backdrop-blur-xl bg-[#2E2E2E]/90 hover:shadow-[0_20px_60px_rgba(255,127,17,0.4)] hover:border-[#FF7F11]/50 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center icon-circle-hover">
                <div className="icon-circle">
                  <UserPlus className="h-5 w-5" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-[#E0E0E0]">
                  Get started with your voice agent setup
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-[#FF7F11]" />
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-4 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#FF7F11]" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-4 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#FF7F11]" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-4 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#FF7F11]" />
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="bg-[#1C1C1C] border-2 border-[#3E3E3E] text-white placeholder:text-[#A1A1AA] h-12 pl-4 pr-12 rounded-xl focus:border-[#FF7F11] focus:ring-2 focus:ring-[#FF7F11]/20 transition-all duration-300"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#FF7F11] transition-all duration-300 hover:scale-110"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1 animate-slide-in-right">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    {errors.password.message}
                  </p>
                )}
                {!errors.password && (
                  <div className="flex items-center gap-2 text-xs mt-1.5">
                    {isPasswordValid ? (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="h-4 w-4 animate-scale-in" />
                        <span className="font-medium">Strong password</span>
                      </div>
                    ) : (
                      <span className="text-[#71717A]">Must be at least 8 characters</span>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-orange hover:shadow-[0_6px_20px_rgba(255,127,17,0.4)] text-white font-semibold h-12 rounded-xl shine-effect hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 transition-all duration-300 text-base mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create Account</span>
                    <UserPlus className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0E0E0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#2E2E2E] text-[#E0E0E0]">or</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#E0E0E0]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#FF7F11] hover:text-[#E46F00] hover:underline transition-all duration-300"
                >
                  Log In
                </Link>
              </p>
            </div>
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
