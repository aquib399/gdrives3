import { clearAuthCookies, setAuthCookies } from "@/services/index.js";
import type * as validation from "@/validations/v1/admin/auth.js";
import { hashString, verifyHash } from "@/utils/hash.js";
import { adminTokens } from "@/utils/jwt/tokens.js";
import { getCookies } from "@/utils/cookies.js";
import { TOKEN_CONFIG } from "@/configs/env.js";
import { Role } from "@/types/role.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";
import {
  Admin,
  Token,
  TokenType,
  Credential,
  TokenTarget,
  type IAdmin
} from "@/models/index.js";

const TOKEN_CFG = TOKEN_CONFIG.admin;
const factory = adminTokens;

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}
export const signIn: serviceFunction<
  {
    body: validation.SignInPayload;
    req: routerRequest;
    res: routerResponse;
  },
  SignInResponse
> = async (props) => {
  const { body, req, res } = props;

  const admin = await Admin.findOne({ email: body.email.toLowerCase() });
  if (!admin)
    return {
      status: 401,
      response: createErrorResponse("Invalid email or password", null)
    };

  const credential = await Credential.findOne({
    targetId: admin._id,
    target: Role.Admin
  }).select("+passwordHash");

  if (!credential)
    return {
      status: 401,
      response: createErrorResponse("Invalid email or password", null)
    };

  const isMatch = await verifyHash(body.password, credential.passwordHash);
  if (!isMatch)
    return {
      status: 401,
      response: createErrorResponse("Invalid email or password", null)
    };

  const id = admin._id.toString();

  const [accessToken, refreshToken] = await Promise.all([
    factory.createAccessToken({ id }),
    factory.createRefreshToken({ id }, req)
  ]);

  setAuthCookies({
    res,
    role: Role.Admin,
    tokenConfig: TOKEN_CFG,
    tokens: { accessToken, refreshToken }
  });

  return {
    status: 200,
    response: createSuccessResponse<SignInResponse>(
      "Admin signed in successfully",
      {
        accessToken,
        refreshToken
      }
    )
  };
};

interface SignUpResponse {
  admin: IAdmin;
}
export const signUp: serviceFunction<
  validation.SignUpPayload,
  SignUpResponse
> = async (props) => {
  const { details, credentials } = props;

  const exists = await Admin.exists({ email: details.email.toLowerCase() });
  if (exists)
    return {
      status: 409,
      response: createErrorResponse("Email already in use", null)
    };

  const admin = await Admin.create(details);

  try {
    const passwordHash = await hashString(credentials.password);
    await Credential.create({
      targetId: admin._id,
      target: Role.Admin,
      mfaType: credentials.mfaType,
      passwordHash
    });
  } catch (err) {
    await Admin.findByIdAndDelete(admin._id);
    throw err;
  }

  return {
    status: 201,
    response: createSuccessResponse<SignUpResponse>(
      "Admin account created successfully",
      {
        admin: admin.toObject()
      }
    )
  };
};

interface SignOutPayload {
  req: routerRequest;
  res: routerResponse;
}
interface SignOutResponse {}
export const signOut: serviceFunction<SignOutPayload, SignOutResponse> = async (
  props
) => {
  const { req, res } = props;

  const cookies = getCookies(req.headers.cookie);
  const refreshToken = cookies[TOKEN_CFG.refresh.name];
  if (refreshToken) {
    await Token.findOneAndUpdate(
      {
        token: refreshToken,
        target: TokenTarget.Admin,
        type: TokenType.Refresh
      },
      { isActive: false }
    );
  }

  clearAuthCookies({ res, tokenConfig: TOKEN_CFG, role: Role.Admin });

  return {
    status: 200,
    response: createSuccessResponse<SignOutResponse>(
      "Admin signed out successfully",
      {}
    )
  };
};
