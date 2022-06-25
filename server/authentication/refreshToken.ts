/* eslint-disable camelcase */
import type { JSONSchemaType } from 'ajv';
import type { Request, Response } from 'express';

import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { getNewAccessToken } from './lib/tokens';

type TokenParams = {
  grant_type: 'refresh_token';
  refresh_token: string;
};
const TOKEN_SCHEMA: JSONSchemaType<TokenParams> = {
  type: 'object',
  properties: {
    grant_type: { type: 'string', const: 'refresh_token' },
    refresh_token: { type: 'string' },
  },
  required: ['grant_type', 'refresh_token'],
  additionalProperties: false,
};
const tokenValidator = ajv.compile(TOKEN_SCHEMA);
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const data = req.body;
  if (!tokenValidator(data)) {
    sendInvalidDataError(tokenValidator);
    return;
  }

  const newTokens = await getNewAccessToken(data.refresh_token);
  if (newTokens === null) {
    res.sendJSON({
      error: 'access_denied',
    });
    return;
  }

  res.sendJSON({
    access_token: newTokens.accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: newTokens.refreshToken,
  });
}
