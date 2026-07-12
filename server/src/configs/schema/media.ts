import { SchemaConfig } from "@/types/filter-config.js";
import { IMedia } from "@/models/index.js";

export const config: SchemaConfig<IMedia> = {
  search: ["fileName", "mimeType"],
  allowedSorts: ["createdAt", "updatedAt", "fileName", "sizeInBytes"],
  defaultSort: { field: "createdAt", order: "desc" },
  requiredFilters: {},
  allowedFilters: {
    mimeType: { operators: ["equals", "in", "nin"], dataType: "string" },
    uploadingStatus: {
      operators: ["equals", "in", "nin"],
      dataType: "string"
    }
  },
  allowedPopulate: {}
};
