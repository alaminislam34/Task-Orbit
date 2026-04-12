import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { CreateReviewPayload } from "@/types/reviews.types";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const response = await httpClient.post<any>("/reviews", payload as unknown as Record<string, unknown>);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
  });
};
