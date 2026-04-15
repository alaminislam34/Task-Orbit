import {
  useCreateJob,
  useDeleteJob,
  useUpdateJob,
} from "./useJobs";
import { useQuery } from "@tanstack/react-query";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { JobsQueryParams } from "@/types/jobs.types";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";
import { Job } from "@/types/jobs.types";

const normalizeRecruiterJobs = (payload: unknown): Job[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as Job[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as { data?: unknown; jobs?: unknown; items?: unknown };

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as Job[];
    }

    if (Array.isArray(objectPayload.jobs)) {
      return objectPayload.jobs as Job[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as Job[];
    }
  }

  return [];
};

export const useRecruiterJobs = (filters: JobsQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.jobs.list({ ...filters, scope: "recruiter" }),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOBS.GET_RECRUITER_JOBS, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeRecruiterJobs(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<Job[]>;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
};

export const useCreateRecruiterJob = useCreateJob;
export const useUpdateRecruiterJob = useUpdateJob;
export const useDeleteRecruiterJob = useDeleteJob;
