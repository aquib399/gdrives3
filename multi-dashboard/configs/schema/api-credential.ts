import { SchemaConfig } from "@/types/filter-config";
import { IApiKey } from "@/types/domain/api-crendential";

export const config: SchemaConfig<IApiKey> = {
  search: ["name", "key"],
  allowedSorts: ["createdAt", "updatedAt"],
  defaultSort: { field: "createdAt", order: "desc" },
  requiredFilters: {},
  allowedFilters: {},
  allowedPopulate: {}
};
