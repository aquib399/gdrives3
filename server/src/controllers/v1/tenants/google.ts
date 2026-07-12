import type * as validation from "@/validations/v1/tenant/google.js";
import * as service from "@/services/v1/tenants/google.js";

export const getAuthUrl: routerFunction = async (req, res) => {
  const tenantId = String(res.locals.id);
  const { response, status } = await service.getAuthUrl({ tenantId });
  return res.status(status).json(response);
};

export const handleCallback: routerFunction<
  any,
  any,
  validation.HandleCallbackPayload
> = async (req, res) => {
  const query = req.query;
  const { response } = await service.handleCallback(query);

  const redirectUrl = response.data.redirectUrl;

  return res.redirect(redirectUrl) as any;
};
