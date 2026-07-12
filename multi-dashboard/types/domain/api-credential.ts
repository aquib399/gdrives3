import { BaseEntity } from "@/types/base-entity";
import { PaginatedResponse } from "@/types/pagination";

export interface IApiKey extends BaseEntity {
  tenantId: string;
  key: string;
  secret: string;
  name: string;
  isActive: boolean;
}

export interface CreateApiCredentialPayload {
  name: string;
}

export interface UpdateApiCredentialPayload {
  id: string;
  name?: string;
  isActive?: boolean;
}

export interface GetApiCredentialResponse {
  apiKey: IApiKey;
}

export interface CreateApiCredentialResponse {
  apiKey: IApiKey;
}

export interface UpdateApiCredentialResponse {
  apiKey: IApiKey;
}

export interface DeleteApiCredentialResponse {
  apiKeyId: string;
}

export type ListApiCredentialsResponse = PaginatedResponse<IApiKey>;
