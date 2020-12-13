import { JSONSchemaType, DefinedError } from "ajv";
import { Request, Response } from "express";

import { AppError, ErrorCode } from "../middlewares/handleErrors";
import { ajv } from "../utils/jsonSchemaValidator";
import { generateTemporaryPassword, serializeToQueryUrl } from "../utils";

type AuthorizeParams = {
  response_type: "code";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state: string;
};

const AUTHORIZE_SCHEMA: JSONSchemaType<AuthorizeParams> = {
  type: "object",
  properties: {
    response_type: { type: "string", const: "code" },
    client_id: { type: "string" },
    redirect_uri: { type: "string", nullable: true },
    scope: { type: "string", nullable: true },
    state: { type: "string", nullable: true },
  },
  required: ["response_type", "client_id", "state"],
  additionalProperties: false,
};
const authorizeValidator = ajv.compile(AUTHORIZE_SCHEMA);

// TODO: DB
type Client = {
  id: string;
  secret: string;
};
type ClientToken = {
  client_id: string;
  token: string;
  created_at: number;
  redirect_uri: string;
  userId: number;
};
export const clients: Client[] = [{ id: "1GUzjSRL16l-a8fPxuR7dZ4b", secret: "C1X4SKBwCPIrxRXA2ACh9O140K0_Lhdytbluqne0Xhy-_r0U" }];
export const tokens: ClientToken[] = [];

export function authorize(req: Request, res: Response): void {
  // if (!req.cookies || !req.cookies["access-token"]) {
  //   // not logged-in, redirect to login page.
  //   res.redirect("/login" + serializeToQueryUrl({ continue: req.url }));
  // }
  // todo: check user say yes to grant access to the third application.
  const data = req.body.response_type !== undefined ? req.body : req.query;
  if (!authorizeValidator(data)) {
    const errors = authorizeValidator.errors as DefinedError[];
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

  // Check client_id
  if (clients.findIndex((c) => c.id === data.client_id) === -1) {
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
  const newToken = {
    client_id: data.client_id,
    created_at: new Date().getTime(),
    token: generateTemporaryPassword(20),
    redirect_uri: data.redirect_uri,
    userId: 12, // TODO
  };
  tokens.push(newToken);

  res.redirect(
    data.redirect_uri +
      serializeToQueryUrl({
        code: newToken.token,
        state: data.state,
      }),
  );
}
