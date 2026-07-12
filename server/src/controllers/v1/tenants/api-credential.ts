import * as service from "@/services/v1/tenants/api-credential.js";
import type * as validation from "@/validations/v1/tenant/api-credential.js";
import { config } from "@/configs/schema/api-credential.js";
import { prepareListOptions } from "@/utils/query/list-option.js";
import { validateQuery } from "@/utils/query/validate.js";
import { createErrorResponse } from "@/utils/response.js";

export const listApiCredentials: routerFunction = async (req, res) => {
  const query = { ...req.query };
  const errors = validateQuery({ config, query });

  if (Object.keys(errors).length > 0) {
    const resp = createErrorResponse("Invalid query parameters", errors);
    return res.status(422).json(resp);
  }

  const listOptions = prepareListOptions({ config, query });
  const { response, status } = await service.listApiCredentials({
    listOptions,
    config
  });
  return res.status(status).json(response);
};

export const getApiCredential: routerFunction = async (req, res) => {
  const { id } = req.params;
  const { response, status } = await service.getApiCredential({ id });
  return res.status(status).json(response);
};

export const createApiCredential: routerFunction<
  validation.CreateApiCredentialPayload
> = async (req, res) => {
  const tenantId = String(res.locals.id);
  const { response, status } = await service.createApiCredential({
    tenantId,
    data: req.body
  });
  return res.status(status).json(response);
};

export const updateApiCredential: routerFunction<
  validation.UpdateApiCredentialPayload
> = async (req, res) => {
  const { id } = req.params;
  const { response, status } = await service.updateApiCredential({
    id,
    data: req.body
  });
  return res.status(status).json(response);
};

export const deleteApiCredential: routerFunction = async (req, res) => {
  const { id } = req.params;
  const { response, status } = await service.deleteApiCredential({ id });
  return res.status(status).json(response);
};
