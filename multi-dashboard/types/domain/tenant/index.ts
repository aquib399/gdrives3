export type {
  SignInPayload,
  SignUpPayload
} from "@/validations/v1/tenant/auth";
import { BaseEntity } from "@/types/base-entity";

export interface ITenant extends BaseEntity {
  name: string;
  email: string;
}

export interface GetProfileResponse {
  tenant: ITenant;
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
