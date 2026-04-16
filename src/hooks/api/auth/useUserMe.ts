import { useMutation, useQueryClient } from "@tanstack/react-query";

import ENDPOINT from "@/apiEndpoint/endpoint";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { UpdateUserMePayload } from "@/types/jobs.types";
import { useUserActions } from "@/store/useUserStore";

export const useUpdateUserMe = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserActions();

  return useMutation({
    mutationFn: async (payload: UpdateUserMePayload) => {
      return httpClient.patch(
        ENDPOINT.USER.UPDATE_ME,
        payload as unknown as Record<string, unknown>,
      );
    },
    onSuccess: (response) => {
      if (response.data && typeof response.data === "object") {
        setUser(response.data as any);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};
