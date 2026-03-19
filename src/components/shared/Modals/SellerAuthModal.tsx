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
import {
  Mail,
  ArrowRight,
  Chrome,
  Github,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";

const SellerAuthModal = () => {
  const [view, setView] = useState<"initial" | "email">("initial");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signUpModal, setSignUpModal } = useStateContext();

  // পাসওয়ার্ড ভ্যালিডেশন চেক
  const checks = {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
    upper: /[A-Z]/.test(password),
  };

  const strengthCount = Object.values(checks).filter(Boolean).length;

  const handleOpenChange = (open: boolean) => {
    setSignUpModal(open);
    if (!open) {
      setTimeout(() => {
        setView("initial");
        setPassword("");
        setShowPassword(false);
      }, 300);
    }
  };

  return (
    <Dialog open={signUpModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-112.5 p-8 overflow-hidden border-none bg-white/95 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          {view === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  Join as a Seller
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
                className="w-full py-6 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl gap-2 border border-dashed border-slate-200"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>
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
                  className="text-xs font-semibold text-emerald-600 hover:underline mb-2 flex items-center gap-1 w-fit"
                >
                  ← Back to options
                </button>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Create Seller Account
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="name@company.com"
                    className="h-11 rounded-lg border-slate-200 focus:ring-emerald-500"
                  />
                </div>

                {/* Password with Eye Button & Validation */}
                <div className="space-y-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-lg border-slate-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {password.length > 0 && (
                    <div className="flex gap-1 h-1 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={cn(
                            "h-full flex-1 rounded-full transition-all",
                            step <= strengthCount
                              ? strengthCount <= 2
                                ? "bg-red-400"
                                : strengthCount === 3
                                  ? "bg-yellow-400"
                                  : "bg-emerald-500"
                              : "bg-slate-100",
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {/* Requirements Grid */}
                  <div className="grid grid-cols-2 gap-y-2 pt-1">
                    <Requirement label="8+ chars" met={checks.length} />
                    <Requirement label="Uppercase" met={checks.upper} />
                    <Requirement label="Number" met={checks.number} />
                    <Requirement label="Symbol" met={checks.symbol} />
                  </div>
                </div>

                <Button
                  disabled={strengthCount < 4}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all gap-2 disabled:opacity-50"
                >
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

// Requirement Helper Component
const Requirement = ({ label, met }: { label: string; met: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "p-0.5 rounded-full",
        met ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-300",
      )}
    >
      {met ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
    </div>
    <span
      className={cn(
        "text-[10px] font-medium",
        met ? "text-emerald-700" : "text-slate-400",
      )}
    >
      {label}
    </span>
  </div>
);

export default SellerAuthModal;
