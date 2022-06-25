import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { getUserFromPLM } from '../legacy-plm/api';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { getAccessToken } from './lib/tokens';

const secret: string = process.env.APP_SECRET || '';

// --- LOGIN WITH PLM SSO---
type SsoData = {
  code: string;
};
const SSO_SCHEMA: JSONSchemaType<SsoData> = {
  type: 'object',
  properties: {
    code: { type: 'string' },
  },
  required: ['code'],
  additionalProperties: false,
};
const ssoValidator = ajv.compile(SSO_SCHEMA);
export async function loginWithPlmSSO(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (secret.length === 0) {
    next();
    return;
  }
  const data = req.body;
  if (!ssoValidator(data)) {
    sendInvalidDataError(ssoValidator);
    return;
  }

  const user = await getUserFromPLM(data.code);
  if (user === null) {
    throw new AppError('Could not connect with SSO', ErrorCode.UNKNOWN);
  }
  if (user.accountRegistration !== 10) {
    throw new AppError('Please use normal login', ErrorCode.DONT_USO_SSO);
  }
  const { accessToken, refreshToken } = await getAccessToken(user.id, true);
  res.cookie('access-token', accessToken, {
    maxAge: 4 * 60 * 60000,
    expires: new Date(Date.now() + 4 * 60 * 60000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.cookie('refresh-token', refreshToken, {
    maxAge: 7 * 24 * 60 * 60000,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.sendJSON({ user, accessToken, refreshToken: refreshToken });
}
