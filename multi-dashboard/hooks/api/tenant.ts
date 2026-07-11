"use client";

import type { UpdateProfilePayload } from "@/types/domain/tenant";
import { buildApiFunctionProps } from ".";
import { TenantAPI } from "@/api/tenant";
import { HookProps } from "@/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTenantVerifyToken = () => {
  return useQuery({
    queryKey: ["tenant", "verifyToken"],
    queryFn: async () => {
      const res = await TenantAPI.tenant.verifyToken({
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

export const useTenantProfile = (props: HookProps) => {
  return useQuery({
    queryKey: ["tenant", "profile", props?.queryParams],
    queryFn: async () =>
      TenantAPI.tenant
        .getProfile({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data)
  });
};

export const useUpdateTenantProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      TenantAPI.tenant
        .updateProfile({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "profile"] });
    }
  });
};

export const useSendTenantSignupOtp = () => {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      TenantAPI.tenant
        .signUpSendOtp({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data)
  });
};
