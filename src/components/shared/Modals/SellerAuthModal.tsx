"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";
import { sellerSignUpSchema } from "@/types/zod.validation";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";

type SellerSignUpForm = z.infer<typeof sellerSignUpSchema>;

const SellerAuthModal = () => {
  const [view, setView] = useState<"initial" | "email">("initial");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(
    null,
  );

  const { signUpModal, setSignUpModal, setSignInModal, accountType, setOtpModalOpen, setUserEmail } = useStateContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SellerSignUpForm>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: accountType,
    },
    mode: "onChange",
  });

  const password = watch("password", "");

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
        reset();
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 300);
    }
  };

  const onSubmit = async (_values: SellerSignUpForm) => {
    try {
      const payload = {
        name: _values.name,
        email: _values.email,
        password: _values.password,
        accountType: accountType,
      }


      const res = await httpClient.post(ENDPOINT.AUTH.REGISTER, payload);

      if (res.success) {
        toast.success(res.message);
        setUserEmail(_values.email);
        setSignUpModal(false);
        setOtpModalOpen(true);
        reset();
      }
    } catch (error: any) {
      const errorData = error?.response?.data || error;
      const errorSource = errorData?.errorSource;

      if (Array.isArray(errorSource) && errorSource.length > 0) {
        errorSource.forEach((err: { path: string; message: string }) => {
          const fieldName = err.path as keyof SellerSignUpForm;

          if (fieldName) {
            setError(fieldName, {
              type: "server",
              message: err.message,
            });
          }

          toast.error(err.message);
        });
      }
      else {
        toast.error(errorData?.message || "An unexpected error occurred");
      }
    }
  };

  const onSocialAuth = async (provider: "google" | "github") => {
    try {
      setSocialLoading(provider);
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success(`Continuing with ${provider === "google" ? "Google" : "GitHub"}`);
    } catch {
      toast.error("Social authentication failed");
    } finally {
      setSocialLoading(null);
    }
  };

  const switchToSignIn = () => {
    setSignUpModal(false);
    setTimeout(() => setSignInModal(true), 300);
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
                  type="button"
                  onClick={() => onSocialAuth("google")}
                  disabled={socialLoading !== null}
                  variant="outline"
                  className="w-full py-6 border-slate-200 hover:bg-slate-50 gap-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5 text-red-500" />
                  )}
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  onClick={() => onSocialAuth("github")}
                  disabled={socialLoading !== null}
                  variant="outline"
                  className="w-full py-6 border-slate-200 hover:bg-slate-50 gap-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                >
                  {socialLoading === "github" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Github className="w-5 h-5" />
                  )}
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
                className="w-full py-6 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg gap-2 border border-dashed border-slate-200"
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
                  type="button"
                  onClick={() => setView("initial")}
                  className="text-xs font-semibold text-emerald-600 hover:underline mb-2 flex items-center gap-1 w-fit"
                >
                  ← Back to options
                </button>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Create Seller Account
                </DialogTitle>

                <p>{accountType}</p>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                    className={cn(
                      "h-11 rounded-lg border-slate-200 focus:ring-emerald-500",
                      errors.name && "border-destructive",
                    )}
                  />
                  <AnimatePresence>
                    {errors.name?.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="name@company.com"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                    className={cn(
                      "h-11 rounded-lg border-slate-200 focus:ring-emerald-500",
                      errors.email && "border-destructive",
                    )}
                  />
                  <AnimatePresence>
                    {errors.email?.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password with Eye Button & Validation */}
                <div className="space-y-3">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={!!errors.password}
                      {...register("password")}
                      placeholder="••••••••"
                      className={cn(
                        "h-11 rounded-lg border-slate-200 pr-10",
                        errors.password && "border-destructive",
                      )}
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
                  <AnimatePresence>
                    {errors.password?.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                      placeholder="Confirm password"
                      className={cn(
                        "h-11 rounded-lg border-slate-200 pr-10",
                        errors.confirmPassword && "border-destructive",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.confirmPassword?.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-destructive"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </AnimatePresence>

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
                  type="submit"
                  disabled={strengthCount < 4}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-200 transition-all gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={switchToSignIn}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
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
