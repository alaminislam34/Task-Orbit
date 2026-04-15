import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { httpClient } from "@/lib/axios/httpClient";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { queryKeys } from "../queryKeys";
import {
  ApplyJobPayload,
  CreateJobPayload,
  Job,
  JobsQueryParams,
  UpdateJobPayload,
} from "@/types/jobs.types";
import { ApiResponse } from "@/types/api.types";
import { getApiErrorMessage } from "@/lib/api-error";
import { useJobActions, useJobStore } from "@/store/useJobStore";

const normalizeJobsData = (payload: unknown): Job[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as Job[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as {
      jobs?: unknown;
      data?: unknown;
      items?: unknown;
    };

    if (Array.isArray(objectPayload.jobs)) {
      return objectPayload.jobs as Job[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as Job[];
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as Job[];
    }
  }

  return [];
};

const hasQueryFilters = (filters: JobsQueryParams) =>
  Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== "",
  );

const toApiFilters = (filters: JobsQueryParams) => {
  const { minSalary, maxSalary, ...rest } = filters;

  return {
    ...rest,
    salaryMin: filters.salaryMin ?? minSalary,
    salaryMax: filters.salaryMax ?? maxSalary,
  };
};

export const useGetAllJobs = (filters: JobsQueryParams = {}) => {
  const queryClient = useQueryClient();
  const cachedJobs = useJobStore((state) => state.jobs);
  const { setJobs, setLoading, setError } = useJobActions();
  const shouldUseStoreCache = !hasQueryFilters(filters) && cachedJobs.length > 0;

  const query = useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.JOBS.GET_JOBS, {
        params: toApiFilters(filters),
        headers: {},
      });

      return {
        ...response,
        data: normalizeJobsData(response.data),
      } as ApiResponse<Job[]>;
    },
    staleTime: 1000 * 60,
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
    if (query.data?.success) {
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

  useEffect(() => {
    if (query.data?.success) {
      queryClient.setQueryData(queryKeys.jobs.list(filters), query.data);
    }
  }, [filters, query.data, queryClient]);

  return query;
};

export const useGetJobById = (jobId: string) => {
  const currentJob = useJobStore((state) => state.currentJob);
  const { setCurrentJob, setLoading, setError } = useJobActions();
  const hasMatchingCurrentJob = currentJob?.id === jobId;

  const query = useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: async () => {
      const response = await httpClient.get<Job>(ENDPOINT.JOBS.GET_JOB(jobId));
      return response;
    },
    enabled: Boolean(jobId),
    staleTime: 1000 * 60,
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
    if (query.data?.success) {
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
      return httpClient.post<Job>(
        ENDPOINT.JOBS.CREATE_JOB,
        payload as unknown as Record<string, unknown>,
      );
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertJob(response.data);
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
      return httpClient.patch<Job>(
        ENDPOINT.JOBS.UPDATE_JOB(jobId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertJob(response.data);
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
      return httpClient.del<void>(ENDPOINT.JOBS.DELETE_JOB(jobId));
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (_, jobId) => {
      removeJob(jobId);
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
      if (!payload.jobId) {
        throw {
          message: "Job selection is required before applying.",
          statusCode: 400,
          errorSource: [
            {
              path: "jobId",
              message: "Please choose a job before submitting the application.",
            },
          ],
        };
      }

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
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// Backward-compatible aliases
export const useJobs = useGetAllJobs;
export const useJob = useGetJobById;