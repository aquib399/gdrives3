import mongoose, { Document, Schema, Types } from "mongoose";

export enum OtpType {
  ADMIN_SIGNUP = "admin_signup",
  ADMIN_FORGET = "admin_forget",

  TENANT_SIGNUP = "tenant_signup",
  TENANT_FORGET = "tenant_forget",
  TENANT_EMAIL_CHANGE = "tenant_email_change",
  TENANT_PHONE_CHANGE = "tenant_phone_change",

  // STAFF_SIGNUP = "staff_signup", // cannot be used
  STAFF_FORGET = "staff_forget",
  STAFF_EMAIL_CHANGE = "staff_email_change",
  STAFF_PHONE_CHANGE = "staff_phone_change",

  USER_SIGNUP = "user_signup",
  USER_FORGET = "user_forget",
  USER_EMAIL_CHANGE = "user_email_change",
  USER_PHONE_CHANGE = "user_phone_change"
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

const Otp = mongoose.model<IOTP>("OTP", OTPSchema);

export { Otp };
