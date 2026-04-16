import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { queryKeys } from "@/hooks/api/queryKeys";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse, PaginatedMeta } from "@/types/api.types";
import type {
  OrderMessage,
  OrderMessagesQueryParams,
  OrderRecord,
  OrdersQueryParams,
  SendOrderMessagePayload,
  StartOrCompletePhasePayload,
  SubmitDeliverablePayload,
  UpdateOrderLimitedPayload,
} from "@/types/orders.types";

const normalizeOrders = (payload: unknown): OrderRecord[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as OrderRecord[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as { data?: unknown; orders?: unknown; items?: unknown };

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as OrderRecord[];
    }

    if (Array.isArray(objectPayload.orders)) {
      return objectPayload.orders as OrderRecord[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as OrderRecord[];
    }
  }

  return [];
};

const normalizeMessages = (payload: unknown): OrderMessage[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as OrderMessage[];
  }

  if (typeof payload === "object") {
    const objectPayload = payload as { data?: unknown; messages?: unknown; items?: unknown };

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as OrderMessage[];
    }

    if (Array.isArray(objectPayload.messages)) {
      return objectPayload.messages as OrderMessage[];
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as OrderMessage[];
    }
  }

  return [];
};

export const useSellerOrders = (filters: OrdersQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list({ ...filters, scope: "seller" }),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.SELLER_ORDER.GET_OFFERS, {
        params: filters,
      });

      return {
        ...response,
        data: normalizeOrders(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<OrderRecord[]>;
    },
    placeholderData: (previous) => previous,
    staleTime: 1000 * 30,
  });
};

export const useSellerOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: async () => {
      return httpClient.get<OrderRecord>(ENDPOINT.SELLER_ORDER.GET_OFFER_DETAIL(orderId));
    },
    enabled: Boolean(orderId),
    staleTime: 1000 * 30,
  });
};

export const useUpdateSellerOrderLimited = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateOrderLimitedPayload) => {
      return httpClient.patch(
        ENDPOINT.SELLER_ORDER.UPDATE_OFFER_LIMITED(orderId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
};

export const useStartSellerPhase = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StartOrCompletePhasePayload) => {
      return httpClient.patch(
        ENDPOINT.SELLER_ORDER.PHASE_START_OFFER(orderId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
};

export const useCompleteSellerPhase = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StartOrCompletePhasePayload) => {
      return httpClient.patch(
        ENDPOINT.SELLER_ORDER.PHASE_COMPLETE(orderId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
};

export const useSubmitSellerDeliverable = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitDeliverablePayload) => {
      return httpClient.post(
        ENDPOINT.SELLER_ORDER.DELIVERABLES_OFFER(orderId),
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
};

export const useOrderCommunications = (
  orderId: string,
  filters: OrderMessagesQueryParams = {},
) => {
  return useQuery({
    queryKey: queryKeys.orders.messageList(orderId, filters),
    queryFn: async () => {
      const response = await httpClient.get<unknown>(ENDPOINT.SELLER_ORDER.GET_MESSAGES(orderId), {
        params: filters,
      });

      return {
        ...response,
        data: normalizeMessages(response.data),
        meta: response.meta as PaginatedMeta | undefined,
      } as ApiResponse<OrderMessage[]>;
    },
    enabled: Boolean(orderId),
    placeholderData: (previous) => previous,
    staleTime: 1000 * 15,
  });
};

export const useSendOrderCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendOrderMessagePayload) => {
      return httpClient.post(
        ENDPOINT.SELLER_ORDER.SEND_MESSAGE,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.messageList(payload.orderId, {}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(payload.orderId) });
    },
  });
};

export const useMarkOrderCommunicationRead = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      return httpClient.patch(ENDPOINT.SELLER_ORDER.MARK_MESSAGE_READ(messageId), {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.messageList(orderId, {}) });
    },
  });
};
