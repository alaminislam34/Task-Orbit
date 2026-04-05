import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { UserProfileResponse } from "@/types/api.types";
import { useUserStore } from "@/store/useUserStore";

export const useUser = () => {
    const { setUser } = useUserStore();
    return useQuery<UserProfileResponse>({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await httpClient.get<UserProfileResponse>(ENDPOINT.USER.ME);
            setUser(res.data);
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 0,
        refetchOnWindowFocus: false,
    });
};