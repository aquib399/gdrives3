import { createProjectStage } from "@/utils/mongo/pipeline.js";
import { SchemaConfig } from "@/types/filter-config.js";
import { emailRegex, phoneRegex } from "../index.js";
import { ITenant } from "@/models/mongo/tenant.js";
import { Models } from "@/models/index.js";

export const config: SchemaConfig<ITenant> = {
  search: ["name", "email", "phone"],
  allowedSorts: ["createdAt", "updatedAt"],
  defaultSort: { field: "createdAt", order: "desc" },
  requiredFilters: {},
  allowedFilters: {},
  allowedPopulate: {}
};
