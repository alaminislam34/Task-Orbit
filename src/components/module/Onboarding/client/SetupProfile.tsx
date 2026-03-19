"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  MapPin,
  Globe,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: 1, title: "Company Info", icon: <Building2 className="w-5 h-5" /> },
  { id: 2, title: "Location & Links", icon: <MapPin className="w-5 h-5" /> },
  { id: 3, title: "About You", icon: <Users className="w-5 h-5" /> },
];

const ClientProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    location: "",
    bio: "",
    companySize: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Validation Logic
  const isStep1Complete = formData.companyName && formData.industry;
  const isStep2Complete = formData.location && formData.website;
  const isStep3Complete = formData.bio && formData.companySize;

  const canGoNext =
    (currentStep === 1 && isStep1Complete) ||
    (currentStep === 2 && isStep2Complete);

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full p-6 md:p-12">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
        {steps.map((step) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                currentStep >= step.id
                  ? "bg-gray-600 border-gray-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-card border-border text-muted-foreground",
              )}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </div>
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-wider hidden md:block",
                currentStep >= step.id
                  ? "text-gray-600"
                  : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-xl p-8 md:p-10 shadow-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Company Details</h3>
                <p className="text-muted-foreground text-sm">
                  Tell us about your organization or brand.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g. TaskOrbit Tech"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">
                    Industry <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    placeholder="e.g. Software Development"
                    value={formData.industry}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  Location & Online Presence
                </h3>
                <p className="text-muted-foreground text-sm">
                  Where are you based and how can we find you?
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Headquarters Location{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={formData.location}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">
                    Website URL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">About You & Your Team</h3>
                <p className="text-muted-foreground text-sm">
                  Provide a brief bio to attract top talent.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companySize">
                    Company Size <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companySize"
                    name="companySize"
                    placeholder="e.g. 10-50 Employees"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    About (Bio) <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Describe your company's mission and what you're looking for..."
                    className="min-h-32 bg-background/50 focus-visible:ring-gray-500 resize-none"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2 rounded-full font-bold px-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep === steps.length ? (
            <Button
              disabled={!isStep3Complete}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-8 font-bold shadow-lg shadow-gray-500/20 gap-2"
            >
              Complete Profile
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canGoNext}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-full px-8 font-bold shadow-lg shadow-gray-500/20 gap-2"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Your data is secure. You can update these details later in your
        dashboard.
      </p>
    </div>
  );
};

export default ClientProfileSetup;
