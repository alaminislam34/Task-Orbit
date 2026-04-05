// views/InitialView.tsx
import { useState } from "react";
import { motion } from "motion/react";
import { Chrome, Github, Mail, Loader2 } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InitialViewProps {
    onEmailClick: () => void;
}

export const InitialView = ({ onEmailClick }: InitialViewProps) => {
    const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

    const onSocialAuth = async (provider: "google" | "github") => {
        try {
            setSocialLoading(provider);
            // Replace this with your actual Social Auth Logic/Redirect
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success(`Redirecting to ${provider}...`);
        } catch (error) {
            toast.error(`${provider} authentication failed`);
        } finally {
            setSocialLoading(null);
        }
    };

    return (
        <motion.div
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

            {/* Social Buttons Group */}
            <div className="grid gap-3">
                <SocialButton
                    icon={<Chrome className={cn("w-5 h-5", socialLoading !== "google" && "text-red-500")} />}
                    label="Continue with Google"
                    isLoading={socialLoading === "google"}
                    onClick={() => onSocialAuth("google")}
                    disabled={!!socialLoading}
                />
                <SocialButton
                    icon={<Github className="w-5 h-5" />}
                    label="Continue with GitHub"
                    isLoading={socialLoading === "github"}
                    onClick={() => onSocialAuth("github")}
                    disabled={!!socialLoading}
                />
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400 font-medium">Or</span>
                </div>
            </div>

            {/* Email Switcher */}
            <Button
                onClick={onEmailClick}
                variant="ghost"
                className="w-full py-6 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg gap-2 border border-dashed border-slate-200"
            >
                <Mail className="w-5 h-5" />
                Continue with Email
            </Button>
        </motion.div>
    );
};

// Internal Helper for cleaner JSX
const SocialButton = ({
    icon,
    label,
    isLoading,
    onClick,
    disabled
}: {
    icon: React.ReactNode,
    label: string,
    isLoading: boolean,
    onClick: () => void,
    disabled: boolean
}) => (
    <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        variant="outline"
        className="w-full py-6 border-slate-200 hover:bg-slate-50 gap-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
    >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
        {label}
    </Button>
);

// Helper for conditional classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}