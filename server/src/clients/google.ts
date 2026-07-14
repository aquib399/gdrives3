import { GOOGLE_CONFIG } from "@/configs/env.js";
import { google } from "googleapis";

interface GoogleAuthClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GetUploadUrlProps {
  payload: {
    mimeType: string;
    sizeInBytes: number;
    fileName: string;
    parents?: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiry?: number;
  };
  origin: string;
  onCredentialUpdate?: (newTokens: any) => Promise<void>;
}

class GoogleClient {
  private readonly oauth2Client: InstanceType<typeof google.auth.OAuth2>;

  constructor(options: GoogleAuthClientOptions) {
    const client = this.createOAuth2Client(options);
    this.oauth2Client = client;
  }

  protected createOAuth2Client(options: GoogleAuthClientOptions) {
    const client = new google.auth.OAuth2(
      options.clientId,
      options.clientSecret,
      options.redirectUri
    );
    return client;
  }

  async getAuthUrl(tenantId: string) {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/drive.file"],
      state: tenantId
    });

    return { authUrl };
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return { tokens };
  }

  async getUploadUrl(props: GetUploadUrlProps) {
    const authClient = this.getTenantAuthClient({
      access_token: props.tokens.accessToken,
      refresh_token: props.tokens.refreshToken,
      expiry_date: props.tokens.expiry ?? 0
    });

    if (props.onCredentialUpdate) {
      authClient.on("tokens", (tokens) => props.onCredentialUpdate!(tokens));
    }

    const authHeaders = await authClient.getRequestHeaders();
    const headers = new Headers(authHeaders as any);
    headers.set("Content-Type", "application/json");
    headers.set("X-Upload-Content-Type", props.payload.mimeType);
    headers.set(
      "X-Upload-Content-Length",
      props.payload.sizeInBytes.toString()
    );
    headers.set("Origin", props.origin);
    headers.set("Connection", "keep-alive");

    const googleResponse = await authClient.request({
      url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Upload-Content-Type": props.payload.mimeType,
        "X-Upload-Content-Length": props.payload.sizeInBytes.toString(),
        Origin: props.origin
      },
      data: {
        name: props.payload.fileName,
        ...(props.payload.parents && { parents: props.payload.parents })
      },
      validateStatus: () => true
    });

    const uploadUrl = googleResponse.headers.get("location");

    if (googleResponse.status !== 200) {
      throw new Error(
        `Google resumable upload init failed: ${googleResponse.status} ${googleResponse.statusText} ${JSON.stringify(googleResponse.data)}`
      );
    }

    if (!uploadUrl) {
      throw new Error("Location header missing from Google response");
    }
    return { uploadUrl };
  }

  async deleteFile(props: {
    fileId: string;
    tokens: {
      access_token: string;
      refresh_token?: string;
      expiry_date?: number;
    };
  }) {
    const drive = this.getTenantDriveClient(props.tokens);
    await drive.files.delete({ fileId: props.fileId });
  }

  async makeFilePublic(props: {
    fileId: string;
    tokens: {
      access_token: string;
      refresh_token?: string;
      expiry_date?: number;
    };
    onTokenRefresh?: (newTokens: any) => Promise<void>;
  }) {
    const drive = this.getTenantDriveClient(props.tokens, props.onTokenRefresh);
    await drive.permissions.create({
      fileId: props.fileId,
      requestBody: {
        role: "reader",
        type: "anyone"
      }
    });
  }

  getTenantAuthClient(credentials: {
    access_token: string;
    refresh_token?: string;
    expiry_date?: number;
  }) {
    const client = new google.auth.OAuth2(
      GOOGLE_CONFIG.CLIENT_ID,
      GOOGLE_CONFIG.CLIENT_SECRET,
      GOOGLE_CONFIG.REDIRECT_URI
    );

    client.setCredentials(credentials);
    return client;
  }

  getTenantDriveClient(
    credentials: {
      access_token: string;
      refresh_token?: string;
      expiry_date?: number;
    },
    onTokenRefresh?: (newTokens: any) => void
  ) {
    const client = this.getTenantAuthClient(credentials);

    if (onTokenRefresh) client.on("tokens", (tokens) => onTokenRefresh(tokens));

    return google.drive({ version: "v3", auth: client });
  }
}

export const googleClient = new GoogleClient({
  clientId: GOOGLE_CONFIG.CLIENT_ID,
  clientSecret: GOOGLE_CONFIG.CLIENT_SECRET,
  redirectUri: GOOGLE_CONFIG.REDIRECT_URI
});
