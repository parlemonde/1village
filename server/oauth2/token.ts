import { JSONSchemaType, DefinedError } from "ajv";
import { Request, Response } from "express";

import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { ajv } from "../utils/jsonSchemaValidator";

import { getAccessToken } from "./accessToken";
import { tokens, clients } from "./authorize";

type TokenParams = {
  grant_type: "authorization_code";
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
};

const TOKEN_SCHEMA: JSONSchemaType<TokenParams> = {
  type: "object",
  properties: {
    grant_type: { type: "string", const: "authorization_code" },
    code: { type: "string" },
    client_id: { type: "string" },
    client_secret: { type: "string" },
    redirect_uri: { type: "string", nullable: true },
  },
  required: ["grant_type", "client_id", "client_secret", "code"],
  additionalProperties: false,
};
const tokenValidator = ajv.compile(TOKEN_SCHEMA);

export function token(req: Request, res: Response): void {
  const data = req.body;
  if (!tokenValidator(data)) {
    const errors = tokenValidator.errors as DefinedError[];
    let errorMsg = "Invalid data!";
    if (errors.length > 0) {
      errorMsg = errors[0].schemaPath + " " + errors[0].message || errorMsg;
    }
    throw new AppError(errorMsg, ErrorCode.INVALID_DATA);
  }

  if (!data.redirect_uri) {
    res.redirect("/");
    return;
  }

  const retreivedTokenIndex = tokens.findIndex((t) => t.token === data.code && t.client_id === data.client_id && t.redirect_uri === data.redirect_uri && t.created_at + 600000 > new Date().getTime());
  const client = clients.find((c) => c.id === data.client_id);
  if (retreivedTokenIndex === -1 || !client || client.secret !== data.client_secret) {
    res.sendJSON({
      error: "access_denied",
    });
    return;
  }

  const userId = tokens[retreivedTokenIndex].userId;
  const { accessToken, refreshToken } = getAccessToken(userId, true);

  tokens.splice(retreivedTokenIndex, 1);

  res.sendJSON({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: refreshToken,
  });
}
