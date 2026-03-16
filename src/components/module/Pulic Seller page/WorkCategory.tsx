"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  Palette,
  Cpu,
  BarChart4,
  PenTool,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: "dev",
    name: "Development & IT",
    icon: Code2,
    count: "1.2k+ Sellers",
    sub: "Next.js, AI, SaaS",
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: Palette,
    count: "850+ Sellers",
    sub: "UI/UX, 3D, Branding",
  },
  {
    id: "textile",
    name: "Textile Engineering",
    icon: Cpu,
    count: "400+ Sellers",
    sub: "Fabric, QA, Apparel",
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    icon: BarChart4,
    count: "920+ Sellers",
    sub: "SEO, Ads, Analytics",
  },
  {
    id: "writing",
    name: "Writing & Content",
    icon: PenTool,
    count: "600+ Sellers",
    sub: "Copy, Technical, SEO",
  },
  {
    id: "business",
    name: "Business Support",
    icon: Briefcase,
    count: "300+ Sellers",
    sub: "PM, Legal, Virtual",
  },
];

const CategorySelection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Soft Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] uppercase text-xs">
              <div className="w-8 h-px bg-primary" />
              Expertise Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Choose your{" "}
              <span className="text-muted-foreground font-medium">niche.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-lg font-light leading-relaxed">
            TaskOrbit connects specialized talent with high-ticket projects.
            Select a vertical to start your journey.
          </p>
        </div>

        {/* Professional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border overflow-hidden rounded-3xl">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative bg-background p-10 h-75 flex flex-col justify-between transition-colors hover:bg-muted/30 cursor-pointer"
            >
              {/* Icon & Count */}
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <cat.icon size={28} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors">
                  {cat.count}
                </span>
              </div>

              {/* Title & Info */}
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  {cat.sub}
                </p>
              </div>

              {/* Interaction Footer */}
              <div className="flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                <span className="text-primary">Explore Jobs</span>
                <ArrowRight size={16} className="text-primary" />
              </div>

              {/* Background Accent Reveal */}
              <AnimatePresence>
                {hoveredId === cat.id && (
                  <motion.div
                    layoutId="accent-hover"
                    className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySelection;
