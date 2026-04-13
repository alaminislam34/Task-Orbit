import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Job, JobsQueryParams, CreateJobPayload, UpdateJobPayload, ApplyJobPayload } from "@/types/jobs.types";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { useJobActions, useJobStore } from "@/store/useJobStore";
import { useEffect } from "react";
import { ApiResponse } from "@/types/api.types";
import { getApiErrorMessage } from "@/lib/api-error";

const hasQueryFilters = (filters: JobsQueryParams) =>
  Object.values(filters).some((value) => value !== undefined && value !== null && value !== "");

export const useJobs = (filters: JobsQueryParams = {}) => {
  const cachedJobs = useJobStore((state) => state.jobs);
  const { setJobs, setLoading, setError } = useJobActions();
  const shouldUseStoreCache = !hasQueryFilters(filters) && cachedJobs.length > 0;

  const query = useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<Job[]>(ENDPOINT.JOBS.GET_JOBS, { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
    initialData: shouldUseStoreCache
      ? ({
          statusCode: 200,
          success: true,
          message: "Using persisted jobs cache",
          data: cachedJobs,
        } as ApiResponse<Job[]>)
      : undefined,
    initialDataUpdatedAt: shouldUseStoreCache ? Date.now() : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setJobs(query.data.data);
    }
  }, [query.data, setJobs]);

  useEffect(() => {
    setLoading(query.isPending || query.isFetching);
  }, [query.isPending, query.isFetching, setLoading]);

  useEffect(() => {
    if (query.isError) {
      setError(getApiErrorMessage(query.error));
      return;
    }

    setError(null);
  }, [query.isError, query.error, setError]);

  return query;
};

export const useJob = (jobId: string) => {
  const currentJob = useJobStore((state) => state.currentJob);
  const { setCurrentJob, setLoading, setError } = useJobActions();
  const hasMatchingCurrentJob = currentJob?.id === jobId;

  const query = useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: async () => {
      const response = await httpClient.get<Job>(ENDPOINT.JOBS.GET_JOB(jobId));
      return response;
    },
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
    initialData:
      hasMatchingCurrentJob && currentJob
        ? ({
            statusCode: 200,
            success: true,
            message: "Using persisted current job cache",
            data: currentJob,
          } as ApiResponse<Job>)
        : undefined,
    initialDataUpdatedAt: hasMatchingCurrentJob ? Date.now() : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setCurrentJob(query.data.data);
    }
  }, [query.data, setCurrentJob]);

  useEffect(() => {
    setLoading(query.isPending || query.isFetching);
  }, [query.isPending, query.isFetching, setLoading]);

  useEffect(() => {
    if (query.isError) {
      setError(getApiErrorMessage(query.error));
      return;
    }

    setError(null);
  }, [query.isError, query.error, setError]);

  return query;
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { upsertJob, setLoading, setError } = useJobActions();

  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const response = await httpClient.post<Job>(ENDPOINT.JOBS.CREATE_JOB, payload as unknown as Record<string, unknown>);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertJob(response.data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useUpdateJob = (jobId: string) => {
  const queryClient = useQueryClient();
  const { upsertJob, setLoading, setError } = useJobActions();

  return useMutation({
    mutationFn: async (payload: UpdateJobPayload) => {
      const response = await httpClient.patch<Job>(ENDPOINT.JOBS.UPDATE_JOB(jobId), payload as unknown as Record<string, unknown>);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertJob(response.data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { removeJob, setLoading, setError } = useJobActions();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await httpClient.del<void>(ENDPOINT.JOBS.DELETE_JOB(jobId));
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (_, jobId) => {
      removeJob(jobId);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.jobs.detail(jobId) });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useJobActions();

  return useMutation({
    mutationFn: async (payload: ApplyJobPayload) => {
      const formData = new FormData();
      formData.append("jobId", payload.jobId);
      formData.append("cover_letter", payload.cover_letter);
      formData.append("resume", payload.resume);

      const response = await httpClient.post<Job>(
        ENDPOINT.JOBS.APPLY_JOB(payload.jobId),
        formData,
        {
          params: {},
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};