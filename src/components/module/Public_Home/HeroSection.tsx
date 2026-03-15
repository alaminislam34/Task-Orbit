"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-150 lg:min-h-180 max-h-180 h-full flex items-center justify-center md:justify-start overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/taskorbit(bg_video).mp4" type="video/mp4" />

        <img
          src="/images/hero-fallback.jpg"
          alt="Freelance workspace"
          className="w-full h-full object-cover"
        />
      </video>

      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/30 md:to-transparent -z-10" />

      {/* 3. Hero Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="max-w-3xl flex flex-col gap-6 md:gap-8 mt-10 md:mt-0">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Find the right <span className="text-primary pr-2">freelance</span>{" "}
            <br className="hidden md:block" />
            service, right away
          </h1>

          <p className="text-lg text-gray-200 font-medium md:max-w-xl">
            Join thousands of businesses building their dream projects with
            top-tier talent from around the globe.
          </p>

          {/* 4. High-Converting Search Bar */}
          <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-lg sm:rounded-full p-2 shadow-2xl mt-2">
            <div className="relative grow flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for any service..."
                className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent pl-12 h-12 text-base text-gray-900 placeholder:text-gray-500 rounded-full"
              />
            </div>
            <Button
              size="lg"
              className="mt-2 sm:mt-0 h-12 px-8 rounded-md sm:rounded-full font-bold text-base w-full sm:w-auto transition-transform active:scale-95"
            >
              Search
            </Button>
          </div>

          {/* 5. Popular Searches (Social Proof & Quick Navigation) */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-sm font-semibold text-gray-300">
              Popular:
            </span>
            {["Website Design", "WordPress", "Logo Design", "AI Services"].map(
              (tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${tag.toLowerCase().replace(" ", "-")}`}
                >
                  <span className="px-4 py-1.5 rounded-full border border-gray-400 text-white text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-pointer bg-black/20 backdrop-blur-sm">
                    {tag}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
