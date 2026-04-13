"use client";

import React, { useState } from "react";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  Chrome,
  Github,
  Briefcase,
  User,
  ArrowRight
} from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { cn } from "@/lib/utils";
import { SignInSchema } from "@/types/zod.validation";
import { useGoogleLogin, useLogin } from "@/hooks/api";

type SignInFormValues = z.infer<typeof SignInSchema>;

const SignInModal = () => {
  const { signInModal, setSignInModal, setSignUpModal, setClientModal, setForgotPasswordModal, forgotPasswordModal } = useStateContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = useState("");
  const [requestId, setRequestId] = useState("");

  const { mutateAsync: loginMutate, isPending } = useLogin();
  const googleLogin = useGoogleLogin();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
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
      const res = await loginMutate(values);

      if (res?.data?.user) {
        toast.success(res.message);
        handleOpenChange(false);
      }
    } catch (error: any) {
      const errorResponse = error?.message;
      const requestId = errorResponse?.requestId;

      console.error(`Login failed [RequestID: ${requestId}]:`, error.message);

      toast.error(errorResponse);
    }
  };

  return (
    <Dialog open={signInModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-8 space-y-0 border-none bg-white/98 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to TaskOrbit
          </DialogTitle>
          <p className="text-sm text-slate-500">Welcome back! Please enter your details.</p>
        </DialogHeader>



        {/* Social Logins */}
        <div className="flex justify-center gap-3 items-center">
          <Button
            type="button"
            onClick={() => googleLogin()}
            disabled={isPending}
            variant="outline"
            className="p-2 border-slate-200 hover:bg-slate-50 gap-2 rounded-full transition-all duration-200 hover:scale-[1.01]"
          >
            <FcGoogle />
          </Button>
          <Button variant="outline" className="p-2 border-slate-200 hover:bg-slate-50 gap-2 rounded-full transition-all duration-200 hover:scale-[1.01]">
            <FaGithub />
          </Button>
        </div>


        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-500 font-medium">Continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="name@example.com"
              className={cn(
                "h-11 rounded-lg border-slate-200 focus:ring-emerald-500",
                errors.email && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>

              <button onClick={() => { setForgotPasswordModal(true) }} type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={cn(
                  "h-11 pr-10 rounded-lg border-slate-200 focus:ring-emerald-500",
                  errors.password && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            {loginError && <p className="text-xs text-destructive mt-1">{loginError}</p>}
            {requestId && <p className="text-xs text-destructive mt-1">{requestId}</p>}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-11 bg-slate-800 duration-300 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-md transition-all gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <LogIn size={18} />
              </>
            )}
          </Button>
        </form>


        {/* New to TaskOrbit Section */}
        <div className="space-y-3">
          <p className="text-center text-xs font-semibold text-slate-500">New to TaskOrbit?</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleSignUpRedirect("seller")}
              className="group flex items-center justify-between p-2 cursor-pointer border border-emerald-100 bg-emerald-50/30 rounded-lg hover:bg-emerald-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Become a Seller</p>
                  <p className="text-[11px] text-slate-500">Work and earn money</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => handleSignUpRedirect("client")}
              className="group flex items-center justify-between p-2 cursor-pointer border border-slate-100 bg-slate-50/30 rounded-lg hover:bg-slate-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Join as a Client</p>
                  <p className="text-[11px] text-slate-500">Hire talent and get projects done</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;