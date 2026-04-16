import { useQuery } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  JobSearchSuggestion,
  SearchSuggestionsQueryParams,
} from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeSuggestions = (payload: unknown): JobSearchSuggestion[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as JobSearchSuggestion[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      suggestions?: unknown;
      items?: unknown;
      data?: unknown;
    };

    if (Array.isArray(objectPayload.suggestions)) {
      return objectPayload.suggestions as JobSearchSuggestion[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as JobSearchSuggestion[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as JobSearchSuggestion[];
    }
  }

  return [];
};

export const useSearchSuggestions = (
  params: SearchSuggestionsQueryParams,
  enabled = true,
) => {
  const trimmedQuery = params.q.trim();

  return useQuery({
    queryKey: queryKeys.jobs.searchSuggestions(trimmedQuery),
    enabled: enabled && trimmedQuery.length > 0,
    staleTime: 1000 * 30,
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOBS.SEARCH_SUGGESTIONS, {
        params: {
          q: trimmedQuery,
          limit: params.limit,
        },
      });

      return {
        ...response,
        data: normalizeSuggestions(response.data),
      } as ApiResponse<JobSearchSuggestion[]>;
    },
  });
};
