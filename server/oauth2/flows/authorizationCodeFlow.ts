import { JSONSchemaType } from "ajv";
import crypto from "crypto";
import { Response, Request } from "express";
import { getRepository, MoreThan } from "typeorm";

import { Client } from "../../entities/client";
import { Token } from "../../entities/token";
import { ajv, sendInvalidDataError } from "../../utils/jsonSchemaValidator";
import { generateTemporaryPassword, serializeToQueryUrl } from "../../utils";
import { getAccessToken } from "../lib/tokens";

type AuthorizeParams = {
  response_type: "code";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state: string;
  code_challenge_method?: "S256";
  code_challenge?: string;
};
const AUTHORIZE_SCHEMA: JSONSchemaType<AuthorizeParams> = {
  type: "object",
  properties: {
    response_type: { type: "string", const: "code" },
    client_id: { type: "string" },
    redirect_uri: { type: "string", nullable: true },
    scope: { type: "string", nullable: true },
    state: { type: "string", nullable: true },
    code_challenge_method: { type: "string", enum: ["S256"], nullable: true },
    code_challenge: { type: "string", nullable: true },
  },
  required: ["response_type", "client_id", "state"],
  additionalProperties: false,
};
const authorizeValidator = ajv.compile(AUTHORIZE_SCHEMA);
export async function codeFlowAuthorize(data: unknown, res: Response): Promise<void> {
  if (!authorizeValidator(data)) {
    sendInvalidDataError(authorizeValidator);
    return;
  }
  if (!data.redirect_uri) {
    res.redirect("/");
    return;
  }
  // Check client_id
  const client = await getRepository(Client).findOne({ where: { id: data.client_id } });
  if (client === undefined) {
    res.redirect(
      data.redirect_uri +
        serializeToQueryUrl({
          error: "access_denied",
          state: data.state,
        }),
    );
    return;
  }
  // Generate code
  const newToken = new Token();
  newToken.clientId = data.client_id;
  newToken.token = generateTemporaryPassword(20);
  newToken.redirectUri = data.redirect_uri;
  newToken.userId = 12; // todo
  if (data.code_challenge && data.code_challenge_method === "S256") {
    newToken.codeChallenge = data.code_challenge;
  }
  await getRepository(Token).save(newToken);
  res.redirect(
    data.redirect_uri +
      serializeToQueryUrl({
        code: newToken.token,
        state: data.state,
      }),
  );
}

const isValidChallenge = (challenge: string = "", verifier: string = ""): boolean => {
  if (!challenge || !verifier) {
    return false;
  }
  const hash = crypto.createHash("sha256").update(verifier).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return hash === challenge;
};

type TokenParams = {
  grant_type: "authorization_code";
  code: string;
  client_id: string;
  client_secret?: string;
  redirect_uri?: string;
  code_verifier?: string;
};
const TOKEN_SCHEMA: JSONSchemaType<TokenParams> = {
  type: "object",
  properties: {
    grant_type: { type: "string", const: "authorization_code" },
    code: { type: "string" },
    client_id: { type: "string" },
    client_secret: { type: "string", nullable: true },
    code_verifier: { type: "string", nullable: true },
    redirect_uri: { type: "string", nullable: true },
  },
  required: ["grant_type", "code"],
  additionalProperties: false,
};
const tokenValidator = ajv.compile(TOKEN_SCHEMA);
export async function codeFlowToken(data: unknown, req: Request, res: Response): Promise<void> {
  if (!tokenValidator(data)) {
    sendInvalidDataError(tokenValidator);
    return;
  }

  if (!data.redirect_uri) {
    res.redirect("/");
    return;
  }

  const retreivedToken = await getRepository(Token).findOne({
    where: {
      token: data.code,
      clientId: data.client_id,
      redirectUri: data.redirect_uri,
      date: MoreThan(new Date().getTime() - 600000),
    },
  });

  if (retreivedToken === undefined || (!req.appClient && !isValidChallenge(retreivedToken.codeChallenge || "", data.code_verifier))) {
    res.sendJSON({
      error: "access_denied",
    });
    return;
  }

  const userId = retreivedToken.userId;
  const { accessToken, refreshToken } = await getAccessToken(userId, true, data.client_id);

  await getRepository(Token).delete({
    id: retreivedToken.id,
  });

  res.sendJSON({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: refreshToken,
  });
}
