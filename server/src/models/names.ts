export const Models = Object.freeze({
  Admin: Object.freeze({
    ref: "Admin",
    collection: "admins"
  }),
  Token: Object.freeze({
    ref: "Token",
    collection: "tokens"
  }),
  Credential: Object.freeze({
    ref: "Credential",
    collection: "credentials"
  }),
  Tenant: Object.freeze({
    ref: "Tenant",
    collection: "tenants"
  }),
  Otp: Object.freeze({
    ref: "Otp",
    collection: "otps"
  }),
  Media: Object.freeze({
    ref: "Media",
    collection: "media"
  }),
  GDrive: Object.freeze({
    ref: "GDrive",
    collection: "gdrives"
  }),
  ApiKey: Object.freeze({
    ref: "ApiKey",
    collection: "api_keys"
  })
} as const);
