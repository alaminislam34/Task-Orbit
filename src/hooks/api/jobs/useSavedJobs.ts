import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { SavedJobItem, SavedJobsQueryParams } from "@/types/jobs.types";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";

type ToggleSaveResponse = {
  saved: boolean;
};

const normalizeSavedJobs = (payload: unknown): SavedJobItem[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as SavedJobItem[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      savedJobs?: unknown;
      items?: unknown;
      data?: unknown;
    };

    if (Array.isArray(objectPayload.savedJobs)) {
      return objectPayload.savedJobs as SavedJobItem[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as SavedJobItem[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as SavedJobItem[];
    }
  }

  return [];
};

export const useSavedJobs = (filters: SavedJobsQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.jobs.savedJobs(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(
        ENDPOINT.APPLICATION.GET_SAVED_JOBS,
        {
          params: filters,
        },
      );

      return {
        ...response,
        data: normalizeSavedJobs(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<SavedJobItem[]>;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
};

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      return httpClient.post<ToggleSaveResponse>(
        ENDPOINT.APPLICATION.TOGGLE_SAVED_JOB(jobId),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.savedJobs({}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
};
