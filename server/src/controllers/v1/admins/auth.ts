import type * as validation from "@/validations/v1/admin/auth.js";
import * as service from "@/services/v1/admins/auth.js";

export const signIn: routerFunction<validation.SignInPayload> = async (
  req,
  res
) => {
  const body = req.body;
  const { response, status } = await service.signIn({ req, res, body });
  return res.status(status).json(response);
};

export const signUp: routerFunction<validation.SignUpPayload> = async (
  req,
  res
) => {
  const body = req.body;
  const { response, status } = await service.signUp(body);
  return res.status(status).json(response);
};

export const signOut: routerFunction = async (req, res) => {
  const { response, status } = await service.signOut({ req, res });
  return res.status(status).json(response);
};
