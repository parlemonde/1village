import { Request, Response } from "express";

import { AppError, ErrorCode } from "../middlewares/handleErrors";

import { codeFlowToken } from "./flows/authorizationCodeFlow";
import { clientCredentials } from "./flows/clientCredentials";
import { refreshToken } from "./flows/refreshToken";

export async function token(req: Request, res: Response): Promise<void> {
  const data = req.body;
  if (data.grant_type && data.grant_type === "authorization_code") {
    await codeFlowToken(data, req, res);
  } else if (data.grant_type && data.grant_type === "refresh_token") {
    await refreshToken(data, req, res);
  } else if (data.grant_type && data.grant_type === "client_credentials") {
    await clientCredentials(data, req, res);
  } else {
    throw new AppError("grant_type invalid", ErrorCode.INVALID_DATA);
  }
}
