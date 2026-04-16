import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  JobSeekerSettings,
  UpdateJobSeekerSettingsPayload,
} from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeSettings = (payload: unknown): JobSeekerSettings => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const objectPayload = payload as {
    data?: unknown;
    settings?: unknown;
  };

  if (objectPayload.data && typeof objectPayload.data === "object") {
    return objectPayload.data as JobSeekerSettings;
  }

  if (objectPayload.settings && typeof objectPayload.settings === "object") {
    return objectPayload.settings as JobSeekerSettings;
  }

  return objectPayload as JobSeekerSettings;
};

export const useJobSeekerSettings = () => {
  return useQuery({
    queryKey: queryKeys.jobs.seekerSettings,
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOB_SEEKER.SETTINGS);
      return {
        ...response,
        data: normalizeSettings(response.data),
      } as ApiResponse<JobSeekerSettings>;
    },
  });
};

export const useUpdateJobSeekerSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateJobSeekerSettingsPayload) => {
      return httpClient.patch<JobSeekerSettings>(
        ENDPOINT.JOB_SEEKER.SETTINGS,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.seekerSettings });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences });
    },
  });
};
