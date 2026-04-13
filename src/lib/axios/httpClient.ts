import { ApiResponse } from "@/types/api.types";
import ENDPOINT from "@/apiEndpoint/endpoint";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/store/useUserStore";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.",
  );
}

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

const extractTokenFromRefreshResponse = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as {
    data?: {
      accessToken?: string;
      token?: {
        accesssToken?: string;
      };
    };
  };

  return data.data?.token?.accesssToken ?? data.data?.accessToken ?? null;
};

const isRefreshEndpoint = (url?: string) => {
  if (!url) {
    return false;
  }

  return url.includes(ENDPOINT.AUTH.REFRESH_TOKEN);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = axiosInstance
          .post(ENDPOINT.AUTH.REFRESH_TOKEN, {})
          .then((response) => {
            const refreshedToken = extractTokenFromRefreshResponse(response.data);

            if (refreshedToken && typeof window !== "undefined") {
              useUserStore.getState().setAuthTokens({
                accessToken: refreshedToken,
              });
            }

            return refreshedToken;
          })
          .catch(() => null)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const refreshedToken = await refreshPromise;

      if (refreshedToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${refreshedToken}`,
        };

        return axiosInstance(originalRequest);
      }
    }

    if (error.response?.data) {
      throw error.response.data;
    }

    throw error;
  },
);

interface ApiResponseOptions {
  params: Record<string, unknown>;
  headers: Record<string, string>;
}

const get = async <TData>(
  endpoint: string,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance.get(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

const post = async <TData>(
  endpoint: string,
  data: Record<string, unknown> | FormData,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance.post(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

const put = async <TData>(
  endpoint: string,
  data: Record<string, unknown>,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance.put(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

const patch = async <TData>(
  endpoint: string,
  data: Record<string, unknown>,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance.patch(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

const del = async <TData>(
  endpoint: string,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance.delete(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const httpClient = {
  get,
  post,
  put,
  patch,
  del,
};
