import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { useRouter } from "next/navigation";
import { httpClient } from "@/lib/axios/httpClient";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const logoutStore = useUserStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Send the logout request to the backend.
            // Axios will automatically send the httpOnly session token in headers.
            await httpClient.post(ENDPOINT.AUTH.LOGOUT, {});
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            // Always clean up frontend state regardless of backend success
            await logoutStore();
            queryClient.clear();
            router.push("/");
            // Full reload to clear any lingering context/memory
            window.location.reload();
        }
    };

    return handleLogout;
};