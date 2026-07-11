import type * as tenantTypes from "@/types/domain/tenant";
import { VerifyTokenResponse } from "@/types/domain/token";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiFunctionProps } from "@/types/api";
import { request } from ".";

type ContactChangePayload = { field: "email" | "phone"; value: string };
type ConfirmContactChangePayload = ContactChangePayload & { otp: number };

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
  }
};
