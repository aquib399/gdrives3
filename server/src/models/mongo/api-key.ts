import mongoose, { Schema, Document } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export interface IApiKey extends BaseEntity {
  tenantId: mongoose.Types.ObjectId;
  gDriveId: mongoose.Types.ObjectId;
  key: string;
  secret: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export type IApiKeyDocument = IApiKey & Document;

const ApiKeySchema = new Schema<IApiKey>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: Models.Tenant.ref,
      required: true
    },
    gDriveId: {
      type: Schema.Types.ObjectId,
      ref: Models.GDrive.ref,
      required: true
    },
    key: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
    name: { type: String, default: "Default Key" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IApiKey>(Models.ApiKey.ref, ApiKeySchema);
