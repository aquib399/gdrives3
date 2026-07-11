import type * as validation from "@/validations/v1/system/media/index.js";
import * as service from "@/services/v1/system/media/index.js";

export const initUpload: routerFunction<validation.InitUploadPayload> = async (
  req,
  res
) => {
  const { response, status } = await service.initUpload(req.body);
  return res.status(status).json(response);
};

export const completeUpload: routerFunction<
  validation.CompleteUploadPayload
> = async (req, res) => {
  const { response, status } = await service.completeUpload(req.body);
  return res.status(status).json(response);
};
