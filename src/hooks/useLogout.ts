import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { toast } from "sonner";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const logoutStore = useUserStore((state) => state.logout);
    const sessionToken = useUserStore((state) => state.sessionToken);

    const handleLogout = async () => {
        try {
            await httpClient.post(ENDPOINT.AUTH.LOGOUT, { sessionToken });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            await logoutStore();
            queryClient.clear();
        }
    };

    return handleLogout;
};