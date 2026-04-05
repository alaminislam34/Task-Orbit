import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { getCookie } from "cookies-next";

export const useUser = () => {
    const hasSession =
        !!getCookie("accessToken") ||
        !!getCookie("refreshToken") ||
        !!getCookie("better-auth.session_token");

    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            // Strict Security: Function-er bhitoreo check kora jeno bhuleo hit na jay
            if (!hasSession) return null;

            const res = await httpClient.get(ENDPOINT.USER.ME);
            return res.data;
        },
        enabled: hasSession, // Cookie na thakle query 'idle' thakbe
        staleTime: 1000 * 60 * 5, // 5 minute por por data puran hobe
        retry: 0, // 1 er jaygay 0 den, jate fail korle bar bar backend e hit na kore
        refetchOnWindowFocus: false, // Window switch korle bar bar fetch bondho hobe
        placeholderData: null,
    });
};