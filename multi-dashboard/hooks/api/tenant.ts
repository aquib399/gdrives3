"use client";

import type { UpdateProfilePayload } from "@/types/domain/tenant";
import {
  buildApiFunctionProps,
  getNextPageParam,
  mergeInfinitePaginatedResponse
} from ".";
import { TenantAPI } from "@/api/tenant";
import { HookProps } from "@/types/api";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from "@tanstack/react-query";

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

export const useGoogleAuthUrl = (props: HookProps) => {
  return useQuery({
    queryKey: ["google", "authUrl", props?.queryParams],
    queryFn: async () =>
      TenantAPI.google
        .getAuthUrl({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data),
    enabled: false
  });
};

export const useApiCredentialList = (
  props: HookProps<typeof TenantAPI.apiCredential.list>
) => {
  return useInfiniteQuery({
    queryKey: ["tenant", "list", "apiCredentials", props?.queryParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      TenantAPI.apiCredential
        .list({
          ...buildApiFunctionProps({ props, pageParam }),
          forceReturn: false
        })
        .then((res) => res.data),

    getNextPageParam: getNextPageParam,
    select: mergeInfinitePaginatedResponse
  });
};

export const useApiCredential = (
  props: HookProps<typeof TenantAPI.apiCredential.get>
) => {
  const id = props?.payload?.id;

  return useQuery({
    queryKey: ["tenant", "apiCredential", id],
    queryFn: async () =>
      TenantAPI.apiCredential
        .get({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data),
    enabled: !!id
  });
};

export const useCreateApiCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; folderName: string }) =>
      TenantAPI.apiCredential
        .create({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant", "list", "apiCredentials"]
      });
    }
  });
};

export const useUpdateApiCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; name?: string; isActive?: boolean }) =>
      TenantAPI.apiCredential
        .update({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant", "list", "apiCredentials"]
      });
      queryClient.invalidateQueries({
        queryKey: ["tenant", "apiCredential", payload.id]
      });
    }
  });
};

export const useDeleteApiCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string }) =>
      TenantAPI.apiCredential
        .delete({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant", "list", "apiCredentials"]
      });
      queryClient.invalidateQueries({
        queryKey: ["tenant", "apiCredential", payload.id]
      });
    }
  });
};

export const useMediaList = (props: HookProps<typeof TenantAPI.media.list>) => {
  return useInfiniteQuery({
    queryKey: ["tenant", "list", "media", props?.queryParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      TenantAPI.media
        .list({
          ...buildApiFunctionProps({ props, pageParam }),
          forceReturn: false
        })
        .then((res) => res.data),

    getNextPageParam: getNextPageParam,
    select: mergeInfinitePaginatedResponse
  });
};

export const useMedia = (props: HookProps<typeof TenantAPI.media.get>) => {
  const id = props?.payload?.id;
  return useQuery({
    queryKey: ["tenant", "media", id],
    queryFn: async () =>
      TenantAPI.media
        .get({ ...buildApiFunctionProps({ props }), forceReturn: false })
        .then((res) => res.data),
    enabled: !!id
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; fileName?: string }) =>
      TenantAPI.media
        .update({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "list", "media"] });
      queryClient.invalidateQueries({
        queryKey: ["tenant", "media", payload.id]
      });
    }
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string }) =>
      TenantAPI.media
        .delete({
          payload,
          forceReturn: true,
          toastConfig: { success: { enabled: true }, error: { enabled: true } }
        })
        .then((res) => res.data),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "list", "media"] });
      queryClient.invalidateQueries({
        queryKey: ["tenant", "media", payload.id]
      });
    }
  });
};
