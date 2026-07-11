"use client";

import type { UpdateProfilePayload } from "@/types/domain/admin";
import { HookProps } from "@/types/api";
import { AdminAPI } from "@/api/admin";
import {
  getNextPageParam,
  buildApiFunctionProps,
  mergeInfinitePaginatedResponse
} from ".";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from "@tanstack/react-query";

export const useAdminVerifyToken = () => {
  return useQuery({
    queryKey: ["admin", "verifyToken"],
    queryFn: async () => {
      const res = await AdminAPI.admin.verifyToken({
        forceReturn: false,
        toastConfig: { error: { enabled: true } }
      });
      if (res.data.error) {
        throw new Error(res.data.message || "Unauthorized");
      }
      return res.data.data;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false
  });
};

export const useAdminProfile = (
  props: HookProps<typeof AdminAPI.admin.getProfile>
) => {
  return useQuery({
    queryKey: ["admin", "profile", props?.queryParams],
    queryFn: async () =>
      AdminAPI.admin
        .getProfile({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data)
  });
};
export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      AdminAPI.admin
        .updateProfile({
          payload: payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "profile"] });
    }
  });
};

export const useTenantList = (
  props: HookProps<typeof AdminAPI.tenant.list>
) => {
  return useInfiniteQuery({
    queryKey: ["admin", "tenant", "list", props?.queryParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      AdminAPI.tenant
        .list({
          ...buildApiFunctionProps({ props, pageParam }),
          forceReturn: false
        })
        .then((res) => res.data),

    getNextPageParam: getNextPageParam,
    select: mergeInfinitePaginatedResponse
  });
};

export const useTenant = (props: HookProps<typeof AdminAPI.tenant.get>) => {
  const { id } = props?.payload || {};
  return useQuery({
    queryKey: ["admin", "tenant", "single", id],
    queryFn: async () =>
      AdminAPI.tenant
        .get({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data),
    enabled: !!id
  });
};
