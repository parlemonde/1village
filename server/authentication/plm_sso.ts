import { JSONSchemaType } from "ajv";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entities/user";
import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { ajv, sendInvalidDataError } from "../utils/jsonSchemaValidator";
import { logger } from "../utils/logger";

import { PLM_User, createPLMUserToDB } from "./lib/plmUser";
import { getAccessToken } from "./lib/tokens";

const plmSsoUrl = process.env.PLM_HOST || "";
const secret: string = process.env.APP_SECRET || "";
const ssoData = {
  grant_type: "authorization_code",
  client_id: process.env.CLIENT_ID || "",
  client_secret: process.env.CLIENT_SECRET || "",
  redirect_uri: `${process.env.HOST_URL}/login`,
};

// --- LOGIN WITH PLM SSO---
type SsoData = {
  code: string;
};
const SSO_SCHEMA: JSONSchemaType<SsoData> = {
  type: "object",
  properties: {
    code: { type: "string" },
  },
  required: ["code"],
  additionalProperties: false,
};
const ssoValidator = ajv.compile(SSO_SCHEMA);
export async function loginWithPlmSSO(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (secret.length === 0 || plmSsoUrl.length === 0) {
    next();
    return;
  }
  const data = req.body;
  if (!ssoValidator(data)) {
    sendInvalidDataError(ssoValidator);
    return;
  }

  try {
    const ssoResponse = await axios({
      method: "POST",
      url: `${plmSsoUrl}/oauth/token`,
      data: {
        ...ssoData,
        code: data.code,
      },
    });
    const { access_token } = ssoResponse.data as { access_token: string };
    const userResponse = await axios({
      method: "GET",
      url: `${plmSsoUrl}/oauth/me?access_token=${access_token}`,
    });
    const plmUser = userResponse.data as PLM_User;
    let user = await getRepository(User).findOne({
      where: [{ email: plmUser.user_email }, { pseudo: plmUser.user_login }],
    });
    if (user && user.accountRegistration !== 10) {
      throw new AppError("Please use normal login", ErrorCode.DONT_USO_SSO);
    }
    if (user == undefined) {
      user = await createPLMUserToDB(plmUser);
    }
    const { accessToken, refreshToken } = await getAccessToken(user.id, true);
    res.cookie("access-token", accessToken, { maxAge: 60 * 60000, expires: new Date(Date.now() + 60 * 60000), httpOnly: true });
    // res.cookie("refresh-token", refreshToken, { maxAge: 24 * 60 * 60000, expires: new Date(Date.now() + 24 * 60 * 60000), httpOnly: true });
    res.sendJSON({ user: user.withoutPassword(), accessToken, refreshToken: refreshToken });
  } catch (error) {
    logger.error(error);
    logger.error(JSON.stringify(error?.response?.data) || "");
    throw new AppError("Could not connect with SSO", ErrorCode.UNKNOWN);
  }
}
