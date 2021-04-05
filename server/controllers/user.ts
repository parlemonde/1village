import { JSONSchemaType } from 'ajv';
import * as argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { getAccessToken } from '../authentication/lib/tokens';
import { Email, sendMail } from '../emails';
import { Activity, ActivityType } from '../entities/activity';
import { User, UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import { generateTemporaryToken, valueOrDefault, isPasswordValid, getQueryString } from '../utils';

import { Controller } from './controller';

const userController = new Controller('/users');
// --- Get all users. ---
userController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  let users: User[] = [];
  if (req.query.villageId) {
    users = await getRepository(User).find({ where: [{ villageId: parseInt(getQueryString(req.query.villageId), 10) || 0 }, { villageId: null }] });
    const ids = users.map((u) => u.id);
    const mascottes = (
      await getRepository(Activity)
        .createQueryBuilder('activity')
        .select('userId')
        .addSelect('id')
        .where('type = :type', { type: `${ActivityType.PRESENTATION}` })
        .andWhere('subType = :subType', { subType: 1 })
        .andWhere('userId in (:ids)', { ids })
        .orderBy('createDate', 'ASC')
        .getRawMany()
    ).reduce<{ [userId: number]: number }>((acc, row) => {
      acc[row.userId] = row.id;
      return acc;
    }, {});
    for (const user of users) {
      user.mascotteId = mascottes[user.id] || undefined;
    }
  } else {
    users = await getRepository(User).find();
  }
  res.sendJSON(users);
});

// --- Get one user. ---
userController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type >= UserType.ADMIN;
  if (user === undefined || (!isSelfProfile && !isAdmin)) {
    next();
    return;
  }
  res.sendJSON(user);
});

// --- Check user pseudo ---
userController.get({ path: '/pseudo/:pseudo' }, async (req: Request, res: Response) => {
  const pseudo = req.params.pseudo || '';
  if (!pseudo) {
    res.sendJSON({ available: true });
  }
  res.sendJSON({
    available: (await getRepository(User).count({ where: { pseudo } })) === 0,
  });
});

// --- Create an user. ---
type CreateUserData = {
  email: string;
  pseudo: string;
  countryCode: string;
  level?: string;
  school?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  avatar?: string;
  displayName?: string;
  password?: string;
  type?: UserType;
  villageId?: number;
  firstLogin?: boolean;
};
const CREATE_SCHEMA: JSONSchemaType<CreateUserData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    pseudo: { type: 'string' },
    countryCode: { type: 'string' },
    level: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    postalCode: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    displayName: { type: 'string', nullable: true },
    password: { type: 'string', nullable: true },
    type: { type: 'number', nullable: true, enum: [UserType.TEACHER, UserType.OBSERVATOR, UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN] },
    villageId: { type: 'number', nullable: true },
    firstLogin: { type: 'boolean', nullable: true },
  },
  required: ['email', 'pseudo'],
  additionalProperties: false,
};
const createUserValidator = ajv.compile(CREATE_SCHEMA);
userController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createUserValidator(data)) {
    sendInvalidDataError(createUserValidator);
    return;
  }
  if (data.password !== undefined && !isPasswordValid(data.password)) {
    throw new AppError('Invalid password', ErrorCode.INVALID_PASSWORD);
  }

  const user = new User();
  user.email = data.email;
  user.pseudo = data.pseudo;
  user.level = data.level || '';
  user.school = data.school || '';
  user.address = data.address || '';
  user.city = data.city || '';
  user.postalCode = data.postalCode || '';
  user.avatar = data.avatar || null;
  user.displayName = data.displayName || null;
  user.villageId = data.villageId || null;
  user.countryCode = data.countryCode;
  if (req.user !== undefined && req.user.type >= UserType.ADMIN) {
    user.type = valueOrDefault(data.type, UserType.TEACHER);
  } else {
    user.type = UserType.TEACHER;
  }
  user.accountRegistration = data.password === undefined ? 3 : 0;
  user.passwordHash = data.password ? await argon2.hash(data.password) : '';
  const temporaryPassword = generateTemporaryToken(20);
  user.verificationHash = await argon2.hash(temporaryPassword);
  // todo: send mail with verification password to validate the email adress.

  await getRepository(User).save(user);
  delete user.passwordHash;
  delete user.verificationHash;
  res.sendJSON(user);
});

