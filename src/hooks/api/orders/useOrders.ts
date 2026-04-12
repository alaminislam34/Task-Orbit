import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { OrdersQueryParams, CreateOfferPayload, AcceptOfferPayload } from "@/types/orders.types";

export const useOrders = (filters: OrdersQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<any[]>("/orders", { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOfferPayload) => {
      const response = await httpClient.post<any>("/orders/create-offer", payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
};

export const useAcceptOffer = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AcceptOfferPayload) => {
      const response = await httpClient.post<any>(`/orders/${orderId}/accept`, payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
};

export const useRejectOffer = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await httpClient.post<any>(`/orders/${orderId}/reject`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
};
