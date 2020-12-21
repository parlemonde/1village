import { Request, Response } from "express";

import { AppError, ErrorCode } from "../middlewares/handleErrors";

import { codeFlowAuthorize } from "./flows/authorizationCodeFlow";
import { implicitGrantAuthorize } from "./flows/implicitGrant";

export function authorize(req: Request, res: Response): void {
  // if (!req.cookies || !req.cookies["access-token"]) {
  //   // not logged-in, redirect to login page.
  //   res.redirect("/login" + serializeToQueryUrl({ continue: req.url }));
  // }
  // todo: check user say yes to grant access to the third application.
  const data = req.body.response_type !== undefined ? req.body : req.query;
  const response_type: string = data.response_type || "";
  if (response_type === "code") {
    codeFlowAuthorize(data, res);
  } else if (response_type === "token") {
    implicitGrantAuthorize(data, res);
  } else {
    throw new AppError("response_type invalid", ErrorCode.INVALID_DATA);
  }
}
