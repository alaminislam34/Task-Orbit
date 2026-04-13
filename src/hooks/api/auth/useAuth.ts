import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { useSessionToken, useUserActions } from "@/store/useUserStore";
import { UserProfileResponse, LoginResponse } from "@/types/api.types";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { useEffect } from "react";
import { getApiErrorMessage } from "@/lib/api-error";

const getGoogleLoginUrl = (redirectPath?: string) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, "");
  const fallbackRedirect =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/dashboard";

  const requestedRedirect = redirectPath ?? fallbackRedirect;
  const safeRedirect = requestedRedirect.startsWith("/") ? requestedRedirect : "/dashboard";

  return `${normalizedBaseUrl}${ENDPOINT.AUTH.GOOGLE_LOGIN}?redirect=${encodeURIComponent(safeRedirect)}`;
};

const OAUTH_PENDING_KEY = "taskorbit_oauth_pending";

const isUnauthorizedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { statusCode?: number; message?: string };
  if (maybeError.statusCode === 401) {
    return true;
  }

  if (typeof maybeError.message === "string") {
    return maybeError.message.toLowerCase().includes("unauthorized");
  }

  return false;
};

const hasOAuthSuccessSignal = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hasAuthSuccess = searchParams.get("auth") === "success";
  const hasPendingMarker = window.sessionStorage.getItem(OAUTH_PENDING_KEY) === "1";

  return hasAuthSuccess || hasPendingMarker;
};

export const useUser = () => {
  const queryClient = useQueryClient();
  const sessionToken = useSessionToken();
  const { setUser, setLoading, setError, logout } = useUserActions();
  const shouldFetchUser = Boolean(sessionToken) || hasOAuthSuccessSignal();

  const query = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async () => {
      const response = await httpClient.get<UserProfileResponse["data"]>(ENDPOINT.USER.ME);
      return response;
    },
    enabled: shouldFetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setUser(query.data.data);

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(OAUTH_PENDING_KEY);

        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.get("auth") === "success") {
          currentUrl.searchParams.delete("auth");
          window.history.replaceState({}, "", currentUrl.toString());
        }
      }
    }
  }, [query.data, setUser]);

  useEffect(() => {
    // Keep global loading false when auth query is disabled (e.g., logged out).
    setLoading(shouldFetchUser && (query.isPending || query.isFetching));
  }, [shouldFetchUser, query.isPending, query.isFetching, setLoading]);

  useEffect(() => {
    if (query.isError) {
      setError(getApiErrorMessage(query.error));

      if (isUnauthorizedError(query.error)) {
        logout();
        queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      }

      return;
    }

    setError(null);
  }, [query.isError, query.error, setError, logout, queryClient]);

  return query;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuthSession, setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (credentials: Record<string, unknown>) => {
      const response = await httpClient.post<LoginResponse["data"]>(ENDPOINT.AUTH.LOGIN, credentials);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setAuthSession({
        user: response.data.user,
        sessionToken: response.data.token.sessionToken,
        accessToken: response.data.token.accesssToken ?? response.data.accessToken,
        refreshToken: response.data.token.refreshToken ?? response.data.refreshToken,
        tokenExpiresAt: response.data.token.expiresAt,
      });

      // Invalidate user query to fetch fresh data if needed
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useGoogleLogin = () => {
  const { setLoading, setError } = useUserActions();

  return (redirectPath?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        return;
      }

      window.sessionStorage.setItem(OAUTH_PENDING_KEY, "1");

      window.location.assign(getGoogleLoginUrl(redirectPath));
    } catch (error) {
      setLoading(false);
      setError(getApiErrorMessage(error));
      throw error;
    }
  };
};

export const useRegister = () => {
  const { setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await httpClient.post(ENDPOINT.AUTH.REGISTER, data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout, setLoading, setError } = useUserActions();

  const completeLocalLogout = () => {
    logout();
    queryClient.clear();

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(OAUTH_PENDING_KEY);
    }
  };

  return useMutation({
    mutationFn: async () => {
      const response = await httpClient.post(ENDPOINT.AUTH.LOGOUT, {});
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      completeLocalLogout();
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
      completeLocalLogout();
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useVerifyEmail = () => {
  const { setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await httpClient.post(ENDPOINT.AUTH.VERIFY_EMAIL, data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useResendOtp = () => {
  const { setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await httpClient.post(ENDPOINT.AUTH.RESEND_OTP, data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useForgotPassword = () => {
  const { setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await httpClient.post(ENDPOINT.AUTH.FORGOT_PASSWORD, data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useResetPassword = () => {
  const { setLoading, setError } = useUserActions();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await httpClient.post(ENDPOINT.AUTH.RESET_PASSWORD, data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

