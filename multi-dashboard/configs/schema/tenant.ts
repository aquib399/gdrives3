import { SchemaConfig } from "@/types/filter-config";
import { ITenant } from "@/types/domain/tenant";

export const config: SchemaConfig<ITenant> = {
  search: ["name", "email", "phone"],
  allowedSorts: ["createdAt", "updatedAt"],
  defaultSort: { field: "createdAt", order: "desc" },
  requiredFilters: {},
  allowedFilters: {},
  allowedPopulate: {}
};
