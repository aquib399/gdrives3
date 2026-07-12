import { invalidateTenantCache } from "@/services/v1/shared/tenant/index.js";
import type * as validation from "@/validations/v1/tenant/google.js";
import { googleClient } from "@/clients/google.js";
import { GDrive } from "@/models/mongo/gdrive.js";
import { GOOGLE_CONFIG } from "@/configs/env.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "@/utils/response.js";

interface GetAuthUrlPayload {
  tenantId: string;
}

interface GetAuthUrlResponse {
  url: string;
}

export const getAuthUrl: serviceFunction<
  GetAuthUrlPayload,
  GetAuthUrlResponse
> = async (props) => {
  try {
    const { authUrl } = await googleClient.getAuthUrl(props.tenantId);

    return {
      status: 200,
      response: createSuccessResponse<GetAuthUrlResponse>(
        "Google authentication URL generated successfully",
        { url: authUrl }
      )
    };
  } catch (error) {
    return {
      status: 500,
      response: createErrorResponse("Failed to generate connection URL", null)
    };
  }
};

interface HandleCallbackResponse {
  redirectUrl: string;
}

export const handleCallback: serviceFunction<
  validation.HandleCallbackPayload,
  HandleCallbackResponse
> = async (props) => {
  const { code, state } = props;
  const tenantId = state;

  try {
    const { tokens } = await googleClient.getTokens(code);

    if (!tokens.refresh_token) {
      return {
        status: 400,
        response: createErrorResponse(
          "Refresh token missing. Re-authorize access.",
          null
        )
      };
    }

    await GDrive.findOneAndUpdate(
      { tenantId },
      {
        tenantId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date
      },
      { upsert: true, returnDocument: "after" }
    ).lean();

    void invalidateTenantCache(tenantId);

    const redirectUrl = createRedirectUrl({
      tenantId,
      error: false,
      message: "Drive integration successful"
    });

    return {
      status: 200,
      response: createSuccessResponse<HandleCallbackResponse>(
        "Drive integrated and updated successfully",
        { redirectUrl }
      )
    };
  } catch (error: unknown) {
    console.log("Error during Drive integration handshake:", error);
    const baseErrMsg = "Error during Drive integration handshake";
    const exceptionMsg =
      error instanceof Error ? error.message : "Unknown error";

    console.error(baseErrMsg, error);

    const fullErrorMessage = `${baseErrMsg}: ${exceptionMsg}`;

    const redirectUrl = createRedirectUrl({
      tenantId,
      error: true,
      message: fullErrorMessage
    });

    return {
      status: 500,
      response: createErrorResponse("Integration handshake failed", {
        redirectUrl
      })
    };
  }
};

function createRedirectUrl({
  tenantId,
  error,
  message
}: {
  tenantId: string;
  error: boolean;
  message: string;
}): string {
  const url = `${GOOGLE_CONFIG.CLIENT_REDIRECT_URI}?tenantId=${tenantId}&error=${error}&message=${message}`;
  return url;
}
