// views/EmailSignUpForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { sellerSignUpSchema } from "@/types/zod.validation";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { useRegister } from "@/hooks/api";
import { useStateContext } from "@/providers/StateProvider";
import { motion } from "motion/react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const EmailSignUpForm = ({ onBack }: { onBack: () => void }) => {
    const queryClient = useQueryClient();
    const { setSignUpModal, setOtpModalOpen, setUserEmail, accountType, setOtpOrigin } = useStateContext();
    const { mutateAsync: registerMutate } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(sellerSignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            accountType: accountType || "SELLER"
        }
    });

    const password = watch("password", "");
    const { checks, strengthCount } = usePasswordStrength(password);

    const getStrengthColor = () => {
        if (strengthCount === 0) return "bg-slate-200";
        if (strengthCount === 1) return "bg-red-500";
        if (strengthCount === 2) return "bg-orange-500";
        if (strengthCount === 3) return "bg-yellow-500";
        return "bg-emerald-500";
    };

    const getStrengthLabel = () => {
        if (strengthCount === 0) return "";
        if (strengthCount === 1) return "Weak";
        if (strengthCount === 2) return "Fair";
        if (strengthCount === 3) return "Good";
        return "Strong";
    };

    const onSubmit = async (data: any) => {
        try {
            const res = await registerMutate(data);
            if (res?.success || res?.message || res) {
                await queryClient.invalidateQueries({ queryKey: ["authUser"] });

                setUserEmail(data.email);
                setOtpOrigin("register");
                setSignUpModal(false);
                setOtpModalOpen(true);
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong during sign up.");
            if (error?.errors) {
               Object.keys(error.errors).forEach(key => {
                   setError(key as any, { type: "server", message: error.errors[key] });
               });
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
        >
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 rounded-full" type="button">
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <DialogHeader className="p-0 text-left border-none">
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                        Sign up with Email
                    </DialogTitle>
                </DialogHeader>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                        className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm font-medium text-red-500">{errors.name.message?.toString()}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm font-medium text-red-500">{errors.email.message?.toString()}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...register("password")}
                            className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message?.toString()}</p>}
                    
                    {password && (
                        <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex w-full gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 w-full rounded-full transition-colors duration-300 md:duration-500 ${
                                            strengthCount >= level ? getStrengthColor() : "bg-slate-200"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className={`text-xs font-bold w-12 text-right transition-colors ${strengthCount >= 3 ? "text-emerald-600" : "text-slate-500"}`}>
                                {getStrengthLabel()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repeat your password"
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message?.toString()}</p>}
                </div>

                <Button 
                    type="submit" 
                    className="w-full py-6 mt-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all rounded-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>
        </motion.div>
    );
};