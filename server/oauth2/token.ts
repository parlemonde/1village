import { Request, Response } from "express";

import { AppError, ErrorCode } from "../middlewares/handleErrors";

import { codeFlowToken } from "./flows/authorizationCodeFlow";

export function token(req: Request, res: Response): void {
  const data = req.body;
  if (data.grant_type && data.grant_type === "authorization_code") {
    codeFlowToken(data, res);
  } else {
    throw new AppError("grant_type invalid", ErrorCode.INVALID_DATA);
  }
}