// --- Edit an user. ---
type EditUserData = {
  email?: string;
  pseudo?: string;
  countryCode?: string;
  level?: string;
  school?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  avatar?: string;
  displayName?: string;
  type?: UserType;
  villageId?: number | null;
  accountRegistration?: number;
  firstLogin?: boolean;
};
const EDIT_SCHEMA: JSONSchemaType<EditUserData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: true },
    pseudo: { type: 'string', nullable: true },
    countryCode: { type: 'string', nullable: true },
    level: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    postalCode: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    displayName: { type: 'string', nullable: true },
    type: { type: 'number', nullable: true, enum: [UserType.TEACHER, UserType.OBSERVATOR, UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN] },
    villageId: { type: 'number', nullable: true },
    accountRegistration: { type: 'number', nullable: true },
    firstLogin: { type: 'boolean', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
const editUserValidator = ajv.compile(EDIT_SCHEMA);
userController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type >= UserType.ADMIN;
  if (user === undefined || (!isSelfProfile && !isAdmin)) {
    next();
    return;
  }
  const data = req.body;
  if (!editUserValidator(data)) {
    sendInvalidDataError(editUserValidator);
    return;
  }

  if (user.accountRegistration !== 10) {
    user.email = valueOrDefault(data.email, user.email);
    user.pseudo = valueOrDefault(data.pseudo, user.pseudo);
  }
  user.address = valueOrDefault(data.address, user.address);
  user.city = valueOrDefault(data.city, user.city);
  user.postalCode = valueOrDefault(data.postalCode, user.postalCode);
  user.level = valueOrDefault(data.level, user.level);
  user.school = valueOrDefault(data.school, user.school);
  user.countryCode = valueOrDefault(data.countryCode, user.countryCode);
  user.avatar = valueOrDefault(data.avatar, user.avatar) || null;
  user.displayName = valueOrDefault(data.displayName, user.displayName) || null;
  user.firstLogin = false;
  if (req.user !== undefined && req.user.type >= UserType.ADMIN) {
    user.type = valueOrDefault(data.type, user.type);
    user.villageId = valueOrDefault(data.villageId, user.villageId, true);
  }
  await getRepository(User).save(user);
  res.sendJSON(user);
});

// --- Update user password ---
type UpdatePwdData = {
  password: string;
  newPassword: string;
};
const PWD_SCHEMA: JSONSchemaType<UpdatePwdData> = {
  type: 'object',
  properties: {
    password: { type: 'string' },
    newPassword: { type: 'string' },
  },
  required: ['password', 'newPassword'],
  additionalProperties: false,
};
const updatePwdValidator = ajv.compile(PWD_SCHEMA);
userController.put({ path: '/:id/password', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).createQueryBuilder().addSelect('User.passwordHash').where('User.id = :id', { id }).getOne();
  const isSelfProfile = req.user && req.user.id === id;
  if (user === undefined || !isSelfProfile) {
    next();
    return;
  }
  if (user.accountRegistration === 10) {
    throw new AppError('Use SSO', ErrorCode.USE_SSO);
  }
  const data = req.body;
  if (!updatePwdValidator(data)) {
    sendInvalidDataError(updatePwdValidator);
    return;
  }
  let isPasswordCorrect: boolean = false;
  try {
    isPasswordCorrect = await argon2.verify(user.passwordHash || '', data.password);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
  if (isPasswordCorrect) {
    user.passwordHash = await argon2.hash(data.newPassword);
    await getRepository(User).save(user);
  } else {
    throw new AppError('Mot de passe invalide', ErrorCode.INVALID_PASSWORD);
  }
  res.sendJSON({ success: true });
});

// --- Delete an user. ---
userController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await getRepository(User).findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type >= UserType.ADMIN;
  if (user === undefined || (!isSelfProfile && !isAdmin)) {
    res.status(204).send();
    return;
  }

  await getRepository(User).delete({ id });
  res.status(204).send();
});

// --- Verify email. ---
type VerifyData = {
  email: string;
  verifyToken: string;
};
const VERIFY_SCHEMA: JSONSchemaType<VerifyData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    verifyToken: { type: 'string' },
  },
  required: ['email', 'verifyToken'],
  additionalProperties: false,
};
const verifyUserValidator = ajv.compile(VERIFY_SCHEMA);
userController.post({ path: '/verify-email' }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!verifyUserValidator(data)) {
    sendInvalidDataError(verifyUserValidator);
    return;
  }

  const user = await getRepository(User)
    .createQueryBuilder()
    .addSelect('User.verificationHash')
    .where('User.email = :email', { email: data.email })
    .getOne();
  if (!user) {
    next();
    return;
  }

  let isverifyTokenCorrect: boolean = false;
  try {
    isverifyTokenCorrect = await argon2.verify(user.verificationHash || '', data.verifyToken);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
  if (!isverifyTokenCorrect) {
    throw new AppError('Invalid verify token', ErrorCode.INVALID_PASSWORD);
  }

  // save user
  user.accountRegistration = 0;
  user.verificationHash = '';
  await getRepository(User).save(user);

  // login user
  const { accessToken } = await getAccessToken(user.id, false);
  res.cookie('access-token', accessToken, { maxAge: 4 * 60 * 60000, expires: new Date(Date.now() + 4 * 60 * 60000), httpOnly: true });
  delete user.verificationHash;
  res.sendJSON({ user: user, accessToken });
});

