import { prepareListOptions } from "@/utils/query/list-option.js";
import { validateQuery } from "@/utils/query/validate.js";
import { createErrorResponse } from "@/utils/response.js";
import * as service from "@/services/v1/admins/tenant.js";
import { config } from "@/configs/schema/tenant.js";

export const getTenant: routerFunction = async (req, res) => {
  const { id } = req.params;
  const { response, status } = await service.getTenant({ id });
  return res.status(status).json(response);
};

export const listTenants: routerFunction = async (req, res) => {
  const base: Record<string, any> = {
    // hard coded search query
  };
  const query = { ...base, ...req.query };
  const errors = validateQuery({ config: config, query });

  if (Object.keys(errors).length > 0) {
    const resp = createErrorResponse("Invalid query parameters", errors);
    return res.status(422).json(resp);
  }

  const listOptions = prepareListOptions({ config: config, query });
  const { response, status } = await service.listTenants({
    listOptions,
    config: config
  });

  return res.status(status).json(response);
};
