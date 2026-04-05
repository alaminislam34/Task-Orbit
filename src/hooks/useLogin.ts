import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { LoginResponse } from "@/types/api.types";
import { useUserStore } from "@/store/useUserStore";


export const useLogin = () => {
    const queryClient = useQueryClient();
    const { setUser, setSessionToken } = useUserStore();

    return useMutation<LoginResponse, any, any>({
        mutationKey: ["login"],
        mutationFn: async (credentials) => {
            const res = await httpClient.post<LoginResponse>(ENDPOINT.AUTH.LOGIN, credentials);
            return res.data;
        },
        onSuccess: async (data: LoginResponse) => {
            const userData = data?.data?.user;
            const sessionToken = data?.data?.token?.sessionToken;
            if (userData && sessionToken) {
                setSessionToken(sessionToken);
                setUser(userData);
                queryClient.setQueryData(["authUser"], userData);
                await queryClient.invalidateQueries({ queryKey: ["authUser"] });
            }
        },
    });
};