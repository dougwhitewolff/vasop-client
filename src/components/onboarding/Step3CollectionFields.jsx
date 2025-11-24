"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Mail, CheckCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const collectionFieldsSchema = z.object({
  summaryEmail: z.string().email("Please enter a valid email address"),
  email: z.boolean(),
  urgency: z.boolean(),
  propertyAddress: z.boolean(),
  bestTimeToCallback: z.boolean(),
  customFields: z.array(
    z.object({
      question: z.string().min(5, "Question must be at least 5 characters"),
      required: z.boolean(),
    })
  ).max(5, "Maximum 5 custom questions allowed"),
});

export function Step3CollectionFields({ data, onNext, onBack, onSave }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionFieldsSchema),
    defaultValues: data || {
      summaryEmail: "",
      email: false,
      urgency: false,
      propertyAddress: false,
      bestTimeToCallback: false,
      customFields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const customFields = watch("customFields");
  const watchedFields = watch();

  const onSubmit = (formData) => {
    onNext(formData);
  };

  const addCustomField = () => {
    if (fields.length < 5) {
      append({ question: "", required: false });
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Information Collection
        </h2>
        <p className="text-zinc-600">
          Choose what information your agent should collect from callers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Call Summary Email */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Inbox className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-base text-blue-900 leading-none mb-1">
                Call Summary Email
              </h3>
              <p className="text-sm text-blue-800 leading-snug mb-2">
                Where should we send the email summary after each call?
              </p>
              
              <div className="space-y-1.5">
                <Label htmlFor="summaryEmail" className="text-blue-900 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="summaryEmail"
                  type="email"
                  placeholder="owner@4trades.ai"
                  className="bg-white placeholder:text-zinc-400"
                  {...register("summaryEmail")}
                />
                {errors.summaryEmail && (
                  <p className="text-sm text-red-600">{errors.summaryEmail.message}</p>
                )}
                <p className="text-xs text-blue-700">
                  This email will receive a summary with customer details after every call
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Standard Fields */}
        <Card className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-base text-zinc-900 leading-none mb-1">
              Standard Fields
            </h3>
            <p className="text-sm text-zinc-600 leading-snug">
              These are the details your agent will ask callers for during conversations
            </p>
          </div>
          {/* Always Collected */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-900">
              Always Collected (Required)
            </p>
            
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Checkbox checked disabled className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Label className="font-medium text-zinc-900 text-sm">Customer Name</Label>
                    <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 text-xs">
                      Required
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Agent will ask: "Could I get your name?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox checked disabled className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Label className="font-medium text-zinc-900 text-sm">Phone Number</Label>
                    <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 text-xs">
                      Required
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Agent will ask: "What's the best number to reach you?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox checked disabled className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Label className="font-medium text-zinc-900 text-sm">Reason for Call</Label>
                    <Badge variant="secondary" className="bg-zinc-200 text-zinc-700 text-xs">
                      Required
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Agent will ask: "What are you calling about?"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-1.5 pt-3">
            <p className="text-sm font-semibold text-zinc-900 mb-1">
              Optional Fields
            </p>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="email"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="email" className="font-medium text-zinc-900 cursor-pointer text-sm">
                    Email Address
                  </Label>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Agent will ask: "Do you have an email address?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
                <Controller
                  name="urgency"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="urgency"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="urgency" className="font-medium text-zinc-900 cursor-pointer text-sm">
                    Urgency Level
                  </Label>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Agent will ask: "Would you like us to call you back on the next business day?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
                <Controller
                  name="propertyAddress"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="propertyAddress"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="propertyAddress" className="font-medium text-zinc-900 cursor-pointer text-sm">
                    Property Address
                  </Label>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Agent will ask: "What's the property address where service is needed?"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
                <Controller
                  name="bestTimeToCallback"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="bestTimeToCallback"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="bestTimeToCallback" className="font-medium text-zinc-900 cursor-pointer text-sm">
                    Best Time to Call Back
                  </Label>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Agent will ask: "What's the best time for us to reach you?"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Summary Preview */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1.5 text-sm">
                  📧 Email Summary Template
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  After each call, an email will be sent to{" "}
                  <span className="font-semibold">
                    {watchedFields.summaryEmail || "[your email]"}
                  </span>{" "}
                  with the following information:
                </p>
                
                <div className="bg-white border border-blue-200 rounded-lg p-3 space-y-1.5">
                  <p className="text-sm font-semibold text-zinc-900 mb-1.5">Call Details:</p>
                  <ul className="space-y-1">
                    {/* Always Collected */}
                    <li className="text-sm text-zinc-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span><strong>Name:</strong> [Customer Name]</span>
                    </li>
                    <li className="text-sm text-zinc-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span><strong>Phone:</strong> [Customer Phone]</span>
                    </li>
                    <li className="text-sm text-zinc-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span><strong>Reason:</strong> [Reason for Call]</span>
                    </li>
                    
                    {/* Optional Fields */}
                    {watchedFields.email && (
                      <li className="text-sm text-zinc-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Email:</strong> [Customer Email]</span>
                      </li>
                    )}
                    {watchedFields.urgency && (
                      <li className="text-sm text-zinc-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Urgency:</strong> [Urgency Level]</span>
                      </li>
                    )}
                    {watchedFields.propertyAddress && (
                      <li className="text-sm text-zinc-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Property Address:</strong> [Address]</span>
                      </li>
                    )}
                    {watchedFields.bestTimeToCallback && (
                      <li className="text-sm text-zinc-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span><strong>Best Time to Call:</strong> [Preferred Time]</span>
                      </li>
                    )}
                    
                    {/* Custom Questions */}
                    {customFields && customFields.length > 0 && customFields.map((field, index) => (
                      field.question && (
                        <li key={index} className="text-sm text-zinc-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span><strong>{field.question}:</strong> [Answer]</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Custom Questions */}
        <Card className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-base text-zinc-900 leading-none mb-1">
              Custom Questions
            </h3>
            <p className="text-sm text-zinc-600 leading-snug">
              Add specific questions unique to your business
            </p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
              <p className="text-zinc-600 mb-4">No custom questions yet</p>
              <p className="text-sm text-zinc-500 mb-6">
                Add questions specific to your business
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={addCustomField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-zinc-50 border-zinc-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${index}`}>
                          Custom Question {index + 1}
                        </Label>
                        <Input
                          id={`question-${index}`}
                          placeholder="e.g., What type of fence are you interested in?"
                          className="placeholder:text-zinc-400"
                          {...register(`customFields.${index}.question`)}
                        />
                        {errors.customFields?.[index]?.question && (
                          <p className="text-sm text-red-500">
                            {errors.customFields[index].question.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Controller
                          name={`customFields.${index}.required`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`required-${index}`}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label
                          htmlFor={`required-${index}`}
                          className="font-normal cursor-pointer"
                        >
                          Make this required
                        </Label>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {fields.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomField}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Custom Question
                </Button>
              )}

              {fields.length >= 5 && (
                <p className="text-sm text-zinc-500 text-center">
                  Maximum 5 custom questions reached
                </p>
              )}
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
            ← Back to Step 2
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const data = watch();
                onSave(data);
              }}
            >
              Save & Continue Later
            </Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100">
              Continue to Step 4 →
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

