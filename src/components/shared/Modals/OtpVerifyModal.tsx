"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2, RotateCw } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";

const OtpVerifyModal = () => {
    const { otpModalOpen, setOtpModalOpen, userEmail } = useStateContext();
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpModalOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpModalOpen, timer]);

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (otp.length !== 6) return toast.error("Please enter a 6-digit code");

        setIsVerifying(true);
        try {
            const res = await httpClient.post(ENDPOINT.AUTH.VERIFY_EMAIL, {
                email: userEmail,
                otp: otp,
            });

            if (res.success) {
                toast.success(res.message);
                setOtpModalOpen(false);

                setTimeout(() => {
                    router.push("/");
                }, 1000);
            }
        } catch (error: any) {
            toast.error(error?.message);
            setOtp("");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        try {
            const res = await httpClient.post(ENDPOINT.AUTH.RESEND_OTP, {
                email: userEmail,
            });
            if (res.success) {
                toast.success(res.message);
                setTimer(60);
            }
        } catch (error: any) {
            toast.error(error?.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
            <DialogContent className="sm:max-w-112.5 p-8 overflow-hidden border-none bg-white/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Verify your email
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        We've sent a 6-digit code to <br />
                        <span className="font-semibold text-primary">{userEmail}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-8 py-4">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        onComplete={(value) => handleVerify(value)}
                        disabled={isVerifying}
                        // --- ফোনের Auto-fill এর জন্য এই ৩টি লাইন মাস্ট ---
                        autoFocus
                        autoComplete="one-time-code" // iOS/Android কে সিগনাল দেয় যে এটি OTP
                        inputMode="numeric"          // কিবোর্ডে শুধুমাত্র নাম্বার প্যাড ওপেন করবে
                    >
                        <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="rounded-md border h-12 w-12 text-lg" />
                            <InputOTPSlot index={1} className="rounded-md border h-12 w-12 text-lg" />
                            <InputOTPSlot index={2} className="rounded-md border h-12 w-12 text-lg" />
                            <InputOTPSlot index={3} className="rounded-md border h-12 w-12 text-lg" />
                            <InputOTPSlot index={4} className="rounded-md border h-12 w-12 text-lg" />
                            <InputOTPSlot index={5} className="rounded-md border h-12 w-12 text-lg" />
                        </InputOTPGroup>
                    </InputOTP>

                    <div className="w-full space-y-4">
                        <Button
                            className="w-full h-12 font-bold text-base transition-all"
                            onClick={() => handleVerify()}
                            disabled={isVerifying || otp.length !== 6}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Account"
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive a code?{" "}
                                <button
                                    onClick={handleResend}
                                    disabled={timer > 0 || isResending}
                                    className="text-primary font-bold hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center"
                                >
                                    {isResending && <RotateCw className="mr-1 h-3 w-3 animate-spin" />}
                                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OtpVerifyModal;