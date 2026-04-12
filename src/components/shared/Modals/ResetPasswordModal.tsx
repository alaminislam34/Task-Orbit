"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";
import { useResetPassword } from "@/hooks/api";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordModal = () => {
  const { 
    resetPasswordModal, 
    setResetPasswordModal, 
    setSignInModal,
    userEmail,
    resetOtp
  } = useStateContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: resetPasswordMutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const password = watch("newPassword", "");

  const checks = {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*]/.test(password),
    upper: /[A-Z]/.test(password),
  };

  const strengthCount = Object.values(checks).filter(Boolean).length;

  const handleOpenChange = (open: boolean) => {
    setResetPasswordModal(open);
    if (!open) reset();
  };

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const payload = {
          email: userEmail,
          otp: resetOtp,
          newPassword: values.newPassword
      };

      const res = await resetPasswordMutate(payload);
      if (res?.success || res?.message) {
        toast.success(res?.message || "Password reset successfully!");
        setResetPasswordModal(false);
        setTimeout(() => setSignInModal(true), 300);
      }
    } catch (error: any) {
      toast.error(error?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <Dialog open={resetPasswordModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-8 space-y-0 border-none bg-white/98 backdrop-blur-xl shadow-2xl">
        
        <DialogHeader className="p-0 text-left w-full border-none space-y-1 mb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Create New Password
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Please enter your new strong password below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium">New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Create a strong password"
                className={cn(
                  "h-11 rounded-lg focus:ring-emerald-500 pr-10",
                  errors.newPassword && "border-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}

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

          <div className="space-y-3 pt-2">
            <Label className="text-sm font-medium">Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className={cn(
                  "h-11 rounded-lg focus:ring-emerald-500 pr-10",
                  errors.confirmPassword && "border-destructive",
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isPending || strengthCount < 4}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-100 transition-all gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

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

export default ResetPasswordModal;
