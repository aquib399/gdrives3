export type { SignInPayload, SignUpPayload } from "@/validations/v1/admin/auth";
import { PaginatedResponse } from "@/types/pagination";
import { BaseEntity } from "@/types/base-entity";
import { ITenant } from "../tenant";

export interface IAdmin extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
}

export interface GetProfileResponse {
  admin: IAdmin;
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
  phone?: string;
}
export type UpdateProfileResponse = GetProfileResponse;

export type ListTenantResponse = PaginatedResponse<ITenant>;

export interface GetTenantResponse {
  tenant: ITenant;
}
