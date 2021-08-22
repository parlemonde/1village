import type { JSONSchemaType } from 'ajv';
import * as argon2 from 'argon2';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';

import { getAccessToken } from './lib/tokens';

const secret: string = process.env.APP_SECRET || '';

// --- LOGIN ---
type LoginData = {
  username: string;
  password: string;
  getRefreshToken?: boolean;
};
const LOGIN_SCHEMA: JSONSchemaType<LoginData> = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    getRefreshToken: { type: 'boolean', nullable: true },
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
const loginValidator = ajv.compile(LOGIN_SCHEMA);
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (secret.length === 0) {
    next();
    return;
  }
  const data = req.body;
  if (!loginValidator(data)) {
    sendInvalidDataError(loginValidator);
    return;
  }

  const user = await getRepository(User)
    .createQueryBuilder()
    .addSelect('User.passwordHash')
    .where('User.email = :username OR User.pseudo = :username', { username: data.username })
    .getOne();

  if (user === undefined) {
    throw new AppError('Invalid username', ErrorCode.INVALID_USERNAME);
  }

  let isPasswordCorrect: boolean = false;
  try {
    isPasswordCorrect = await argon2.verify(user.passwordHash || '', data.password);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  if (user.accountRegistration === 4) {
    throw new AppError('Account blocked. Please reset password', ErrorCode.ACCOUNT_BLOCKED);
  }

  if (user.accountRegistration === 10) {
    throw new AppError('Please use SSO', ErrorCode.USE_SSO);
  }

  if (!isPasswordCorrect) {
    user.accountRegistration += 1;
    await getRepository(User).save(user);
    throw new AppError('Invalid password', ErrorCode.INVALID_PASSWORD);
  } else if (user.accountRegistration > 0 && user.accountRegistration < 4) {
    user.accountRegistration = 0;
    await getRepository(User).save(user);
  }

  const { accessToken, refreshToken } = await getAccessToken(user.id, !!data.getRefreshToken);
  res.cookie('access-token', accessToken, { maxAge: 4 * 60 * 60000, expires: new Date(Date.now() + 4 * 60 * 60000), httpOnly: true });
  if (data.getRefreshToken) {
    res.cookie('refresh-token', refreshToken, { maxAge: 7 * 24 * 60 * 60000, expires: new Date(Date.now() + 7 * 24 * 60 * 60000), httpOnly: true });
  }
  delete user.passwordHash;
  res.sendJSON({ user: user, accessToken, refreshToken: refreshToken });
}
