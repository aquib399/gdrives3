import type * as validation from "@/validations/v1/tenant/auth.js";
import * as service from "@/services/v1/tenants/auth.js";

export const sendSignupOtp: routerFunction<
  validation.SendSignupOtpPayload
> = async (req, res) => {
  const { response, status } = await service.sendSignupOtp(req.body);
  return res.status(status).json(response);
};

export const signIn: routerFunction<validation.SignInPayload> = async (
  req,
  res
) => {
  const { response, status } = await service.signIn({
    req,
    res,
    body: req.body
  });
  return res.status(status).json(response);
};

export const signUp: routerFunction<validation.SignUpPayload> = async (
  req,
  res
) => {
  const { response, status } = await service.signUp(req.body);
  return res.status(status).json(response);
};

export const signOut: routerFunction = async (req, res) => {
  const { response, status } = await service.signOut({ req, res });
  return res.status(status).json(response);
};
