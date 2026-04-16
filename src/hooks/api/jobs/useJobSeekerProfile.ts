import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  JobSeekerProfile,
  UpdateJobSeekerProfilePayload,
} from "@/types/jobs.types";
import { queryKeys } from "../queryKeys";

const normalizeProfile = (payload: unknown): JobSeekerProfile => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const objectPayload = payload as {
    data?: unknown;
    profile?: unknown;
    settings?: unknown;
  };

  const rawProfile =
    typeof objectPayload.data === "object" && objectPayload.data !== null
      ? objectPayload.data
      : typeof objectPayload.profile === "object" && objectPayload.profile !== null
        ? objectPayload.profile
        : payload;

  const profile = rawProfile as JobSeekerProfile;

  return {
    ...profile,
    settings:
      profile.settings && typeof profile.settings === "object"
        ? profile.settings
        : typeof objectPayload.settings === "object" && objectPayload.settings !== null
          ? (objectPayload.settings as JobSeekerProfile["settings"])
          : undefined,
  };
};

export const useJobSeekerProfile = () => {
  return useQuery({
    queryKey: queryKeys.jobs.seekerProfile,
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOB_SEEKER.PROFILE);

      return {
        ...response,
        data: normalizeProfile(response.data),
      } as ApiResponse<JobSeekerProfile>;
    },
  });
};

export const useUpdateJobSeekerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateJobSeekerProfilePayload) => {
      return httpClient.patch<JobSeekerProfile>(
        ENDPOINT.JOB_SEEKER.PROFILE,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.seekerProfile });
    },
  });
};
