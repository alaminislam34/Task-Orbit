import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Service, ServicesQueryParams, CreateServicePayload, UpdateServicePayload } from "@/types/services.types";

export const useAllServices = (filters: ServicesQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<Service[]>("/services", { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
};

export const useSellerServices = () => {
  return useQuery({
    queryKey: [...queryKeys.services.lists(), "seller"],
    queryFn: async () => {
      const response = await httpClient.get<Service[]>("/seller/services");
      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useServiceDetail = (serviceId: string) => {
  return useQuery({
    queryKey: queryKeys.services.detail(serviceId),
    queryFn: async () => {
      const response = await httpClient.get<Service>(`/services/${serviceId}`);
      return response;
    },
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const response = await httpClient.post<Service>("/seller/create-gigs", payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
};

export const useUpdateService = (serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServicePayload) => {
      const response = await httpClient.patch<Service>(`/seller/update-gigs/${serviceId}`, payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(serviceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      // NOTE: Deduced endpoint handling missing specification
      const response = await httpClient.del<void>(`/seller/services/${serviceId}`);
      return response;
    },
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.services.detail(serviceId) });
    },
  });
};
