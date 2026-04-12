import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { useUserStore } from "@/store/useUserStore";
import { UserProfileResponse, LoginResponse } from "@/types/api.types";

export const useUser = () => {
  const { sessionToken } = useUserStore();

  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      const response = await httpClient.get<UserProfileResponse["data"]>("/user/me");
      return response;
    },
    enabled: !!sessionToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setSessionToken, setUser } = useUserStore();

  return useMutation({
    mutationFn: async (credentials: Record<string, any>) => {
      const response = await httpClient.post<LoginResponse["data"]>("/auth/login", credentials);
      return response;
    },
    onSuccess: (response) => {
      setSessionToken(response.data.token.sessionToken);
      setUser(response.data.user);

      // Invalidate user query to fetch fresh data if needed
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await httpClient.post("/auth/register", data);
      return response;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      const response = await httpClient.post("/auth/logout", {});
      return response;
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached queries on logout
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await httpClient.post("/auth/verify-email", data);
      return response;
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await httpClient.post("/auth/resend-otp", data);
      return response;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await httpClient.post("/auth/forgot-password", data);
      return response;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await httpClient.post("/auth/reset-password", data);
      return response;
    },
  });
};

