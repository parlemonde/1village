import { JSONSchemaType } from "ajv";
import { Request, Response } from "express";

import { ajv, sendInvalidDataError } from "../../utils/jsonSchemaValidator";
import { getNewAccessToken } from "../lib/tokens";

type TokenParams = {
  grant_type: "refresh_token";
  refresh_token: string;
  client_id?: string;
  client_secret?: string;
};
const TOKEN_SCHEMA: JSONSchemaType<TokenParams> = {
  type: "object",
  properties: {
    grant_type: { type: "string", const: "refresh_token" },
    refresh_token: { type: "string" },
    client_id: { type: "string", nullable: true },
    client_secret: { type: "string", nullable: true },
  },
  required: ["grant_type", "refresh_token"],
  additionalProperties: false,
};
const tokenValidator = ajv.compile(TOKEN_SCHEMA);
export async function refreshToken(data: unknown, req: Request, res: Response): Promise<void> {
  if (!tokenValidator(data)) {
    sendInvalidDataError(tokenValidator);
    return;
  }
  if (!req.appClient) {
    res.sendJSON({
      error: "access_denied",
    });
    return;
  }

  const newTokens = await getNewAccessToken(data.refresh_token, req.appClient.id);
  if (newTokens === null) {
    res.sendJSON({
      error: "access_denied",
    });
    return;
  }

  res.sendJSON({
    access_token: newTokens.accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: newTokens.refreshToken,
  });
}
