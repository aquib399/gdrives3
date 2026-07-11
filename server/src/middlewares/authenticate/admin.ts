import { signOut } from "@/services/v1/admins/auth.js";
import { adminTokens } from "@/utils/jwt/tokens.js";
import { createAuthMiddleware } from "./factory.js";
import { TOKEN_CONFIG } from "@/configs/env.js";

const TOKEN_CFG = TOKEN_CONFIG.admin;
const factory = adminTokens;

export const authenticateAdmin = createAuthMiddleware({
  accessCookie: {
    name: TOKEN_CFG.access.name,
    expiryMs: TOKEN_CFG.access.expiryMs
  },
  refreshCookie: {
    name: TOKEN_CFG.refresh.name,
    expiryMs: TOKEN_CFG.refresh.expiryMs
  },
  attachLocalsConfig: {
    id: "id",
    role: "role"
  },
  verifyAccess: factory.verifyAccessToken.bind(factory),
  verifyRefresh: factory.verifyRefreshToken.bind(factory),
  createAccess: factory.createAccessToken.bind(factory),
  signOut: (req, res) => signOut({ req, res }),

  messages: {
    noToken: "Please login to continue",
    accessExpired: "Your session expired. Please login again",
    invalidRefresh: "Session invalid. Please login again"
  }
});
