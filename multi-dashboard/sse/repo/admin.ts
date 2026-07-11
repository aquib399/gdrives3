import { BaseSse } from "./base";

export class AdminSse extends BaseSse {
  private static instance: AdminSse;

  private constructor() {
    super({
      endpoint: "/api/admin/v1/sse"
    });
  }

  public static getInstance(): AdminSse {
    if (!AdminSse.instance) {
      AdminSse.instance = new AdminSse();
    }
    return AdminSse.instance;
  }
}
