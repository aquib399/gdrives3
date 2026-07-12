import type * as mediaTypes from "@/types/domain/system/media";
import { VerifyTokenResponse } from "@/types/domain/token";
import type * as tenantTypes from "@/types/domain/tenant";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiFunctionProps } from "@/types/api";
import { request } from ".";

const endpoints = API_ENDPOINTS.tenant;

export const TenantAPI = {
  tenant: {
    verifyToken: (props: ApiFunctionProps) =>
      request<VerifyTokenResponse>({
        method: "POST",
        endpoint: endpoints.tenant.verifyToken,
        ...props
      }),
    getProfile: (props: ApiFunctionProps) =>
      request<tenantTypes.GetProfileResponse>({
        method: "GET",
        endpoint: endpoints.tenant.getProfile,
        ...props
      }),
    updateProfile: (
      props: ApiFunctionProps<tenantTypes.UpdateProfilePayload>
    ) =>
      request<tenantTypes.UpdateProfileResponse>({
        method: "PUT",
        endpoint: endpoints.tenant.updateProfile,
        ...props
      }),
    signIn: (props: ApiFunctionProps<tenantTypes.SignInPayload>) =>
      request<tenantTypes.SignInResponse>({
        method: "POST",
        endpoint: endpoints.tenant.signIn,
        ...props
      }),
    signUpSendOtp: (props: ApiFunctionProps<{ email: string }>) =>
      request<{ otpRequestId: string }>({
        method: "POST",
        endpoint: endpoints.tenant.signUpSendOtp,
        ...props
      }),
    signUp: (props: ApiFunctionProps<tenantTypes.SignUpPayload>) =>
      request<tenantTypes.SignUpResponse>({
        method: "POST",
        endpoint: endpoints.tenant.signUp,
        ...props
      }),
    signOut: (props: ApiFunctionProps<tenantTypes.SignOutPayload>) =>
      request<tenantTypes.SignOutResponse>({
        method: "POST",
        endpoint: endpoints.tenant.signOut,
        ...props
      })
  },
  google: {
    getAuthUrl: (props: ApiFunctionProps) =>
      request<tenantTypes.GetAuthUrlResponse>({
        method: "GET",
        endpoint: endpoints.google.getAuthUrl,
        ...props
      })
  },
  apiCredential: {
    list: (props: ApiFunctionProps) =>
      request<tenantTypes.ListApiCredentialsResponse>({
        method: "GET",
        endpoint: endpoints.apiCredential.list,
        ...props
      }),
    get: (props: ApiFunctionProps<{ id: string }>) =>
      request<tenantTypes.GetApiCredentialResponse>({
        method: "GET",
        endpoint: endpoints.apiCredential.get(props.payload.id),
        ...props
      }),
    create: (props: ApiFunctionProps<tenantTypes.CreateApiCredentialPayload>) =>
      request<tenantTypes.CreateApiCredentialResponse>({
        method: "POST",
        endpoint: endpoints.apiCredential.create,
        ...props
      }),
    update: (props: ApiFunctionProps<tenantTypes.UpdateApiCredentialPayload>) =>
      request<tenantTypes.UpdateApiCredentialResponse>({
        method: "PUT",
        endpoint: endpoints.apiCredential.get(props.payload.id),
        ...props
      }),
    delete: (props: ApiFunctionProps<{ id: string }>) =>
      request<tenantTypes.DeleteApiCredentialResponse>({
        method: "DELETE",
        endpoint: endpoints.apiCredential.get(props.payload.id),
        ...props
      })
  },
  media: {
    list: (props: ApiFunctionProps) =>
      request<mediaTypes.ListMediaResponse>({
        method: "GET",
        endpoint: endpoints.media.list,
        ...props
      }),
    get: (props: ApiFunctionProps<{ id: string }>) =>
      request<mediaTypes.GetMediaResponse>({
        method: "GET",
        endpoint: endpoints.media.get(props.payload.id),
        ...props
      }),
    update: (props: ApiFunctionProps<mediaTypes.UpdateMediaPayload>) =>
      request<mediaTypes.UpdateMediaResponse>({
        method: "PUT",
        endpoint: endpoints.media.update(props.payload.id),
        ...props
      }),
    delete: (props: ApiFunctionProps<{ id: string }>) =>
      request<mediaTypes.DeleteMediaResponse>({
        method: "DELETE",
        endpoint: endpoints.media.delete(props.payload.id),
        ...props
      }),
    initUpload: async (props: ApiFunctionProps<mediaTypes.InitUploadPayload>) =>
      request<mediaTypes.InitUploadResponse>({
        method: "POST",
        endpoint: endpoints.media.initUpload,
        ...props
      }),
    completeUpload: async (
      props: ApiFunctionProps<mediaTypes.CompleteUploadPayload>
    ) =>
      request<mediaTypes.CompleteUploadResponse>({
        method: "POST",
        endpoint: endpoints.media.completeUpload,
        ...props
      })
  }
};
