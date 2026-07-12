import { GOOGLE_CONFIG } from "@/configs/env.js";
import { google } from "googleapis";

interface GoogleAuthClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}
class GoogleClient {
  private readonly options: GoogleAuthClientOptions;
  private readonly oauth2Client: InstanceType<typeof google.auth.OAuth2>;

  constructor(options: GoogleAuthClientOptions) {
    const client = this.createOAuth2Client(options);
    this.options = options;
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
