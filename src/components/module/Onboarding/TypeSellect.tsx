"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const roles = [
  {
    id: "seller",
    title: "Join as a Seller",
    label: "Freelancer",
    desc: "I want to offer my services, build a portfolio, and earn money on TaskOrbit.",
    icon: <Briefcase className="w-8 h-8" />,
    href: "/onboarding/seller",
    colorClass: "emerald", // Using color names for dynamic logic
    features: ["Create Services", "Earn Revenue", "Manage Orders"],
  },
  {
    id: "client",
    title: "Join as a Client",
    label: "Buyer",
    desc: "I want to find top-tier talent, post projects, and get professional work done.",
    icon: <User className="w-8 h-8" />,
    href: "/onboarding/client",
    colorClass: "blue",
    features: ["Post Projects", "Hire Experts", "Safe Payments"],
  },
  {
    id: "recruiter",
    title: "Join as a Recruiter",
    label: "Company",
    desc: "I want to post full-time/part-time jobs and hire professional employees.",
    icon: <Building2 className="w-8 h-8" />,
    href: "/onboarding/recruiter",
    colorClass: "purple",
    features: ["Post Jobs", "Search Talent", "Company Profile"],
  },
];

const SellectType = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      const rolePath = roles.find((r) => r.id === selectedRole)?.href;
      if (rolePath) router.push(rolePath);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 md:p-12 lg:p-16 bg-background text-foreground transition-colors duration-300">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Step 1: Choose Your Path
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          How do you want to use TaskOrbit?
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Select the account type that best fits your needs. You can add more
          roles later in your settings.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {roles.map((role, index) => {
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedRole(role.id)}
              className={cn(
                "relative group cursor-pointer flex flex-col p-8 rounded-lg border-2 transition-all duration-300",
                "bg-card hover:bg-accent/50", // Dark mode friendly backgrounds
                isSelected
                  ? `border-${role.colorClass}-500 ring-4 ring-${role.colorClass}-500/10 shadow-2xl`
                  : "border-border hover:border-muted-foreground/30 shadow-sm",
              )}
            >
              {/* Selection Indicator */}
              <div
                className={cn(
                  "absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected
                    ? `bg-${role.colorClass}-500 border-${role.colorClass}-500 text-white`
                    : "border-muted text-transparent",
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>

              {/* Icon Container */}
              <div
                className={cn(
                  "w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500",
                  role.id === "seller"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : role.id === "client"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-purple-500/10 text-purple-600",
                )}
              >
                {role.icon}
              </div>

              <div className="mb-2">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    role.id === "seller"
                      ? "text-emerald-500"
                      : role.id === "client"
                        ? "text-blue-500"
                        : "text-purple-500",
                  )}
                >
                  {role.label}
                </span>
                <h3 className="text-xl font-bold mt-1">{role.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {role.desc}
              </p>

              {/* Micro Features List */}
              <ul className="space-y-3 mt-auto border-t border-border pt-6">
                {role.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs font-semibold text-foreground/70"
                  >
                    <CheckCircle2
                      className={cn(
                        "w-3.5 h-3.5",
                        role.id === "seller"
                          ? "text-emerald-500"
                          : role.id === "client"
                            ? "text-blue-500"
                            : "text-purple-500",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Bottom Action */}
      <motion.div layout className="mt-12 flex flex-col items-center gap-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={cn(
            "h-14 px-12 rounded-full text-lg font-bold shadow-xl transition-all gap-3",
            selectedRole
              ? "bg-primary text-primary-foreground hover:opacity-90 scale-105 active:scale-95"
              : "bg-muted text-muted-foreground",
          )}
        >
          Create Profile
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p className="text-xs text-muted-foreground font-medium">
          You are currently signed in as a{" "}
          <span className="text-foreground font-bold">Guest</span>. Choose a
          role to proceed.
        </p>
      </motion.div>
    </div>
  );
};

export default SellectType;
