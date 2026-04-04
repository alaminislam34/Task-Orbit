import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";

export const useUser = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await httpClient.get(ENDPOINT.USER.ME);
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};


