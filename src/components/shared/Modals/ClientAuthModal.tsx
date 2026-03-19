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
  Chrome,
  Github,
  ArrowRight,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";

const ClientRegisterModal = () => {
  const { clientModal, setClientModal, setSignInModal } = useStateContext();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checks = {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
    upper: /[A-Z]/.test(password),
  };

  const strengthCount = Object.values(checks).filter(Boolean).length;

  const handleOpenChange = (open: boolean) => {
    setClientModal(open);
    if (!open) {
      setPassword("");
      setShowPassword(false);
    }
  };

  const switchToSignIn = () => {
    setClientModal(false);
    setTimeout(() => setSignInModal(true), 300);
  };

  return (
    <Dialog open={clientModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120 p-8 overflow-hidden border-none bg-white/98 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Join as a Client
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Create an account to hire top talent.
              </p>
            </DialogHeader>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-6 border-slate-200 hover:bg-slate-50 gap-2 rounded-xl transition-all shadow-sm"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                <span className="text-xs font-semibold">Google</span>
              </Button>
              <Button
                variant="outline"
                className="py-6 border-slate-200 hover:bg-slate-50 gap-2 rounded-xl transition-all shadow-sm"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs font-semibold">GitHub</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input
                    placeholder="John"
                    className="h-11 rounded-lg focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input
                    placeholder="Doe"
                    className="h-11 rounded-lg focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Work Email</Label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  className="h-11 rounded-lg focus:ring-emerald-500"
                />
              </div>

              {/* --- Password Field with Eye Button --- */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="h-11 rounded-lg focus:ring-emerald-500 pr-10" // রাইট প্যাডিং দেওয়া হয়েছে আইকনের জন্য
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {password.length > 0 && (
                  <div className="flex gap-1 h-1.5 w-full mt-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-full flex-1 rounded-full transition-all duration-300",
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

                {/* Interactive Checklist */}
                <div className="grid grid-cols-2 gap-y-2 pt-1">
                  <Requirement label="8+ characters" met={checks.length} />
                  <Requirement label="One uppercase" met={checks.upper} />
                  <Requirement label="One number" met={checks.number} />
                  <Requirement label="One symbol (!@#)" met={checks.symbol} />
                </div>
              </div>

              <Button
                disabled={strengthCount < 4}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create My Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-50 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={switchToSignIn}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const Requirement = ({ label, met }: { label: string; met: boolean }) => (
  <div className="flex items-center gap-2 transition-all">
    <div
      className={cn(
        "p-0.5 rounded-full",
        met ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-300",
      )}
    >
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    </div>
    <span
      className={cn(
        "text-[11px] font-medium",
        met ? "text-emerald-700" : "text-slate-400",
      )}
    >
      {label}
    </span>
  </div>
);

export default ClientRegisterModal;
