"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";
import { useForgotPassword } from "@/hooks/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordModal = () => {
  const {
    forgotPasswordModal,
    setForgotPasswordModal,
    setSignInModal,
    setOtpModalOpen,
    setOtpOrigin,
    setUserEmail
  } = useStateContext();

  const { mutateAsync: forgotPasswordMutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleOpenChange = (open: boolean) => {
    setForgotPasswordModal(open);
    if (!open) {
      reset();
    }
  };

  const switchToSignIn = () => {
    setForgotPasswordModal(false);
    setTimeout(() => setSignInModal(true), 300);
  };

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const res = await forgotPasswordMutate(values);
      if (res?.success || res?.message) {
        toast.success(res?.message || "OTP sent to your email!");
        setUserEmail(values.email);
        setOtpOrigin("forgot_password");

        setForgotPasswordModal(false);
        setTimeout(() => setOtpModalOpen(true), 300);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to process request");
    }
  };

  return (
    <Dialog open={forgotPasswordModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-8 space-y-0 border-none bg-white/98 backdrop-blur-xl shadow-2xl">

        <div className="flex items-center mb-4">
          <button onClick={switchToSignIn} className="mr-3 text-slate-400 hover:text-slate-600 transition">
            <ArrowLeft size={20} />
          </button>
          <DialogHeader className="p-0 text-left w-full border-none space-y-1">
            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Enter your email and we'll send you an OTP to verify it's you.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-sm font-medium text-slate-700">Email Address</Label>
            <div className="relative">
              <Input
                id="forgot-email"
                {...register("email")}
                placeholder="name@example.com"
                className={cn(
                  "h-11 pl-10 rounded-lg border-slate-200 focus:ring-emerald-500",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-md transition-all gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send Reset OTP"
            )}
          </Button>
        </form>

      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;