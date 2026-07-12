import { SchemaConfig } from "@/types/filter-config.js";
import { IApiKey } from "@/models/mongo/api-key.js";

export const config: SchemaConfig<IApiKey> = {
  search: ["name", "key"],
  allowedSorts: ["createdAt", "updatedAt"],
  defaultSort: { field: "createdAt", order: "desc" },
  requiredFilters: {},
  allowedFilters: {},
  allowedPopulate: {}
};
