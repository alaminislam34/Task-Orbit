import { ApiResponse } from "@/types/api.types";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.",
  );
}

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};

interface ApiResponseOptions {
  params: Record<string, unknown>;
  headers: Record<string, string>;
}

const get = async <TData>(
  endpoint: string,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().get(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`GET request to ${endpoint} failed: ${error}`);
  }
};

const post = async <TData>(
  endpoint: string,
  data: Record<string, unknown>,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().post(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`POST request to ${endpoint} failed: ${error}`);
  }
};

const put = async <TData>(
  endpoint: string,
  data: Record<string, unknown>,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().put(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`PUT request to ${endpoint} failed: ${error}`);
  }
};

const patch = async <TData>(
  endpoint: string,
  data: Record<string, unknown>,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().patch(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`PATCH request to ${endpoint} failed: ${error}`);
  }
};

const del = async <TData>(
  endpoint: string,
  options?: ApiResponseOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const response = await axiosInstance().delete(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(`DELETE request to ${endpoint} failed: ${error}`);
  }
};

export const httpClient = {
  get,
  post,
  put,
  patch,
  del,
};
