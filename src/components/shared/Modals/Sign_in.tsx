"use client";

import React from "react";
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
  Chrome,
  Github,
  LogIn,
  User,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInModal = () => {
  const { signInModal, setSignInModal, setSignUpModal, setClientModal } =
    useStateContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<
    "google" | "github" | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const handleOpenChange = (open: boolean) => {
    setSignInModal(open);
    if (!open) {
      reset();
      setShowPassword(false);
    }
  };

  const handleSignUpRedirect = (type: "client" | "seller") => {
    setSignInModal(false);
    if (type === "client") {
      setTimeout(() => setClientModal(true), 300);
    } else {
      setTimeout(() => setSignUpModal(true), 300);
    }
  };

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const email = values.email;
      const password = values.password;
      const payload = {
        email: email,
        password: password,
      }
      const res = await httpClient.post(ENDPOINT.AUTH.LOGIN, payload)
      if (res.success) {
        toast.success(res.message);
        setSignInModal(false);
        reset();
      }
    } catch (error: any) {
      const errorData = error?.response?.data || error;
      const errorSource = errorData?.errorSource;

      if (Array.isArray(errorSource) && errorSource.length > 0) {
        errorSource.forEach((err: { path: string; message: string }) => {
          const fieldName = err.path as keyof SignInFormValues;

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                    className={cn(
                      "h-11 rounded-lg border-slate-200 focus:ring-emerald-500 pr-10",
                      errors.password && "border-destructive",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition-all gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

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
                type="button"
                onClick={() => onSocialAuth("google")}
                disabled={socialLoading !== null}
                variant="outline"
                className="py-5 border-slate-200 hover:bg-slate-50 gap-2 rounded-lg transition-all duration-200 hover:scale-[1.01]"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Chrome className="w-4 h-4 text-red-500" />
                )}
                Google
              </Button>
              <Button
                type="button"
                onClick={() => onSocialAuth("github")}
                disabled={socialLoading !== null}
                variant="outline"
                className="py-5 border-slate-200 hover:bg-slate-50 gap-2 rounded-lg transition-all duration-200 hover:scale-[1.01]"
              >
                {socialLoading === "github" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
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
                  type="button"
                  onClick={() => handleSignUpRedirect("seller")}
                  className="group flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/30 rounded-lg hover:bg-emerald-50 transition-all text-left"
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
                  type="button"
                  onClick={() => handleSignUpRedirect("client")}
                  className="group flex items-center justify-between p-3 border border-slate-100 bg-slate-50/30 rounded-lg hover:bg-slate-50 transition-all text-left"
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
