import { BaseEntity } from "@/types/base-entity";

export interface IApiKey extends BaseEntity {
  tenantId: string;
  gDriveId: string;
  key: string;
  secret: string;
  name: string;
  isActive: boolean;
}
