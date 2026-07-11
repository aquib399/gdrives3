import { model, Types, Document, Schema } from "mongoose";
import { BaseEntity } from "./base.js";

export interface ITenant extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
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
    },
    phone: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Tenant = model<ITenantDocument>("Tenant", TenantSchema);
