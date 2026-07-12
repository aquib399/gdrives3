import { Schema, Types, HydratedDocument, model } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export interface IGDrive extends BaseEntity {
  tenantId: Types.ObjectId;
  accessToken: string;
  refreshToken?: string;
  expiry: number;
}

export type IGDriveDocument = HydratedDocument<IGDrive>;

const GDriveSchema = new Schema<IGDrive>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: Models.Tenant.ref,
    required: true,
    unique: true
  },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiry: { type: Number, required: true }
});

export const GDrive = model<IGDrive>("GDrive", GDriveSchema);
