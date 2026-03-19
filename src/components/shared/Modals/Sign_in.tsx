"use client";

import React from "react";
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
  LogIn,
  User,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";

const SignInModal = () => {
  const { signInModal, setSignInModal, setSignUpModal, setClientModal } =
    useStateContext();

  const handleOpenChange = (open: boolean) => {
    setSignInModal(open);
  };

  const handleSignUpRedirect = (type: "client" | "seller") => {
    setSignInModal(false);
    if (type === "client") {
      setClientModal(true);
    } else {
      setSignUpModal(false);
    }
  };

  return (
    <Dialog open={signInModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-112.5 p-8 overflow-hidden border-none bg-white/98 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Sign in to TaskOrbit
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Welcome back! Please enter your details.
              </p>
            </DialogHeader>

            {/* --- Standard Login Form --- */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-11 rounded-lg border-slate-200 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password font-medium text-slate-700">
                    Password
                  </Label>
                  <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-lg border-slate-200 focus:ring-emerald-500"
                />
              </div>
              <Button className="w-full h-11 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition-all gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="py-5 border-slate-200 hover:bg-slate-50 gap-2 rounded-xl transition-all"
              >
                <Chrome className="w-4 h-4 text-red-500" />
                Google
              </Button>
              <Button
                variant="outline"
                className="py-5 border-slate-200 hover:bg-slate-50 gap-2 rounded-xl transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </div>

            {/* --- UI/UX Improvement: Professional Multi-Option Signup --- */}
            <div className="mt-2 space-y-3">
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                New to TaskOrbit?
              </p>

              <div className="grid grid-cols-1 gap-2">
                {/* Seller Option */}
                <button
                  onClick={() => handleSignUpRedirect("seller")}
                  className="group flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/30 rounded-xl hover:bg-emerald-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Become a Seller
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Work and earn money
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                </button>

                {/* Client Option */}
                <button
                  onClick={() => handleSignUpRedirect("client")}
                  className="group flex items-center justify-between p-3 border border-slate-100 bg-slate-50/30 rounded-xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Join as a Client
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Hire talent and get projects done
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transform group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
