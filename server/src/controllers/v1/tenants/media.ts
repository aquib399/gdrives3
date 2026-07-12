import type * as validation from "@/validations/v1/tenant/media.js";
import * as service from "@/services/v1/tenants/media.js";

export const initUpload: routerFunction<validation.InitUploadPayload> = async (
  req,
  res
) => {
  const payload = req.body;
  const tenantId = String(res.locals.id);
  const { response, status } = await service.initUpload({ payload, tenantId });
  return res.status(status).json(response);
};

export const completeUpload: routerFunction<
  validation.CompleteUploadPayload
> = async (req, res) => {
  const payload = req.body;
  const tenantId = String(res.locals.id);
  const { response, status } = await service.completeUpload({
    payload,
    tenantId
  });
  return res.status(status).json(response);
};
