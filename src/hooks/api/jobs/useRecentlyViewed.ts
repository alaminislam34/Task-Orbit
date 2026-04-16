import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";
import {
  RecentlyViewedItem,
  RecentlyViewedQueryParams,
} from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeRecentlyViewedList = (payload: unknown): RecentlyViewedItem[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as RecentlyViewedItem[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      items?: unknown;
      data?: unknown;
      recentlyViewed?: unknown;
    };

    if (Array.isArray(objectPayload.recentlyViewed)) {
      return objectPayload.recentlyViewed as RecentlyViewedItem[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as RecentlyViewedItem[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as RecentlyViewedItem[];
    }
  }

  return [];
};

export const useRecentlyViewed = (filters: RecentlyViewedQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.jobs.recentlyViewed(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOB_SEEKER.RECENTLY_VIEWED, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeRecentlyViewedList(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<RecentlyViewedItem[]>;
    },
    staleTime: 1000 * 30,
    placeholderData: (previous) => previous,
  });
};

export const useAddRecentlyViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      return httpClient.post(ENDPOINT.JOB_SEEKER.RECENTLY_VIEWED_BY_ID(jobId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "recently-viewed"] });
    },
  });
};

export const useDeleteRecentlyViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      return httpClient.del(ENDPOINT.JOB_SEEKER.RECENTLY_VIEWED_BY_ID(jobId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "recently-viewed"] });
    },
  });
};
