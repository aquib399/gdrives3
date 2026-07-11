import * as service from "@/services/v1/tenants/index.js";
import type { UpdateProfilePayload } from "@/validations/v1/tenant/index.js";

export const getProfile: routerFunction = async (req, res) => {
  const id = String(res.locals.id);
  const { response, status } = await service.getProfile({ id });
  return res.status(status).json(response);
};

export const updateProfile: routerFunction<UpdateProfilePayload> = async (
  req,
  res
) => {
  const id = String(res.locals.id);
  const { response, status } = await service.updateProfile({
    id,
    data: req.body
  });
  return res.status(status).json(response);
};
