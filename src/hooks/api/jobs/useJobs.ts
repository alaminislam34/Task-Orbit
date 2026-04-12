import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Job, JobsQueryParams, CreateJobPayload, UpdateJobPayload } from "@/types/jobs.types";

export const useJobs = (filters: JobsQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<Job[]>("/jobs", { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
};

export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: async () => {
      const response = await httpClient.get<Job>(`/jobs/${jobId}`);
      return response;
    },
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const response = await httpClient.post<Job>("/recruiter/create-job", payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
};

export const useUpdateJob = (jobId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateJobPayload) => {
      const response = await httpClient.patch<Job>(`/recruiter/update-job/${jobId}`, payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      // NOTE: Deduced endpoint as it was missing from Postman collection
      const response = await httpClient.del<void>(`/jobs/${jobId}`);
      return response;
    },
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.jobs.detail(jobId) });
    },
  });
};
