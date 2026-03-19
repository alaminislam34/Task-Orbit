"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Chrome, Github } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";

const SellerAuthModal = () => {
  const [view, setView] = useState<"initial" | "email">("initial");

  // কনটেক্সট থেকে স্টেটগুলো নিয়ে আসা
  const { signUpModal, setSignUpModal } = useStateContext();

  // মোডাল ক্লোজ বা ওপেন হ্যান্ডেল করার ফাংশন
  const handleOpenChange = (open: boolean) => {
    setSignUpModal(open);
    if (!open) {
      // মোডাল ক্লোজ হলে ভিউকে আবার শুরুতে নিয়ে আসা
      setTimeout(() => setView("initial"), 300);
    }
  };

  return (
    <Dialog open={signUpModal} onOpenChange={handleOpenChange}>
      {/* যেহেতু আপনি গ্লোবাল স্টেট দিয়ে কন্ট্রোল করছেন, 
         তাই এখানে আর DialogTrigger এর প্রয়োজন নেই। 
         অন্য কোনো বাটন থেকে setSignUpModal(true) করলেই এটি ওপেন হবে।
      */}
      <DialogContent className="sm:max-w-112.5 p-8 overflow-hidden border-none bg-white/95 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {view === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6 text-center"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  Join TaskOrbit as a Seller
                </DialogTitle>
                <p className="text-sm text-slate-500">
                  Create an account to start selling your services.
                </p>
              </DialogHeader>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="w-full py-6 border-slate-200 hover:bg-slate-50 gap-3 rounded-xl transition-all"
                >
                  <Chrome className="w-5 h-5 text-red-500" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 border-slate-200 hover:bg-slate-50 gap-3 rounded-xl transition-all"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">
                    Or
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setView("email")}
                variant="ghost"
                className="w-full py-6 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl gap-2"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>

              <p className="text-center text-[12px] text-slate-400 px-8 leading-relaxed">
                By joining, you agree to our{" "}
                <span className="underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>
                .
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <DialogHeader>
                <button
                  onClick={() => setView("initial")}
                  className="text-xs font-semibold text-emerald-600 hover:underline mb-2 flex items-center gap-1"
                >
                  ← Back to options
                </button>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Sign up with Email
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="name@company.com"
                    className="h-12 rounded-lg border-slate-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-lg border-slate-200"
                  />
                </div>
                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-200 transition-all gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SellerAuthModal;
