import { TENANT_ENDPOINTS } from "./tenant";
import { ADMIN_ENDPOINTS } from "./admin";

export const API_ENDPOINTS = {
  tenant: TENANT_ENDPOINTS(),
  admin: ADMIN_ENDPOINTS()
};
