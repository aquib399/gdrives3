import type * as validation from "@/validations/v1/tenant/media.js";
import { prepareListOptions } from "@/utils/query/list-option.js";
import * as service from "@/services/v1/tenants/media.js";
import { validateQuery } from "@/utils/query/validate.js";
import { createErrorResponse } from "@/utils/response.js";
import { config } from "@/configs/schema/media.js";

export const listMedia: routerFunction = async (req, res) => {
  const tenantId = String(res.locals.id);
  const query = { ...req.query };
  const errors = validateQuery({ config, query });

  if (Object.keys(errors).length > 0) {
    const resp = createErrorResponse("Invalid query parameters", errors);
    return res.status(422).json(resp);
  }

  const listOptions = prepareListOptions({ config, query });
  const { response, status } = await service.listMedia({
    tenantId,
    listOptions,
    config
  });
  return res.status(status).json(response);
};

export const getMedia: routerFunction = async (req, res) => {
  const tenantId = String(res.locals.id);
  const { id } = req.params;
  const { response, status } = await service.getMedia({ id, tenantId });
  return res.status(status).json(response);
};

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

export const updateMedia: routerFunction<
  validation.UpdateMediaPayload
> = async (req, res) => {
  const tenantId = String(res.locals.id);
  const { id } = req.params;
  const { response, status } = await service.updateMedia({
    id,
    tenantId,
    data: req.body
  });
  return res.status(status).json(response);
};

export const deleteMedia: routerFunction = async (req, res) => {
  const tenantId = String(res.locals.id);
  const { id } = req.params;
  const { response, status } = await service.deleteMedia({ id, tenantId });
  return res.status(status).json(response);
};
