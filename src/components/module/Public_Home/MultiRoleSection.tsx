"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Rocket,
  Briefcase,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const content = {
  client: {
    title: "Find talent that scales with your vision",
    subtitle: "For Businesses & Startups",
    description:
      "Access a global network of top-tier freelancers. From quick tasks to massive projects, find the expertise you need to grow.",
    features: [
      "Post jobs for free",
      "Secure payment protection",
      "Verified portfolio reviews",
    ],
    buttonText: "Hire a Professional",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
    accent: "text-blue-600",
  },
  freelancer: {
    title: "Your office, your hours, your rules",
    subtitle: "For Creative Talent",
    description:
      "Work with world-class clients on projects that challenge and excite you. Build your brand and get paid what you're worth.",
    features: [
      "Keep 90% of your earnings",
      "Access to premium clients",
      "Fast & reliable payouts",
    ],
    buttonText: "Start Earning",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
    accent: "text-emerald-600",
  },
  recruiter: {
    title: "Streamline your talent acquisition",
    subtitle: "For Agencies & HR",
    description:
      "Use our AI-powered matching to find candidates that fit your culture and technical requirements in record time.",
    features: [
      "Bulk hiring tools",
      "Advanced vetting process",
      "Custom API integration",
    ],
    buttonText: "Partner With Us",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop",
    accent: "text-purple-600",
  },
};

const MultiRoleSection = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof content>("client");

  const active = content[activeTab];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* 1. Header & Switcher */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            One platform. <span className="text-primary">Infinite</span>{" "}
            possibilities.
          </h2>

          {/* Professional Role Switcher */}
          <div className="flex p-1 bg-muted rounded-full border">
            {(["client", "freelancer", "recruiter"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all cursor-pointer ${
                  activeTab === role
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Dynamic Content Area */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-125">
          {/* Left: Image with subtle animations */}
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-100 md:h-137.5 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right: Textual Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span
                className={`text-sm font-medium ${active.accent}`}
              >
                {active.subtitle}
              </span>
              <h3 className="text-4xl font-bold leading-tight">
                {active.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {active.description}
              </p>
            </div>

            <ul className="space-y-4">
              {active.features.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 font-semibold text-foreground"
                >
                  <CheckCircle className={`h-5 w-5 ${active.accent}`} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-10 h-14 font-bold text-lg group">
                {active.buttonText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-6 font-bold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiRoleSection;
