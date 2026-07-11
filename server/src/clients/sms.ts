import { IS_PRODUCTION } from "@/lib/constant.js";

interface SendSmsPayload {
  phone: string;
  text: string;
}

interface SendSmsResponse {}

class SmsClient {
  constructor() {}

  protected async sendSms(
    payload: SendSmsPayload,
    signal?: AbortSignal
  ): Promise<SendSmsResponse> {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    if (!IS_PRODUCTION) {
      return {};
    }

    // TODO: will be done,
    // do not touch this file.
    return {};
  }

  protected abortEmail(controller: AbortController): void {
    controller.abort();
  }

  public init() {
    const controller = new AbortController();

    return {
      sendSms: (payload: SendSmsPayload) =>
        this.sendSms(payload, controller.signal),

      abortEmail: () => this.abortEmail(controller)
    };
  }
}

export const smsClient = new SmsClient();
