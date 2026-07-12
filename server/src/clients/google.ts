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

  getTenantDriveClient(accessToken: string, refreshToken?: string) {
    const client = this.createOAuth2Client(this.options);

    client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    return google.drive({ version: "v3", auth: client });
  }
}

export const googleClient = new GoogleClient({
  clientId: GOOGLE_CONFIG.CLIENT_ID,
  clientSecret: GOOGLE_CONFIG.CLIENT_SECRET,
  redirectUri: GOOGLE_CONFIG.REDIRECT_URI
});
