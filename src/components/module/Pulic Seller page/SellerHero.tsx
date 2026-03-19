"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";

const SellerHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { setSignUpModal, signUpModal } = useStateContext();

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      {/* --- 1. Background Video Layer --- */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/videos/seller.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/10" />
      </div>

      {/* --- 2. Content Layer --- */}
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Become a TaskOrbit freelancer
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Work your way. <br />
            <span className="text-primary">Earn on your terms.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Turn your professional skills into a thriving global business. Join
            thousands of experts who find their best clients on TaskOrbit.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold group shadow-2xl shadow-primary/20"
              onClick={() => setSignUpModal(true)}
            >
              Create your profile
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 flex flex-wrap justify-center gap-x-10 gap-y-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Free to Join</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span>Top-rated Talent</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- 3. Interactive Video Controls (Bottom Right) --- */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </section>
  );
};

export default SellerHero;
