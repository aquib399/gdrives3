import { Types, Schema, HydratedDocument, model } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export interface IApiKey extends BaseEntity {
  tenantId: Types.ObjectId;
  key: string;
  secret: string;
  name: string;
  folderName: string;
  isActive: boolean;
}

export type IApiKeyDocument = HydratedDocument<IApiKey>;

const ApiKeySchema = new Schema<IApiKey>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: Models.Tenant.ref,
      required: true
    },
    key: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
    name: { type: String, default: "Default Key" },
    folderName: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ApiKey = model<IApiKey>(Models.ApiKey.ref, ApiKeySchema);
