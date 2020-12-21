import { JSONSchemaType } from "ajv";
import { Response } from "express";

import { AppError, ErrorCode } from "../../middlewares/handleErrors";
import { ajv, sendInvalidDataError } from "../../utils/jsonSchemaValidator";
import { getAccessToken } from "../lib/getAccessToken";

// TODO: DB
type Client = {
  id: string;
  secret: string;
  redirect_uri: string;
};
export const clients: Client[] = [];

type TokenParams = {
  grant_type: "client_credentials";
};
const TOKEN_SCHEMA: JSONSchemaType<TokenParams> = {
  type: "object",
  properties: {
    grant_type: { type: "string", const: "client_credentials" },
  },
  required: ["grant_type"],
  additionalProperties: false,
};
const tokenValidator = ajv.compile(TOKEN_SCHEMA);
export function implicitGrantAuthorize(data: unknown, res: Response): void {
  if (!tokenValidator(data)) {
    sendInvalidDataError(tokenValidator);
    return;
  }
  // todo authorize client bearer
  const client = null;

  // Check client_id and client redirect_url
  if (!client) {
    throw new AppError("unauthorized_client", ErrorCode.UNKNOWN);
  }

  // Grant access
  const { accessToken } = getAccessToken(-1, false);
  res.sendJSON({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
  });
}
