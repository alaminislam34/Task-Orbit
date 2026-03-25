"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Zap, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "The best for every budget",
    description:
      "Find high-quality services at every price point. No hourly rates, just project-based pricing.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Quality work done quickly",
    description:
      "Find the right freelancer to begin working on your project within minutes.",
    icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Protected payments, every time",
    description:
      "Always know what you'll pay upfront. Your payment isn't released until you approve the work.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "24/7 priority support",
    description:
      "Our round-the-clock support team is available to help anytime, anywhere.",
    icon: <Headset className="h-6 w-6 text-primary" />,
  },
];

const ValueProposition = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Side: Content */}
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]">
              A whole world of freelance <br /> talent at your fingertips
            </h2>

            <div className="grid gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed md:max-w-md">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="px-8 h-12 font-bold text-base">
              Explore TaskOrbit
            </Button>
          </div>

          {/* Right Side: Visual Element */}
          <div className="flex-1 w-full">
            <div className="relative aspect-video lg:aspect-square rounded-xl overflow-hidden shadow-2xl border-8 border-background">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Team collaborating"
                className="object-cover w-full h-full"
              />
              {/* Floating Stat Card for UX "Pop" */}
              <div className="absolute bottom-6 left-6 right-6 bg-background/80 backdrop-blur-md p-6 rounded-xl border shadow-lg hidden md:block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Freelancers
                    </p>
                    <p className="text-2xl font-bold">15,000+</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Positive Reviews
                    </p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
