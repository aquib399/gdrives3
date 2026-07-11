import { TokenTarget } from "@/models/index.js";
import { TokenService } from "./factory.js";
import { Role } from "@/types/role.js";

export const adminTokens = new TokenService({
  role: Role.Admin,
  target: TokenTarget.Admin
});

export const tenantTokens = new TokenService({
  role: Role.Tenant,
  target: TokenTarget.Tenant
});
