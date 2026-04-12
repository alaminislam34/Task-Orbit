import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios/httpClient";
import { queryKeys } from "../queryKeys";
import { Category, CategoriesQueryParams } from "@/types/categories.types";

export const useCategories = (filters: CategoriesQueryParams = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: async () => {
      const response = await httpClient.get<Category[]>("/admin/service-categories", { params: filters, headers: {} });
      return response;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useCategory = (idOrSlug: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(idOrSlug),
    queryFn: async () => {
      const response = await httpClient.get<Category>(`/admin/service-categories/${idOrSlug}`);
      return response;
    },
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
