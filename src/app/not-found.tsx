"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Home, Search, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* --- Abstract Background "Orbits" --- */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 border border-primary/10 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-primary/5 rounded-full"
        />
        {/* Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* --- Main Content --- */}
      <div className="container px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Large 404 text with Gradient */}
          <h1 className="text-[12rem] md:text-[18rem] font-black tracking-tighter leading-none select-none">
            <span className="bg-clip-text text-transparent bg-linear-to-b from-primary/40 to-background">
              404
            </span>
          </h1>

          <div className="max-w-md mx-auto -mt-8 md:-mt-16 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Lost in the <span className="text-primary italic">Orbit?</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light">
                The page you're looking for has drifted away. Let's get you back
                to the talent hub.
              </p>
            </div>

            {/* Interactive Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="h-12 px-8 flex flex-row items-center rounded-full font-bold group"
              >
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Return Home
              </Button>
              <Button
                onClick={() => router.push("/career")}
                variant="outline"
                size="lg"
                className="h-12 px-8 flex flex-row items-center rounded-full font-semibold bg-background/50 backdrop-blur-sm border-border"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Jobs
              </Button>
            </div>

            {/* Subtle Footer Links */}
            <div className="pt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground font-medium">
              <Link
                href="/help"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                Help Center
              </Link>
              <div className="w-1 h-1 bg-border rounded-full" />
              <Link
                href="/contact"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                Report Issue
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Badge (Decorative) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeIn" }}
        className="absolute bottom-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/40"
      >
        <Globe size={14} />
        <span>TaskOrbit Global Presence</span>
      </motion.div>
    </div>
  );
}
