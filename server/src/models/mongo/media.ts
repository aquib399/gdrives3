import { model, Types, Document, Schema, HydratedDocument } from "mongoose";
import { BaseEntity } from "./base.js";
import { Models } from "../names.js";

export enum MediaUploadingStatus {
  FAILED = "FAILED",
  UPLOADING = "UPLOADING",
  COMPLETED = "COMPLETED"
}

export interface IMedia extends BaseEntity {
  fileName: string;
  fullUrl: string;
  mimeType: string;
  sizeInBytes: number;
  uploadingStatus: MediaUploadingStatus;
}

export type IMediaDocument = HydratedDocument<IMedia>;

const MediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    fullUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeInBytes: { type: Number, required: true },
    uploadingStatus: {
      type: String,
      required: true,
      enum: Object.values(MediaUploadingStatus),
      default: MediaUploadingStatus.UPLOADING
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Media = model<IMedia>(Models.Media.ref, MediaSchema);
