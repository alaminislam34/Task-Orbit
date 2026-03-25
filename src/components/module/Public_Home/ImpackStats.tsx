"use client";

import React from "react";
import {
  Plus,
  ArrowUpRight,
  Terminal,
  Layers,
  Cpu,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ecosystems = [
  {
    role: "For Clients",
    title: "On-demand execution",
    desc: "Deploy specialized teams for mission-critical projects in under 24 hours.",
    tag: "Efficiency",
    size: "md:col-span-2",
  },
  {
    role: "For Freelancers",
    title: "The Sovereign Career",
    desc: "A financial and legal stack built for the modern independent professional.",
    tag: "Autonomy",
    size: "md:col-span-1",
  },
  {
    role: "For Recruiters",
    title: "AI-Vetted Pipelines",
    desc: "Remove the noise. High-signal matching for long-term placement.",
    tag: "Precision",
    size: "md:col-span-1",
  },
  {
    role: "Global Reach",
    title: "180+ Jurisdictions",
    desc: "Automated compliance and cross-border payments handled natively.",
    tag: "Scale",
    size: "md:col-span-2",
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-32 bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Header - Left Aligned for Modern Look */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                The Protocol
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
              Built for the <br />
              <span className="text-muted-foreground/40">New Economy.</span>
            </h2>
          </div>
          <div className="pb-2">
            <p className="text-muted-foreground font-medium max-w-75 text-sm leading-relaxed">
              A unified infrastructure for talent, capital, and global
              execution.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/50 border overflow-hidden rounded-xl shadow-sm">
          {ecosystems.map((item, i) => (
            <div
              key={i}
              className={`group bg-background p-10 md:p-14 flex flex-col justify-between relative transition-all duration-500 hover:bg-muted/30 ${item.size}`}
            >
              <div className="flex justify-between items-start mb-20">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold px-2 py-1 border rounded-full uppercase tracking-tighter">
                    {item.tag}
                  </span>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    {item.role}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>

              {/* Subtle Decorative Background Number */}
              <span className="absolute bottom-10 right-10 text-9xl font-black text-muted-foreground/3 select-none pointer-events-none group-hover:text-primary/5 transition-colors">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-8 justify-between px-2">
          <div className="flex items-center gap-12">
            <div>
              <div className="text-2xl font-bold">12.4k</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Active Nodes
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">$1.2B+</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Volume
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="rounded-full px-12 h-14 font-black uppercase text-xs tracking-widest shadow-xl"
          >
            Join the Protocol
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
