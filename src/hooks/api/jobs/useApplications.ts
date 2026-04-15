import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import {
  ApplyJobPayload,
  JobApplication,
  MyApplicationsQueryParams,
} from "@/types/jobs.types";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";

const normalizeApplications = (payload: unknown): JobApplication[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as JobApplication[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      applications?: unknown;
      items?: unknown;
      data?: unknown;
    };

    if (Array.isArray(objectPayload.applications)) {
      return objectPayload.applications as JobApplication[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as JobApplication[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as JobApplication[];
    }
  }

  return [];
};

export const useListMyApplications = (
  filters: MyApplicationsQueryParams = {},
) => {
  return useQuery({
    queryKey: queryKeys.jobs.myApplications(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(
        ENDPOINT.APPLICATION.GET_APPLICATIONS,
        {
          params: filters,
        },
      );

      return {
        ...response,
        data: normalizeApplications(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<JobApplication[]>;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApplyJobPayload) => {
      const formData = new FormData();
      formData.append("jobId", payload.jobId);

      if (payload.cover_letter) {
        formData.append("cover_letter", payload.cover_letter);
      }

      if (payload.resume) {
        formData.append("resume", payload.resume);
      }

      return httpClient.post(
        ENDPOINT.APPLICATION.APPLY_TO_JOB(payload.jobId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
};
