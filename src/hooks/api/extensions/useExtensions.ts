import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Extension, CreateExtensionPayload, UpdateExtensionPayload } from "@/types/extensions.types";

export const useServiceExtensions = (serviceId: string) => {
  return useQuery({
    queryKey: [...queryKeys.extensions.lists(), { serviceId }],
    queryFn: async () => {
      const response = await httpClient.get<Extension[]>("/services/extensions", { params: { serviceId }, headers: {} });
      return response;
    },
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExtensionPayload) => {
      const response = await httpClient.post<Extension>("/extensions", payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.extensions.lists() });
    },
  });
};

export const useUpdateExtension = (extensionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateExtensionPayload) => {
      const response = await httpClient.patch<Extension>(`/extensions/${extensionId}`, payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.extensions.lists() });
    },
  });
};

export const useDeactivateExtension = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (extensionId: string) => {
      const response = await httpClient.del<void>(`/extensions/${extensionId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.extensions.lists() });
    },
  });
};
