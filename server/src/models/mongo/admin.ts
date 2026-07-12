import { model, Types, Document, Schema } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export interface IAdmin extends BaseEntity {
  name: string;
  email: string;
}
export type IAdminDocument = IAdmin & Document;

const AdminSchema: Schema<IAdminDocument> = new Schema(
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

export const Admin = model<IAdminDocument>(Models.Admin.ref, AdminSchema);
