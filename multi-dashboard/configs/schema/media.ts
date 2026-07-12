import { SchemaConfig } from "@/types/filter-config";
import { IMedia } from "@/types/domain/system/media";

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
