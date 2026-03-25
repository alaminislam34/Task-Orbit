"use client";

import { Search, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import animation from "../../../../public/videos/designer.json";
import Lottie from "react-lottie";

const HeroSection = () => {
  return (
    // "bg-background" and "text-foreground" are the magic keys for theme switching
    <section className="relative w-full min-h-[85vh] flex items-center bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* 1. Dynamic Glows (They adjust opacity based on theme) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 dark:bg-primary/5 -skew-x-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* 2. Content Column */}
          <div className="lg:col-span-7 flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-2 bg-muted border border-border shadow-sm w-fit px-4 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Elite Freelance Network
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl font-bold">
              Find the extraordinary
              <br />
              experts.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
              We’ve bypassed the noise. TaskOrbit connects you with world-class
              talent through a streamlined, high-performance interface.
            </p>

            {/* 3. The Theme-Adaptive Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-card border border-border shadow-md rounded-xl max-w-2xl group focus-within:border-primary/50 transition-all">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for your next expert..."
                  className="w-full border-0 focus-visible:ring-0 bg-transparent pl-12 h-14 text-lg text-foreground placeholder:text-muted-foreground shadow-none"
                />
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-base shadow-lg transition-transform active:scale-95"
              >
                Explore
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
                  >
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/40" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by{" "}
                <span className="font-bold text-foreground underline decoration-primary/40">
                  500+ startups
                </span>{" "}
                worldwide
              </p>
            </div>
          </div>

          {/* 4. The Visual Column (Premium Bento Feel) */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl border-12 border-card">
              <div className="w-full h-130 bg-muted flex items-center justify-center pointer-events-none">
                {/* This would be your high-res image */}
                {/* <Image
                  src="/images/freelance.jpg"
                  alt="Talent"
                  fill
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 transition-opacity"
                /> */}
                <Lottie
                  options={{ animationData: animation }}
                  height={500}
                  width={500}
                />
              </div>

              {/* Floating Glass UI Piece */}
              <div className="absolute top-10 left-0 bg-background/60 backdrop-blur-xl p-4 rounded-xl border border-border shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">
                    1,240 Experts Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
