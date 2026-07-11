import * as mediaTypes from "@/types/domain/system/media";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiFunctionProps } from "@/types/api";
import { request } from "..";

const endpoints = API_ENDPOINTS.system.media;

export const MediaAPI = {
  initUpload: async (props: ApiFunctionProps<mediaTypes.InitUploadPayload>) =>
    request<mediaTypes.InitUploadResponse>({
      method: "POST",
      endpoint: endpoints.initUpload,
      ...props
    }),
  completeUpload: async (
    props: ApiFunctionProps<mediaTypes.CompleteUploadPayload>
  ) =>
    request<mediaTypes.CompleteUploadResponse>({
      method: "POST",
      endpoint: endpoints.completeUpload,
      ...props
    })
};
