import type { JSONSchemaType } from 'ajv';
import * as argon2 from 'argon2';
import type { NextFunction, Request, Response } from 'express';

import { UserType } from '../../types/user.type';
import { User } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import { getAccessToken } from './lib/tokens';

const secret: string = process.env.APP_SECRET || '';

// --- LOGIN ---
type LoginData = {
  email: string;
  password: string;
  getRefreshToken?: boolean;
};
const LOGIN_SCHEMA: JSONSchemaType<LoginData> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    getRefreshToken: { type: 'boolean', nullable: true },
  },
  required: ['email', 'password'],
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

  const query = await AppDataSource.getRepository(User)
    .createQueryBuilder('User')
    .addSelect('User.passwordHash')
    .where('User.email = :email OR User.pseudo = :email', { email: data.email });

  const user = await query.getOne();

  if (user === null) {
    throw new AppError('Invalid credentials', ErrorCode.INVALID_USERNAME);
  }
  //Here we will change the logic to test if user parent is connected to a student or not during registration
  let hasStudentLinked: boolean = false;
  if (user.type === UserType.FAMILY) {
    hasStudentLinked =
      (await AppDataSource.getRepository(UserToStudent)
        .createQueryBuilder('userToStudent')
        .select('userToStudent.userId')
        .where('userToStudent.userId = :userId', { userId: user.id })
        .getCount()) > 0;
  }
  let isPasswordCorrect: boolean = false;
  try {
    isPasswordCorrect = await argon2.verify(user.passwordHash || '', data.password);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }

  if (user.type === UserType.FAMILY) {
    if (user.accountRegistration === 4 && user.isVerified === false) {
      throw new AppError('Unverified account, Please verify your account', ErrorCode.UNVERIFIED_ACCOUNT);
    }
  }
  if (user.accountRegistration === 4) {
    throw new AppError('Account blocked. Please reset password', ErrorCode.ACCOUNT_BLOCKED);
  }

  if (user.accountRegistration === 10) {
    throw new AppError('Please use SSO', ErrorCode.USE_SSO);
  }

  if (!isPasswordCorrect) {
    user.accountRegistration += 1;
    await AppDataSource.getRepository(User).save(user);
    throw new AppError('Invalid credentials', ErrorCode.INVALID_PASSWORD);
  } else if (user.accountRegistration > 0 && user.accountRegistration < 4) {
    user.accountRegistration = 0;
    await AppDataSource.getRepository(User).save(user);
  }

  const { accessToken, refreshToken } = await getAccessToken(user.id, !!data.getRefreshToken);
  res.cookie('access-token', accessToken, {
    maxAge: 4 * 60 * 60000,
    expires: new Date(Date.now() + 4 * 60 * 60000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  if (data.getRefreshToken) {
    res.cookie('refresh-token', refreshToken, {
      maxAge: 7 * 24 * 60 * 60000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60000),
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
  delete user.passwordHash;
  res.sendJSON({ user: user, accessToken, refreshToken: refreshToken, hasStudentLinked: hasStudentLinked });
}
