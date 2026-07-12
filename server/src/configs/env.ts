import { TokenConfigMap } from "@/types/token.js";
import { calculateMs } from "@/utils/time.js";
import "dotenv/config";

type EnvType = "production" | "development";

const env = process.env;

export const NODE_ENV = (env.NODE_ENV as EnvType) || "development";
export const PORT = String(env.PORT || 8082);

export const DATABASE_CONFIG = {
  URL: env.DATABASE_URL!,
  NAME: env.DATABASE_NAME!
};

export const TOKEN_CONFIG: TokenConfigMap = {
  admin: {
    access: {
      name: "a_at",
      secret: env.ADMIN_ACCESS_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 5 })
    },
    refresh: {
      name: "a_rt",
      secret: env.ADMIN_REFRESH_TOKEN_SECRET!,
      expiryMs: calculateMs({ days: 7 })
    },
    otp: {
      name: "a_ot",
      secret: env.ADMIN_OTP_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 15 })
    },
    forgetPassword: {
      name: "a_fpt",
      secret: env.ADMIN_FORGET_PASSWORD_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 15 })
    },
    oauth: {
      name: "a_oat",
      secret: env.ADMIN_OAUTH_TOKEN_SECRET!,
      expiryMs: calculateMs({ months: 1 })
    }
  },

  tenant: {
    access: {
      name: "t_at",
      secret: env.TENANT_ACCESS_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 5 })
    },
    refresh: {
      name: "t_rt",
      secret: env.TENANT_REFRESH_TOKEN_SECRET!,
      expiryMs: calculateMs({ days: 7 })
    },
    otp: {
      name: "t_ot",
      secret: env.TENANT_OTP_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 5 })
    },
    forgetPassword: {
      name: "t_fpt",
      secret: env.TENANT_FORGET_PASSWORD_TOKEN_SECRET!,
      expiryMs: calculateMs({ minutes: 15 })
    },
    oauth: {
      name: "t_oat",
      secret: env.TENANT_OAUTH_TOKEN_SECRET!,
      expiryMs: calculateMs({ months: 1 })
    }
  }
};

export const ORIGINS = env.CORS_ORIGINS?.split(" ").filter(Boolean)!;

export const APP_URL = env.APP_URL!;
export const BASE_URL = env.BASE_URL!;
export const APP_DOMAIN = env.APP_DOMAIN!;

export const REDIS_CONFIG = {
  // URL: env.REDIS_URL!,
  HOST: env.REDIS_HOST!,
  PORT: Number(env.REDIS_PORT!),
  USERNAME: env.REDIS_USERNAME!,
  PASSWORD: env.REDIS_PASSWORD!,
  TLS: Boolean(env.REDIS_TLS === "true")
};

export const EMAIL_CONFIG = {
  USER: env.GMAIL_USER!,
  APP_PASSWORD: env.GMAIL_APP_PASSWORD!
};

export const TOKEN_ENCRYPTION_KEY = env.TOKEN_ENCRYPTION_KEY!;

export const GOOGLE_CONFIG = {
  CLIENT_ID: env.GOOGLE_CLIENT_ID!,
  CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET!,
  REDIRECT_URI: env.GOOGLE_REDIRECT_URI!,
  CLIENT_REDIRECT_URI: env.CLIENT_REDIRECT_URI!
};

import * as constants from "./env.js";

function CheckObjectValues(obj: Record<string, any>, parent: string): void {
  const errors: string[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      CheckObjectValues(value, `${parent ? `${parent}.` : ""}${key}`);
    } else if (value === null || value === undefined || value === "") {
      errors.push(
        `Missing required environment variable: ${parent ? `${parent}.` : ""}${key}`
      );
    }
  });
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
CheckObjectValues(constants, "");
