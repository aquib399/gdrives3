import { TENANT_ENDPOINTS } from "./tenant";
import { SYSTEM_ENDPOINTS } from "./system";
import { ADMIN_ENDPOINTS } from "./admin";

export const API_ENDPOINTS = {
  tenant: TENANT_ENDPOINTS(),
  admin: ADMIN_ENDPOINTS(),
  system: SYSTEM_ENDPOINTS()
};
