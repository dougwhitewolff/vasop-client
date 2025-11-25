"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const businessProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Please select an industry"),
  website: z.string().optional().or(z.literal("")),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "Please select a state"),
    zip: z.string().regex(/^\d{5}$/, "Please enter a valid ZIP code"),
  }),
  hours: z.object({
    mondayFriday: z.string().min(1, "Please enter your weekday hours"),
    saturday: z.string().min(1, "Please enter Saturday hours or 'Closed'"),
    sunday: z.string().min(1, "Please enter Sunday hours or 'Closed'"),
  }),
});

const industries = [
  "HVAC",
  "Plumbing",
  "Roofing",
  "Electrical",
  "Construction",
  "Landscaping",
  "Fencing",
  "Other",
];

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export function Step1BusinessProfile({ data, onNext, onSave }) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: data || {},
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">
          Tell Us About Your Business
        </h2>
        <p className="text-[#71717A] text-lg">
          Let's start with the basics about your business
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#FF7F11]" />
            Basic Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-[#1C1C1C] font-semibold">
              Business Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessName"
              placeholder="4Trades"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("businessName")}
            />
            {errors.businessName && (
              <p className="text-sm text-red-500 font-medium">{errors.businessName.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              The name of your business as customers know it
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-[#1C1C1C] font-semibold">
              Industry <span className="text-red-500">*</span>
            </Label>
            <select
              id="industry"
              {...register("industry")}
              className="w-full h-12 rounded-xl border-2 border-[#E0E0E0] bg-white px-4 py-2 text-[#1C1C1C] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7F11]/20 focus:border-[#FF7F11] transition-all duration-300"
            >
              <option value="">Select your industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="text-sm text-red-500 font-medium">{errors.industry.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              What type of services does your business provide?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-[#1C1C1C] font-semibold">Website (Optional)</Label>
            <Input
              id="website"
              type="text"
              placeholder="www.4trades.ai"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("website")}
            />
            {errors.website && (
              <p className="text-sm text-red-500 font-medium">{errors.website.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              Your business website if you have one
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#1C1C1C] font-semibold">
              Business Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 font-medium">{errors.phone.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              Main phone number for your business
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1C1C1C] font-semibold">
              Business Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@4trades.ai"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              Main email address for your business
            </p>
          </div>
        </Card>

        {/* Business Address */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-[#FF7F11]" />
            Business Address
          </h3>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-[#1C1C1C] font-semibold">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("address.street")}
            />
            {errors.address?.street && (
              <p className="text-sm text-red-500 font-medium">{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[#1C1C1C] font-semibold">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Portland"
                className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
                {...register("address.city")}
              />
              {errors.address?.city && (
                <p className="text-sm text-red-500 font-medium">{errors.address.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip" className="text-[#1C1C1C] font-semibold">
                ZIP Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zip"
                placeholder="97201"
                className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
                {...register("address.zip")}
              />
              {errors.address?.zip && (
                <p className="text-sm text-red-500 font-medium">{errors.address.zip.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-[#1C1C1C] font-semibold">
              State <span className="text-red-500">*</span>
            </Label>
            <select
              id="state"
              {...register("address.state")}
              className="w-full h-12 rounded-xl border-2 border-[#E0E0E0] bg-white px-4 py-2 text-[#1C1C1C] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7F11]/20 focus:border-[#FF7F11] transition-all duration-300"
            >
              <option value="">Select state</option>
              {usStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.address?.state && (
              <p className="text-sm text-red-500 font-medium">{errors.address.state.message}</p>
            )}
          </div>
        </Card>

        {/* Business Hours */}
        <Card className="p-8 space-y-5 border-2 border-[#E0E0E0] shadow-xl backdrop-blur-sm bg-white/80">
          <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-[#FF7F11]" />
            Business Hours
          </h3>
          <p className="text-base text-[#71717A] mb-4">
            When is your business typically available?
          </p>

          <div className="space-y-2">
            <Label htmlFor="mondayFriday" className="text-[#1C1C1C] font-semibold">
              Monday - Friday <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mondayFriday"
              placeholder="8 AM - 6 PM"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("hours.mondayFriday")}
            />
            {errors.hours?.mondayFriday && (
              <p className="text-sm text-red-500 font-medium">{errors.hours.mondayFriday.message}</p>
            )}
            <p className="text-sm text-[#71717A]">e.g., 8 AM - 6 PM, 9 AM - 5 PM</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saturday" className="text-[#1C1C1C] font-semibold">
              Saturday <span className="text-red-500">*</span>
            </Label>
            <Input
              id="saturday"
              placeholder="9 AM - 4 PM or Closed"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("hours.saturday")}
            />
            {errors.hours?.saturday && (
              <p className="text-sm text-red-500 font-medium">{errors.hours.saturday.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              e.g., 9 AM - 4 PM or type &apos;Closed&apos;
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sunday" className="text-[#1C1C1C] font-semibold">
              Sunday <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sunday"
              placeholder="Closed"
              className="h-12 border-2 border-[#E0E0E0] focus:border-[#FF7F11] focus:ring-[#FF7F11]/20 placeholder:text-[#A1A1AA] transition-all duration-300"
              {...register("hours.sunday")}
            />
            {errors.hours?.sunday && (
              <p className="text-sm text-red-500 font-medium">{errors.hours.sunday.message}</p>
            )}
            <p className="text-sm text-[#71717A]">
              e.g., 10 AM - 2 PM or type &apos;Closed&apos;
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6">
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
            Continue to Step 2 →
          </Button>
        </div>
      </form>
    </div>
  );
}

