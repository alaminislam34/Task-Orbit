// views/EmailSignUpForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { sellerSignUpSchema } from "@/types/zod.validation";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { useStateContext } from "@/providers/StateProvider";

export const EmailSignUpForm = ({ onBack }: { onBack: () => void }) => {
    const queryClient = useQueryClient();
    const { setSignUpModal, setOtpModalOpen, setUserEmail, accountType } = useStateContext();

    const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(sellerSignUpSchema),
        defaultValues: { accountType }
    });

    const password = watch("password", "");
    const { checks, strengthCount } = usePasswordStrength(password);

    const onSubmit = async (data: any) => {
        try {
            const res = await httpClient.post(ENDPOINT.AUTH.REGISTER, data);
            if (res.success) {
                // Industry Practice: Sync Auth State
                await queryClient.invalidateQueries({ queryKey: ["authUser"] });

                setUserEmail(data.email);
                setSignUpModal(false);
                setOtpModalOpen(true);
            }
        } catch (error: any) {
            // Handle server-side Zod errors mapping...
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Input fields here... */}
            {/* Password Strength UI here... */}
        </form>
    );
};