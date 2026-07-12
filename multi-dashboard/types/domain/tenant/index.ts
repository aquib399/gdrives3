export type {
  SignInPayload,
  SignUpPayload
} from "@/validations/v1/tenant/auth";
import { BaseEntity } from "@/types/base-entity";

export type {
  CreateApiCredentialPayload,
  CreateApiCredentialResponse,
  DeleteApiCredentialResponse,
  GetApiCredentialResponse,
  IApiKey,
  ListApiCredentialsResponse,
  UpdateApiCredentialPayload,
  UpdateApiCredentialResponse
} from "../api-credential";

export interface ITenant extends BaseEntity {
  name: string;
  email: string;
}

export interface GetProfileResponse {
  tenant: ITenant;
  driveConnected: boolean;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export type SignUpResponse = GetProfileResponse;

export type SignOutPayload = {};
export type SignOutResponse = {};

export interface UpdateProfilePayload {
  name?: string;
}
export type UpdateProfileResponse = GetProfileResponse;

export interface GetAuthUrlResponse {
  url: string;
}
