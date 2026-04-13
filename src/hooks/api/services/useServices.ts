import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Service, ServicesQueryParams, CreateServicePayload, UpdateServicePayload } from "@/types/services.types";
import { useServiceActions, useServiceStore } from "@/store/useServiceStore";
import { useEffect } from "react";
import ENDPOINT from "@/apiEndpoint/endpoint";
import { ApiResponse } from "@/types/api.types";
import { getApiErrorMessage } from "@/lib/api-error";

const hasQueryFilters = (filters: ServicesQueryParams) =>
  Object.values(filters).some((value) => value !== undefined && value !== null && value !== "");

export const useAllServices = (filters: ServicesQueryParams = {}) => {
  const cachedServices = useServiceStore((state) => state.services);
  const { setServices, setLoading, setError } = useServiceActions();
  const shouldUseStoreCache = !hasQueryFilters(filters) && cachedServices.length > 0;

  const query = useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<Service[]>("/services", { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
    initialData: shouldUseStoreCache
      ? ({
          statusCode: 200,
          success: true,
          message: "Using persisted services cache",
          data: cachedServices,
        } as ApiResponse<Service[]>)
      : undefined,
    initialDataUpdatedAt: shouldUseStoreCache ? Date.now() : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setServices(query.data.data);
    }
  }, [query.data, setServices]);

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

export const useSellerServices = () => {
  const { setSellerServices, setLoading, setError } = useServiceActions();

  const query = useQuery({
    queryKey: [...queryKeys.services.lists(), "seller"],
    queryFn: async () => {
      const response = await httpClient.get<Service[]>(ENDPOINT.SELLER.SERVICES);
      return response;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setSellerServices(query.data.data);
    }
  }, [query.data, setSellerServices]);

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

export const useServiceDetail = (serviceId: string) => {
  const currentService = useServiceStore((state) => state.currentService);
  const { setCurrentService, setLoading, setError } = useServiceActions();
  const hasMatchingCurrentService = currentService?.id === serviceId;

  const query = useQuery({
    queryKey: queryKeys.services.detail(serviceId),
    queryFn: async () => {
      const response = await httpClient.get<Service>(`/services/${serviceId}`);
      return response;
    },
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 5,
    initialData:
      hasMatchingCurrentService && currentService
        ? ({
            statusCode: 200,
            success: true,
            message: "Using persisted current service cache",
            data: currentService,
          } as ApiResponse<Service>)
        : undefined,
    initialDataUpdatedAt: hasMatchingCurrentService ? Date.now() : undefined,
  });

  useEffect(() => {
    if (query.data && query.data.success) {
      setCurrentService(query.data.data);
    }
  }, [query.data, setCurrentService]);

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

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { upsertService, setLoading, setError } = useServiceActions();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const response = await httpClient.post<Service>("/seller/create-gigs", payload as unknown as Record<string, unknown>);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertService(response.data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useUpdateService = (serviceId: string) => {
  const queryClient = useQueryClient();
  const { upsertService, setLoading, setError } = useServiceActions();

  return useMutation({
    mutationFn: async (payload: UpdateServicePayload) => {
      const response = await httpClient.patch<Service>(`/seller/update-gigs/${serviceId}`, payload as unknown as Record<string, unknown>);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      upsertService(response.data);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(serviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { removeService, setLoading, setError } = useServiceActions();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      // NOTE: Deduced endpoint handling missing specification
      const response = await httpClient.del<void>(`/seller/services/${serviceId}`);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (_, serviceId) => {
      removeService(serviceId);
      setError(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.services.detail(serviceId) });
    },
    onError: (error) => {
      setError(getApiErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
