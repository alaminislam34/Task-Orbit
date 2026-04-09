"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .regex(/[A-Z]/, { message: "Missing uppercase" })
      .regex(/[a-z]/, { message: "Missing lowercase" })
      .regex(/[0-9]/, { message: "Missing number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");

  // রিকোয়ারমেন্ট চেক করার লজিক
  const requirements = [
    { label: "At least 8 characters", test: passwordValue.length >= 8 },
    {
      label: "At least one uppercase letter",
      test: /[A-Z]/.test(passwordValue),
    },
    {
      label: "At least one lowercase letter",
      test: /[a-z]/.test(passwordValue),
    },
    { label: "At least one number", test: /[0-9]/.test(passwordValue) },
  ];

  const onSubmit = async (data: ResetValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4">
        <Card className="w-full max-w-md border-none shadow-2xl ring-1 ring-slate-200 text-center animate-in zoom-in duration-300">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                Password Updated
              </CardTitle>
              <CardDescription>
                You can now log in with your new credentials.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/admin/login")}
            >
              <Link href="/admin/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-10">
      <Card className="w-full max-w-md border-none shadow-2xl ring-1 ring-slate-200">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create New Password
          </CardTitle>
          <CardDescription>
            Please choose a strong password for Task-Orbit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div className="space-y-3">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-slate-600">
                  Password Requirements:
                </p>
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {req.test ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-1 w-1 rounded-full bg-slate-400 ml-1" />
                    )}
                    <span
                      className={`text-[11px] ${req.test ? "text-green-700 font-medium" : "text-slate-500"}`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-semibold shadow-lg transition-all active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