// --- Reset pwd. ---
type ResetData = {
  email: string;
};
const RESET_SCHEMA: JSONSchemaType<ResetData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
};
const resetUserValidator = ajv.compile(RESET_SCHEMA);
userController.post({ path: '/reset-password' }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!resetUserValidator(data)) {
    sendInvalidDataError(resetUserValidator);
    return;
  }

  const user = await getRepository(User).findOne({ where: { email: data.email } });
  if (!user) {
    next();
    return;
  }
  if (user.accountRegistration === 10) {
    throw new AppError('Use SSO', ErrorCode.USE_SSO);
  }

  // update user
  const temporaryPassword = generateTemporaryToken(12);
  user.verificationHash = await argon2.hash(temporaryPassword);
  await getRepository(User).save(user);

  // send mail with verification password
  // await sendMail(Email.RESET_PASSWORD, user.email, { resetCode: temporaryPassword }, req.body.languageCode || undefined);
  res.sendJSON({ success: true });
});

// --- Update pwd. ---
type UpdateData = {
  email: string;
  verifyToken: string;
  password: string;
};
const UPDATE_SCHEMA: JSONSchemaType<UpdateData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    verifyToken: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'verifyToken', 'password'],
  additionalProperties: false,
};
const updateUserValidator = ajv.compile(UPDATE_SCHEMA);
userController.post({ path: '/update-password' }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateUserValidator(data)) {
    sendInvalidDataError(updateUserValidator);
    return;
  }

  const user = await getRepository(User)
    .createQueryBuilder()
    .addSelect('User.verificationHash')
    .where('User.email = :email', { email: data.email })
    .getOne();
  if (!user) {
    next();
    return;
  }

  if (user.accountRegistration === 10) {
    throw new AppError('Use SSO', ErrorCode.USE_SSO);
  }

  let isverifyTokenCorrect: boolean = false;
  try {
    isverifyTokenCorrect = await argon2.verify(user.verificationHash || '', data.verifyToken);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
  if (!isverifyTokenCorrect) {
    throw new AppError('Invalid reset token', ErrorCode.INVALID_PASSWORD);
  }

  // update password
  const password = data.password;
  if (!isPasswordValid(password)) {
    throw new AppError('Invalid password', ErrorCode.PASSWORD_NOT_STRONG);
  }
  user.passwordHash = await argon2.hash(password);
  user.accountRegistration = 0;
  user.verificationHash = '';
  await getRepository(User).save(user);

  // login user
  const { accessToken } = await getAccessToken(user.id, false);
  res.cookie('access-token', accessToken, { maxAge: 4 * 60 * 60000, expires: new Date(Date.now() + 4 * 60 * 60000), httpOnly: true });
  delete user.passwordHash;
  delete user.verificationHash;
  res.sendJSON({ user, accessToken });
});

// Error data
type ErrorData = {
  error: 'village' | 'country';
};
const ERROR_SCHEMA: JSONSchemaType<ErrorData> = {
  type: 'object',
  properties: {
    error: { type: 'string', enum: ['country', 'village'] },
  },
  required: ['error'],
  additionalProperties: false,
};
const errorUserValidator = ajv.compile(ERROR_SCHEMA);
userController.post({ path: '/ask-update' }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!errorUserValidator(data)) {
    sendInvalidDataError(errorUserValidator);
    return;
  }

  if (!req.user) {
    next();
    return;
  }

  if (process.env.ADMIN_EMAIL) {
    sendMail(data.error === 'village' ? Email.INVALID_VILLAGE : Email.INVALID_COUNTRY, process.env.ADMIN_EMAIL, {
      userName: req.user.pseudo,
      userEmail: req.user.email,
    });
  }
  if (process.env.ADMIN_EMAIL_1) {
    sendMail(data.error === 'village' ? Email.INVALID_VILLAGE : Email.INVALID_COUNTRY, process.env.ADMIN_EMAIL_1, {
      userName: req.user.pseudo,
      userEmail: req.user.email,
    });
  }
  if (process.env.ADMIN_EMAIL_2) {
    sendMail(data.error === 'village' ? Email.INVALID_VILLAGE : Email.INVALID_COUNTRY, process.env.ADMIN_EMAIL_2, {
      userName: req.user.pseudo,
      userEmail: req.user.email,
    });
  }

  res.sendJSON({ success: true });
});

export { userController };
