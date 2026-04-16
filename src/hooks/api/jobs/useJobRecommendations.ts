import { useQuery } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";
import { Job, RecommendationQueryParams } from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeRecommendations = (payload: unknown): Job[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as Job[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      jobs?: unknown;
      items?: unknown;
      data?: unknown;
      recommendations?: unknown;
    };

    if (Array.isArray(objectPayload.recommendations)) {
      return objectPayload.recommendations as Job[];
    }

    if (Array.isArray(objectPayload.jobs)) {
      return objectPayload.jobs as Job[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as Job[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as Job[];
    }
  }

  return [];
};

export const useJobRecommendations = (filters: RecommendationQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.jobs.recommendations(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOB_SEEKER.RECOMMENDATIONS, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeRecommendations(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<Job[]>;
    },
    staleTime: 1000 * 60,
    placeholderData: (previous) => previous,
  });
};
