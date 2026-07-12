import { model, Types, Document, Schema } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export interface ITenant extends BaseEntity {
  name: string;
  email: string;
}
export type ITenantDocument = ITenant & Document;

const TenantSchema: Schema<ITenantDocument> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Tenant = model<ITenantDocument>(Models.Tenant.ref, TenantSchema);
