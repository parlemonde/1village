import { JSONSchemaType } from "ajv";
import { Response } from "express";
import { getRepository } from "typeorm";

import { Client } from "../../entities/client";
import { ajv, sendInvalidDataError } from "../../utils/jsonSchemaValidator";
import { serializeToQueryUrl } from "../../utils";
import { getAccessToken } from "../lib/tokens";

type AuthorizeParams = {
  response_type: "token";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state: string;
};
const AUTHORIZE_SCHEMA: JSONSchemaType<AuthorizeParams> = {
  type: "object",
  properties: {
    response_type: { type: "string", const: "token" },
    client_id: { type: "string" },
    redirect_uri: { type: "string", nullable: true },
    scope: { type: "string", nullable: true },
    state: { type: "string", nullable: true },
  },
  required: ["response_type", "client_id", "state"],
  additionalProperties: false,
};
const authorizeValidator = ajv.compile(AUTHORIZE_SCHEMA);
export async function implicitGrantAuthorize(data: unknown, res: Response): Promise<void> {
  if (!authorizeValidator(data)) {
    sendInvalidDataError(authorizeValidator);
    return;
  }
  if (!data.redirect_uri) {
    res.redirect("/");
    return;
  }
  // Check client_id and client redirect_url
  const client = await getRepository(Client).findOne({
    where: {
      id: data.client_id,
    },
  });
  if (client === undefined || client.redirectUri !== data.redirect_uri) {
    res.redirect(
      data.redirect_uri +
        serializeToQueryUrl({
          error: "unauthorized_client",
          state: data.state,
        }),
    );
    return;
  }
  // Grant access
  const userId = 18; //todo
  const { accessToken } = await getAccessToken(userId, false);
  res.redirect(
    data.redirect_uri +
      serializeToQueryUrl({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
        state: data.state,
      }),
  );
}
