import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import {
  ApplicantsQueryParams,
  BulkUpdateApplicationStatusPayload,
  JobApplication,
  UpdateApplicationStatusPayload,
} from "@/types/jobs.types";
import { ApiResponse, PaginatedMeta } from "@/types/api.types";

type ApplicantsPayload = {
  applicants?: JobApplication[];
  data?: JobApplication[];
};

const normalizeApplicants = (payload: unknown): JobApplication[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as JobApplication[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as ApplicantsPayload;

    if (Array.isArray(objectPayload.applicants)) {
      return objectPayload.applicants;
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data;
    }
  }

  return [];
};

export const useListApplicants = (
  jobId: string,
  filters: ApplicantsQueryParams = {},
) => {
  return useQuery({
    queryKey: queryKeys.jobs.applicants(jobId, filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(
        ENDPOINT.APPLICATION.GET_APPLICANTS(jobId),
        {
          params: filters,
        },
      );

      const payload = response.data as
        | { applicants?: unknown; data?: unknown }
        | unknown;

      return {
        ...response,
        data: normalizeApplicants(
          typeof payload === "object" && payload && "data" in payload
            ? (payload as { data?: unknown }).data
            : payload,
        ),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<JobApplication[]>;
    },
    enabled: Boolean(jobId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
};

type UpdateApplicationStatusMutationPayload = UpdateApplicationStatusPayload & {
  applicationId: string;
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, ...payload }: UpdateApplicationStatusMutationPayload) => {
      return httpClient.patch(
        ENDPOINT.APPLICATION.UPDATE_APPLICATION_STATUS(applicationId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications() });
    },
  });
};

export const useBulkUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUpdateApplicationStatusPayload) => {
      return httpClient.patch(
        ENDPOINT.APPLICATION.BULK_ACTION,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications() });
    },
  });
};
