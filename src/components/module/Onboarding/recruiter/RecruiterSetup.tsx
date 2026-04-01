"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  Mail,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = [
  { id: 1, title: "Organization", icon: <Building className="w-5 h-5" /> },
  { id: 2, title: "Verification", icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 3, title: "Hiring Goals", icon: <Target className="w-5 h-5" /> },
];

const RecruiterSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    workEmail: "",
    website: "",
    hiringScale: "",
    primaryRole: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Validation
  const isStep1Complete = formData.orgName && formData.orgType;
  const isStep2Complete = formData.workEmail.includes("@") && formData.website.startsWith("http");
  const isStep3Complete = formData.hiringScale && formData.primaryRole;

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full p-6 md:p-12">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
              currentStep >= step.id 
                ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]" 
                : "bg-card border-border text-muted-foreground"
            )}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest hidden md:block",
              currentStep >= step.id ? "text-purple-600" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border rounded-lg p-8 md:p-10 shadow-sm relative overflow-hidden">
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
                <h3 className="text-2xl font-bold">Organization Profile</h3>
                <p className="text-muted-foreground text-sm">Let candidates know who they'll be working for.</p>
              </div>
              
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="orgName" 
                    name="orgName"
                    placeholder="e.g. Creative Agency Ltd." 
                    value={formData.orgName}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Company Type <span className="text-destructive">*</span></Label>
                  <select 
                    id="orgType"
                    name="orgType"
                    value={formData.orgType}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="startup">Startup</option>
                    <option value="agency">Agency</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="ngo">NGO / Non-profit</option>
                  </select>
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
                <h3 className="text-2xl font-bold">Official Verification</h3>
                <p className="text-muted-foreground text-sm">We use this to build trust between recruiters and talent.</p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    Official Work Email
                  </Label>
                  <Input 
                    name="workEmail"
                    type="email"
                    placeholder="hr@company.com" 
                    value={formData.workEmail}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    Company Website
                  </Label>
                  <Input 
                    name="website"
                    placeholder="https://company.com" 
                    value={formData.website}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-purple-500"
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
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold">Hiring Strategy</h3>
                <p className="text-muted-foreground text-sm">Help us match you with the right professionals.</p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-3 text-center">
                  <Label>Expected Hiring Scale</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Occasional", "Frequent", "Bulk Hiring", "One-time"].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setFormData({...formData, hiringScale: scale})}
                        className={cn(
                          "py-3 rounded-lg border-2 transition-all text-sm font-bold",
                          formData.hiringScale === scale 
                            ? "border-purple-500 bg-purple-500/10 text-purple-600" 
                            : "border-border hover:border-purple-500/30"
                        )}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Roles You Hire For</Label>
                  <Input 
                    name="primaryRole"
                    placeholder="e.g. Designers, Developers, Managers" 
                    value={formData.primaryRole}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-purple-500"
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
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 font-bold shadow-lg shadow-purple-500/20 gap-2"
            >
              Start Hiring
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 ? !isStep1Complete : !isStep2Complete}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 font-bold shadow-lg shadow-purple-500/20 gap-2"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterSetup;