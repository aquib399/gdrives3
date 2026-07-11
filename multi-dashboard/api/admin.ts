import { VerifyTokenResponse } from "@/types/domain/token";
import type * as adminTypes from "@/types/domain/admin";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiFunctionProps } from "@/types/api";
import { request } from ".";

const endpoints = API_ENDPOINTS.admin;

export const AdminAPI = {
  admin: {
    verifyToken: (props?: ApiFunctionProps) =>
      request<VerifyTokenResponse>({
        method: "POST",
        endpoint: endpoints.admin.verifyToken,
        ...props
      }),
    getProfile: (props?: ApiFunctionProps) =>
      request<adminTypes.GetProfileResponse>({
        method: "GET",
        endpoint: endpoints.admin.getProfile,
        ...props
      }),
    updateProfile: (props: ApiFunctionProps<adminTypes.UpdateProfilePayload>) =>
      request<adminTypes.UpdateProfileResponse>({
        method: "PUT",
        endpoint: endpoints.admin.updateProfile,
        ...props
      }),
    signIn: (props: ApiFunctionProps<adminTypes.SignInPayload>) =>
      request<adminTypes.SignInResponse>({
        method: "POST",
        endpoint: endpoints.admin.signIn,
        ...props
      }),
    signUp: (props: ApiFunctionProps<adminTypes.SignUpPayload>) =>
      request<adminTypes.SignUpResponse>({
        method: "POST",
        endpoint: endpoints.admin.signUp,
        ...props
      }),
    signOut: (props: ApiFunctionProps<adminTypes.SignOutPayload>) =>
      request<adminTypes.SignOutResponse>({
        method: "POST",
        endpoint: endpoints.admin.signOut,
        ...props
      })
  },

  tenant: {
    list: (props?: ApiFunctionProps) =>
      request<adminTypes.ListTenantResponse>({
        method: "GET",
        endpoint: endpoints.tenant.list,
        ...props
      }),
    get: (props: ApiFunctionProps<{ id: string }>) =>
      request<adminTypes.GetTenantResponse>({
        method: "GET",
        endpoint: endpoints.tenant.get(props.payload.id),
        ...props
      })
  }
};
