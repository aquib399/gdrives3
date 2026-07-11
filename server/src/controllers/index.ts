// controllers/index.ts

import * as tenantService from "@/services/v1/tenants/auth.js";
import * as adminService from "@/services/v1/admins/auth.js";
import { Admin, Tenant } from "@/models/index.js";
import { Role } from "@/types/role.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";

export const healthCheck: routerFunction = async (_, res) => {
  const resp = createSuccessResponse("OK", null);
  return res.status(200).json(resp);
};

export const verifyToken: routerFunction = async (req, res) => {
  const id = res.locals.id;
  const role = res.locals.role;
  const exp = res.locals.exp;

  if (!role || !id) {
    const resp = createErrorResponse("Invalid token", null);
    return res.status(401).json(resp);
  }

  let data: AttachedLocals = { id, role, exp };
  let resp: ResponseData<AttachedLocals> = createSuccessResponse(
    "Token is valid",
    data
  );

  switch (role) {
    case Role.Admin: {
      const item = await Admin.exists({ _id: id });
      if (!item) {
        await adminService.signOut({ req, res });
        resp = createErrorResponse("Admin not found", null);
      }
      break;
    }
    case Role.Tenant: {
      const item = await Tenant.exists({ _id: id });
      if (!item) {
        await tenantService.signOut({ req, res });
        resp = createErrorResponse("Tenant not found", null);
      }
      break;
    }
    default: {
      resp = createErrorResponse(`Invalid role: ${role}`, null);
      break;
    }
  }

  return res.status(resp.error ? 400 : 200).json(resp);
};
