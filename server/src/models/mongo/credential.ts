import { model, Types, Schema, HydratedDocument } from "mongoose";
import { BaseEntity } from "./base.js";
import { Role } from "@/types/role.js";
import { Models } from "../names.js";

export enum MFAType {
  None = "none",
  Authenticator = "authenticator",
  Sms = "sms",
  Email = "email"
}

export interface ICredential extends BaseEntity {
  passwordHash: string;
  mfaEnabled: boolean;
  target: Role;
  targetId: Types.ObjectId;
  mfaType: MFAType;
  mfaSecret?: string;
  backupCodes?: string[];
}

export type ICredentialDocument = HydratedDocument<ICredential>;

const CredentialSchema: Schema<ICredentialDocument> = new Schema(
  {
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    mfaEnabled: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      enum: Object.values(Role),
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    mfaType: {
      type: String,
      enum: Object.values(MFAType),
      default: MFAType.None
    },
    mfaSecret: {
      type: String,
      select: false,
      required: function (this: ICredentialDocument) {
        return this.mfaType === MFAType.Authenticator;
      }
    },
    backupCodes: {
      type: [String],
      select: false,
      default: undefined
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

CredentialSchema.index({ targetId: 1, target: 1 }, { unique: true });

export const Credential = model<ICredentialDocument>(
  Models.Credential.ref,
  CredentialSchema
);
