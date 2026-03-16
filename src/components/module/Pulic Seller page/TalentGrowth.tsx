"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Trophy,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Zap,
} from "lucide-react";

const levels = [
  {
    level: "Level 01",
    title: "Rising Talent",
    requirement: "Complete 5 projects",
    perk: "Standard platform visibility & secure escrow.",
    icon: Zap,
    color: "text-blue-500",
    border: "border-blue-500/20",
  },
  {
    level: "Level 02",
    title: "Verified Expert",
    requirement: "Maintain 4.8+ Rating",
    perk: "Priority support and lower platform commissions.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  {
    level: "Level 03",
    title: "TaskOrbit Pro",
    requirement: "Top 1% Performers",
    perk: "Direct placement in high-ticket enterprise leads.",
    icon: Trophy,
    color: "text-amber-500",
    border: "border-amber-500/20",
  },
];

const TalentGrowth = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
              Career Roadmap
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              See how top freelance <br />
              talent <span className="text-primary italic">grows</span> on
              TaskOrbit.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm pb-2">
            We don't just host your services; we build your career. Our level-up
            system is designed to reward quality and consistency.
          </p>
        </div>

        {/* Growth Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />

          {levels.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 group"
            >
              <div
                className={`bg-background border ${item.border} p-8 rounded-[2.5rem] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-2`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div
                    className={`p-4 rounded-2xl bg-muted group-hover:bg-primary transition-colors duration-500`}
                  >
                    <item.icon
                      className={`w-6 h-6 ${item.color} group-hover:text-primary-foreground`}
                    />
                  </div>
                  <span className="text-xs font-black text-muted-foreground/40 uppercase tracking-tighter">
                    {item.level}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                    <TrendingUp size={12} />
                    {item.requirement}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.perk}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed flex justify-between items-center">
                  <span className="text-xs font-bold group-hover:text-primary transition-colors">
                    View Level Perks
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-1 bg-linear-to-r from-transparent via-border to-transparent"
        />
        <div className="mt-12 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="text-sm font-bold tracking-widest uppercase">
            Trusted by Global Teams
          </span>
          <div className="h-4 w-px bg-border hidden md:block" />
          {/* You can add small grayscale logos here */}
          <div className="flex gap-8 font-black italic text-xl">
            <span>FORBES</span>
            <span>TECHCRUNCH</span>
            <span>WIRED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Internal Badge helper if not using Shadcn UI Badge
const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={`inline-block ${className}`}>{children}</span>;

export default TalentGrowth;
