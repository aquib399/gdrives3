import { invalidateTenantCache } from "@/services/v1/shared/tenant/index.js";
import { clearAuthCookies, setAuthCookies } from "@/services/index.js";
import type * as validation from "@/validations/v1/tenant/auth.js";
import { TOKEN_CONFIG, APP_DOMAIN } from "@/configs/env.js";
import { hashString, verifyHash } from "@/utils/hash.js";
import { tenantTokens } from "@/utils/jwt/tokens.js";
import { emailClient } from "@/clients/email.js";
import { otpClient } from "@/clients/otp.js";
import { getCookies } from "@/utils/cookies.js";
import { Role } from "@/types/role.js";
import { Types } from "mongoose";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";
import {
  OtpType,
  Token,
  Tenant,
  TokenType,
  Credential,
  TokenTarget,
  type ITenant
} from "@/models/index.js";

const TOKEN_CFG = TOKEN_CONFIG.tenant;
const factory = tenantTokens;

interface SendSignupOtpResponse {
  otpRequestId: string;
}
export const sendSignupOtp: serviceFunction<
  validation.SendSignupOtpPayload,
  SendSignupOtpResponse
> = async ({ email }) => {
  const exists = await Tenant.exists({
    email: {
      $regex: new RegExp(`^${email}$`, "i")
    }
  });
  if (exists)
    return {
      status: 409,
      response: createErrorResponse("Email already in use", null)
    };

  const targetId = new Types.ObjectId();
  const { otpCode, otpRequestId } = await otpClient.create({
    targetId,
    type: OtpType.TENANT_SIGNUP
  });

  const { sendEmail } = emailClient.init();
  sendEmail({
    from: `noreply@${APP_DOMAIN}`,
    to: [email],
    subject: "Verify your email – Trexend",
    html: `<p>Your verification code is <strong>${otpCode}</strong>. It expires in 10 minutes.</p>`
  }).catch((err) =>
    console.error("Failed to send tenant signup OTP email:", err)
  );

  return {
    status: 200,
    response: createSuccessResponse<SendSignupOtpResponse>(
      "OTP sent to your email",
      { otpRequestId }
    )
  };
};

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
> = async ({ body, req, res }) => {
  const tenant = await Tenant.findOne({
    email: {
      $regex: new RegExp(`^${body.email}$`, "i")
    }
  });
  if (!tenant)
    return {
      status: 401,
      response: createErrorResponse("Invalid email or password", null)
    };

  const credential = await Credential.findOne({
    targetId: tenant._id,
    target: Role.Tenant
  })
    .select("+passwordHash")
    .lean();
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

  const id = tenant._id.toString();
  const [accessToken, refreshToken] = await Promise.all([
    factory.createAccessToken({ id }),
    factory.createRefreshToken({ id }, req)
  ]);

  setAuthCookies({
    res,
    role: Role.Tenant,
    tokenConfig: TOKEN_CFG,
    tokens: { accessToken, refreshToken }
  });

  return {
    status: 200,
    response: createSuccessResponse<SignInResponse>("Signed in successfully", {
      accessToken,
      refreshToken
    })
  };
};

interface SignUpResponse {
  tenant: ITenant;
}
export const signUp: serviceFunction<
  validation.SignUpPayload,
  SignUpResponse
> = async (props) => {
  const { details, credentials } = props;

  const otpResult = await otpClient.verifyById({
    otpRequestId: details.otpRequestId,
    type: OtpType.TENANT_SIGNUP,
    otp: details.otpCode
  });
  if (!otpResult.valid)
    return {
      status: 400,
      response: createErrorResponse(otpResult.error!, null)
    };

  const exists = await Tenant.exists({
    email: {
      $regex: new RegExp(`^${details.email}$`, "i")
    }
  });
  if (exists)
    return {
      status: 409,
      response: createErrorResponse("Email already in use", null)
    };

  const { otpRequestId, otpCode, ...tenantDetails } = details;
  const tenant = await Tenant.create(tenantDetails);

  const passwordHash = await hashString(credentials.password);
  await Credential.create({
    targetId: tenant._id,
    target: Role.Tenant,
    mfaType: credentials.mfaType,
    passwordHash
  });

  void invalidateTenantCache();

  return {
    status: 201,
    response: createSuccessResponse<SignUpResponse>(
      "Tenant account created successfully",
      {
        tenant: tenant.toObject()
      }
    )
  };
};

interface SignOutValue {
  req: routerRequest;
  res: routerResponse;
}
interface SignOutResponse {}
export const signOut: serviceFunction<SignOutValue, SignOutResponse> = async ({
  req,
  res
}) => {
  const cookies = getCookies(req.headers.cookie);
  const refreshToken = cookies[TOKEN_CFG.refresh.name];
  if (refreshToken) {
    await Token.findOneAndUpdate(
      {
        token: refreshToken,
        target: TokenTarget.Tenant,
        type: TokenType.Refresh
      },
      { isActive: false }
    );
  }

  clearAuthCookies({ res, tokenConfig: TOKEN_CFG, role: Role.Tenant });

  return {
    status: 200,
    response: createSuccessResponse<SignOutResponse>(
      "Signed out successfully",
      {}
    )
  };
};
