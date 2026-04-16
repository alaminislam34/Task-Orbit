import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { JobApplication } from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeApplicationDetail = (payload: unknown): JobApplication | null => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "object" && payload !== null) {
    const objectPayload = payload as {
      data?: unknown;
      application?: unknown;
    };

    if (objectPayload.data && typeof objectPayload.data === "object") {
      return objectPayload.data as JobApplication;
    }

    if (objectPayload.application && typeof objectPayload.application === "object") {
      return objectPayload.application as JobApplication;
    }

    return objectPayload as JobApplication;
  }

  return null;
};

export const useApplicationDetail = (applicationId?: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.applicationDetail(applicationId || ""),
    enabled: Boolean(applicationId),
    staleTime: 1000 * 30,
    queryFn: async () => {
      const response = await httpClient.get<unknown>(
        ENDPOINT.APPLICATION.GET_APPLICATION_DETAIL(applicationId as string),
      );

      return {
        ...response,
        data: normalizeApplicationDetail(response.data),
      } as ApiResponse<JobApplication | null>;
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      return httpClient.patch(
        ENDPOINT.APPLICATION.WITHDRAW_APPLICATION(applicationId),
      );
    },
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.applicationDetail(applicationId),
      });
    },
  });
};

export const useApplicationResumeAccess = (applicationId?: string) => {
  return useQuery({
    queryKey: ["applications", "resume", applicationId],
    enabled: Boolean(applicationId),
    queryFn: async () => {
      return httpClient.get<{ resumeAccessUrl?: string }>(
        ENDPOINT.APPLICATION.DOWNLOAD_RESUME(applicationId as string),
      );
    },
    staleTime: 1000 * 60,
  });
};
