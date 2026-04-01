"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserCircle,
  Wand2,
  Trophy,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    id: 1,
    title: "Professional Info",
    icon: <UserCircle className="w-5 h-5" />,
  },
  { id: 2, title: "Expertise & Skills", icon: <Wand2 className="w-5 h-5" /> },
  { id: 3, title: "Final Touch", icon: <Trophy className="w-5 h-5" /> },
];

const SellerProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    skills: [] as string[],
    experience: "Intermediate",
    portfolioUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Validation Logic
  const isStep1Complete = formData.title.length > 5 && formData.bio.length > 20;
  const isStep2Complete = formData.skills.length >= 3;
  const isStep3Complete = formData.experience;

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
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
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
                "text-[10px] font-bold uppercase tracking-widest hidden md:block",
                currentStep >= step.id
                  ? "text-emerald-600"
                  : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-lg p-8 md:p-10 shadow-sm relative overflow-hidden transition-colors">
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
                <h3 className="text-2xl font-bold">Professional Overview</h3>
                <p className="text-muted-foreground text-sm">
                  Tell the world what you do best.
                </p>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Professional Title{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Full Stack Next.js Developer"
                    value={formData.title}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-emerald-500"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Example: UI/UX Designer, MERN Stack Expert
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Professional Bio <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Describe your expertise, years of experience, and what you offer..."
                    className="min-h-32 bg-background/50 focus-visible:ring-emerald-500 resize-none"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-muted-foreground italic">
                      Minimum 20 characters
                    </p>
                    <p
                      className={cn(
                        "text-[10px]",
                        formData.bio.length >= 20
                          ? "text-emerald-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {formData.bio.length} chars
                    </p>
                  </div>
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
                <h3 className="text-2xl font-bold">Your Skills</h3>
                <p className="text-muted-foreground text-sm">
                  Add at least 3 skills to stand out to clients.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g. React, Figma, SEO)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    className="h-11 bg-background/50 focus-visible:ring-emerald-500"
                  />
                  <Button
                    onClick={addSkill}
                    className="bg-emerald-600 hover:bg-emerald-700 h-11 px-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-25 p-4 border border-dashed rounded-lg border-border bg-muted/20">
                  {formData.skills.length === 0 && (
                    <p className="text-xs text-muted-foreground m-auto">
                      No skills added yet.
                    </p>
                  )}
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 gap-1 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
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
                <h3 className="text-2xl font-bold">Experience & Links</h3>
                <p className="text-muted-foreground text-sm">
                  Almost there! Add your experience level.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label>Experience Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Beginner", "Intermediate", "Expert"].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setFormData({ ...formData, experience: level })
                        }
                        className={cn(
                          "py-3 rounded-lg border-2 transition-all text-sm font-bold",
                          formData.experience === level
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-border hover:border-muted-foreground/30",
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">
                    Portfolio Link (Optional)
                  </Label>
                  <Input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="h-12 bg-background/50 focus-visible:ring-emerald-500"
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 font-bold shadow-lg shadow-emerald-500/20 gap-2"
            >
              Finish Setup
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 ? !isStep1Complete : !isStep2Complete}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 font-bold shadow-lg shadow-emerald-500/20 gap-2"
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

export default SellerProfileSetup;
