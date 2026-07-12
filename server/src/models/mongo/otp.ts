import mongoose, { Document, Schema, Types } from "mongoose";
import { Models } from "../names.js";

export enum OtpType {
  ADMIN_SIGNUP = "admin_signup",
  ADMIN_FORGET = "admin_forget",

  TENANT_SIGNUP = "tenant_signup",
  TENANT_FORGET = "tenant_forget"
}

export interface IOTP extends Document {
  targetId: Types.ObjectId;
  otp: string;
  expiresAt: number;
  type: OtpType;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema: Schema<IOTP> = new Schema(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(OtpType),
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model<IOTP>(Models.Otp.ref, OTPSchema);

export { Otp };
