import type { JSONSchemaType } from 'ajv';
import * as argon2 from 'argon2';
import type { NextFunction, Request, Response } from 'express';
import type { FindOperator } from 'typeorm';
import { LessThan, IsNull } from 'typeorm';

import { getAccessToken } from '../authentication/lib/tokens';
import { Email, sendMail } from '../emails';
import { Activity, ActivityType, ActivityStatus } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Student } from '../entities/student';
import { User, UserType } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { generateTemporaryToken, valueOrDefault, isPasswordValid, getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { getPosition, setUserPosition } from '../utils/get-pos';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import updateHasStudentLinkedForAffectedUsers from '../utils/updateHasStudentLinkedForAffectedUsers';
import { Controller } from './controller';

const userController = new Controller('/users');
// --- Get all users. ---
userController.get({ path: '', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  let users: User[] = [];
  if (req.query.villageId) {
    users = await AppDataSource.getRepository(User).find({
      where: [
        { villageId: Number(getQueryString(req.query.villageId)) || 0 },
        // Fix for enums, they are stored as string in mySQL, so the comparison should be done with a string.
        // But Typeorm expect a number...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { villageId: IsNull(), type: LessThan(`${UserType.TEACHER}`) as FindOperator<any> },
      ],
    });
    const ids = users.map((u) => u.id);
    const mascottes = (
      await AppDataSource.getRepository(Activity)
        .createQueryBuilder('activity')
        .select('userId')
        .addSelect('id')
        .where('type = :type', { type: ActivityType.MASCOTTE })
        .andWhere('status = :status', { status: ActivityStatus.PUBLISHED })
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
    users = await AppDataSource.getRepository(User).find();
  }
  res.sendJSON(users);
});

// --- Get one user. ---
userController.get({ path: '/:id(\\d+)', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const user = await AppDataSource.getRepository(User).findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type <= UserType.ADMIN;
  if (user === null || (!isSelfProfile && !isAdmin)) {
    next();
    return;
  }
  res.sendJSON(user);
});

// --- Get user's feature flags ---
userController.get({ path: '/:userId/featureFlags', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
    relations: ['featureFlags'],
  });

  if (!user) {
    res.status(404).send();
    return;
  }

  const featureFlags = user.featureFlags.map((featureFlag) => {
    return {
      id: featureFlag.id,
      name: featureFlag.name,
      isEnabled: featureFlag.isEnabled,
    };
  });

  res.json(featureFlags);
});

// --- Check user pseudo ---
userController.get({ path: '/pseudo/:pseudo' }, async (req: Request, res: Response) => {
  const pseudo = req.params.pseudo || '';
  if (!pseudo) {
    res.sendJSON({ available: true });
  }
  res.sendJSON({
    available: (await AppDataSource.getRepository(User).count({ where: { pseudo } })) === 0,
  });
});

// --- Get pos ---
userController.get({ path: '/position' }, async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.query ? getQueryString(req.query.query) : '';
  const country = req.query.country ? getQueryString(req.query.country) : '';
  const city = req.query.city ? getQueryString(req.query.city) : '';

  let pos = query ? await getPosition({ q: query }) : null;
  pos ||= city && country ? await getPosition({ city, country }) : null;
  pos ||= country ? await getPosition({ country }) : null;
  if (pos === null) {
    next();
    return;
  }
  res.sendJSON(pos);
});

// --- Create an user. ---
type CreateUserData = {
  email: string;
  pseudo: string;
  firstname?: string;
  lastname?: string;
  countryCode?: string;
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
  firstLogin?: number;
  hasAcceptedNewsletter?: boolean;
  language?: string;
  hasStudentLinked?: boolean;
};
const CREATE_SCHEMA: JSONSchemaType<CreateUserData> = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    pseudo: { type: 'string' },
    firstname: { type: 'string', nullable: true },
    lastname: { type: 'string', nullable: true },
    countryCode: { type: 'string', nullable: true },
    level: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    postalCode: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    displayName: { type: 'string', nullable: true },
    password: { type: 'string', nullable: true },
    type: {
      type: 'number',
      nullable: true,
      enum: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MEDIATOR, UserType.TEACHER, UserType.FAMILY, UserType.OBSERVATOR],
    },
    villageId: { type: 'number', nullable: true },
    firstLogin: { type: 'number', nullable: true },
    hasAcceptedNewsletter: { type: 'boolean', nullable: true },
    language: { type: 'string', nullable: true },
    hasStudentLinked: { type: 'boolean', nullable: true },
  },
  required: ['email', 'pseudo'],
  additionalProperties: false,
};
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const createUserValidator = ajv.compile(CREATE_SCHEMA);
userController.post({ path: '' }, async (req: Request, res: Response) => {
  async function generatePseudo(data: CreateUserData): Promise<string> {
    const firstName = data.firstname || '';
    const lastName = data.lastname || '';
    const randomNum = Math.floor(Math.random() * 10000);

    let pseudo = `${firstName}${lastName.slice(0, 1).toLocaleUpperCase()}${randomNum}`;

    while (await checkIfPseudoExists(pseudo)) {
      pseudo = `${firstName}${lastName.slice(0, 1).toLocaleUpperCase()}${Math.floor(Math.random() * 10000)}`;
    }
    return pseudo;
  }

  async function checkIfPseudoExists(pseudo: string): Promise<boolean> {
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({ where: { pseudo } });
    return !!existingUser;
    /* The !! is a double negation operator. It converts the value following it to a boolean, where any truthy value (i.e., any non-null, non-undefined, non-zero value) is converted to true, and any falsy value (i.e., null, undefined, 0, false, '', etc.) is converted to false. */
  }
  const data = req.body;
  if (!createUserValidator(data)) {
    sendInvalidDataError(createUserValidator);
    return;
  }
  if (data.password !== undefined && !isPasswordValid(data.password)) {
    throw new AppError('Invalid password', ErrorCode.INVALID_PASSWORD);
  }

  if (!emailRegex.test(data.email)) {
    throw new AppError('Invalid email', ErrorCode.INVALID_EMAIL);
  }

  const user = new User();
  user.email = data.email;
  user.firstname = data.firstname || '';
  user.lastname = data.lastname || '';
  user.level = data.level || '';
  user.school = data.school || '';
  user.address = data.address || '';
  user.city = data.city || '';
  user.postalCode = data.postalCode || '';
  user.avatar = data.avatar || null;
  user.displayName = data.displayName || null;
  user.villageId = data.villageId || null;
  user.hasAcceptedNewsletter = data.hasAcceptedNewsletter || false;
  user.language = data.language || 'français';
  user.hasStudentLinked = data.hasStudentLinked || false;
  user.countryCode = data.countryCode || '';
  user.type = data.type || UserType.TEACHER || UserType.FAMILY;
  if (user.type === UserType.TEACHER) {
    user.isVerified = true;
    user.accountRegistration = 0;
  }

  // Generate unique pseudo

  let pseudo = data.pseudo;
  if (!pseudo) {
    pseudo = await generatePseudo(data);
  } else {
    let pseudoExists = await checkIfPseudoExists(pseudo);
    while (pseudoExists) {
      pseudo = await generatePseudo(data);
      pseudoExists = await checkIfPseudoExists(pseudo);
    }
  }
  user.pseudo = pseudo;

  user.accountRegistration = 4; // Block account on inscription and wait for user to verify its email.
  user.passwordHash = data.password ? await argon2.hash(data.password) : '';
  const temporaryPassword = generateTemporaryToken(20);
  user.verificationHash = await argon2.hash(temporaryPassword);

  await setUserPosition(user);
  await AppDataSource.getRepository(User).save(user);
  delete user.passwordHash;
  delete user.verificationHash;
  res.sendJSON(user);
});

// --- Edit an user. ---
type EditUserData = {
  email?: string;
  pseudo?: string;
  firstname?: string;
  lastname?: string;
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
  firstLogin?: number;
  position?: { lat: number; lng: number };
  isVerified?: boolean;
  accountRegistration?: number;
  hasAcceptedNewsletter?: boolean;
  language?: string | null;
  hasStudentLinked?: boolean;
};
const EDIT_SCHEMA: JSONSchemaType<EditUserData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: true },
    pseudo: { type: 'string', nullable: true },
    firstname: { type: 'string', nullable: true },
    lastname: { type: 'string', nullable: true },
    countryCode: { type: 'string', nullable: true },
    level: { type: 'string', nullable: true },
    school: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    postalCode: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    displayName: { type: 'string', nullable: true },
    type: {
      type: 'number',
      nullable: true,
      enum: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MEDIATOR, UserType.TEACHER, UserType.FAMILY, UserType.OBSERVATOR],
    },
    villageId: { type: 'number', nullable: true },
    accountRegistration: { type: 'number', nullable: true },
    firstLogin: { type: 'number', nullable: true },
    position: {
      type: 'object',
      nullable: true,
      properties: {
        lat: { type: 'number', nullable: false },
        lng: { type: 'number', nullable: false },
      },
      required: ['lat', 'lng'],
      additionalProperties: false,
    },
    hasAcceptedNewsletter: { type: 'boolean', nullable: true },
    isVerified: { type: 'boolean', nullable: true },
    language: { type: 'string', nullable: true },
    hasStudentLinked: { type: 'boolean', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
const editUserValidator = ajv.compile(EDIT_SCHEMA);

userController.put({ path: '/:id', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  const id = parseInt(req.params.id, 10) || 0;
  const user = await AppDataSource.getRepository(User).findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type <= UserType.ADMIN;
  if (user === null || (!isSelfProfile && !isAdmin)) {
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
  user.firstLogin = valueOrDefault(data.firstLogin, user.firstLogin);
  if (req.user !== undefined && req.user.type <= UserType.ADMIN) {
    user.type = valueOrDefault(data.type, user.type);
    user.villageId = valueOrDefault(data.villageId, user.villageId, true);
  }
  if (data.position) {
    user.position = data.position;
  }
  user.hasAcceptedNewsletter = valueOrDefault(data.hasAcceptedNewsletter, user.hasAcceptedNewsletter);
  user.language = valueOrDefault(data.language, user.language);
  user.hasStudentLinked = valueOrDefault(data.hasStudentLinked, user.hasStudentLinked);
  await AppDataSource.getRepository(User).save(user);
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
userController.put({ path: '/:id/password', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  const id = parseInt(req.params.id, 10) || 0;
  const user = await AppDataSource.getRepository(User).createQueryBuilder().addSelect('User.passwordHash').where('User.id = :id', { id }).getOne();
  const isSelfProfile = req.user && req.user.id === id;
  if (user === null || !isSelfProfile) {
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
    await AppDataSource.getRepository(User).save(user);
  } else {
    throw new AppError('Mot de passe invalide', ErrorCode.INVALID_PASSWORD);
  }
  res.sendJSON({ success: true });
});

// --- Delete an user. ---
userController.delete({ path: '/:id', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  const userRepository = AppDataSource.getRepository(User);
  const classroomRepository = AppDataSource.getRepository(Classroom);
  const id = parseInt(req.params.id, 10) || 0;
  const user = await userRepository.findOne({ where: { id } });
  const isSelfProfile = req.user && req.user.id === id;
  const isAdmin = req.user && req.user.type <= UserType.ADMIN;
  if (!user || (!isSelfProfile && !isAdmin)) {
    res.status(204).send();
    return;
  }

  const affectedUserIds: number[] = [];

  // Fetch the related classroom and its students
  const classroom = await classroomRepository.findOne({ where: { user: { id: user.id } }, relations: ['students'] });

  if (classroom) {
    // Collect the affected user IDs from the classroom's students
    for (const student of classroom.students) {
      const studentWithRelations = await AppDataSource.getRepository(Student).findOne({
        where: { id: student.id },
        relations: ['userToStudents', 'userToStudents.user'],
      });
      if (studentWithRelations) {
        for (const userToStudent of studentWithRelations.userToStudents) {
          if (userToStudent && userToStudent.user) {
            affectedUserIds.push(userToStudent.user.id);
          }
        }
      }
    }
  }

  await AppDataSource.getRepository(User).delete({ id });

  // Update the hasStudentLinked field for affected users
  await updateHasStudentLinkedForAffectedUsers(affectedUserIds);

  res.status(204).send();
});

// --- Verify email. ---
type VerifyData = {
  email?: string;
  verificationHash?: string;
};
const VERIFY_SCHEMA: JSONSchemaType<VerifyData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: true },
    verificationHash: { type: 'string', nullable: true },
  },
  additionalProperties: false,
};
const verifyUserValidator = ajv.compile(VERIFY_SCHEMA);

userController.post({ path: '/verify-email' }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!verifyUserValidator(data)) {
    sendInvalidDataError(verifyUserValidator);
    return;
  }

  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .addSelect('User.verificationHash')
    .where('User.email = :email', { email: data.email })
    .getOne();

  let isverifyTokenCorrect: boolean = false;

  if (user && user.verificationHash && data.verificationHash && !user.isVerified) {
    try {
      /* const cleanedVerificationHash = data.verificationHash.replace(/ /g, '+'); */
      isverifyTokenCorrect = await argon2.verify(user.verificationHash, data.verificationHash);
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    if (!isverifyTokenCorrect) {
      throw new AppError('Invalid verify token', ErrorCode.INVALID_PASSWORD);
    }
  } else {
    throw new AppError('Invalid verify token', ErrorCode.INVALID_PASSWORD);
  }

  // save user
  user.accountRegistration = 0;
  user.verificationHash = '';
  user.isVerified = true;
  await AppDataSource.getRepository(User).save(user);

  // login user
  const { accessToken } = await getAccessToken(user.id, false);
  res.cookie('access-token', accessToken, {
    maxAge: 4 * 60 * 60000,
    expires: new Date(Date.now() + 4 * 60 * 60000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  delete user.verificationHash;
  res.sendJSON({ user, accessToken });
});

// ===== RESEND VERIFICATION EMAIL =====
type ResendEmailData = {
  email?: string;
};

const RESEND_EMAIL_SCHEMA: JSONSchemaType<ResendEmailData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: true },
  },
  additionalProperties: false,
};
const resendEmailValidator = ajv.compile(RESEND_EMAIL_SCHEMA);

userController.post({ path: '/resend-verification-email' }, async (req: Request, res: Response) => {
  const data = req.body;

  if (!resendEmailValidator(data)) {
    sendInvalidDataError(resendEmailValidator);
    return;
  }

  const user = await AppDataSource.getRepository(User).createQueryBuilder().where('User.email = :email', { email: data.email }).getOne();

  if (!user) {
    throw new AppError('Invalid data', ErrorCode.INVALID_DATA);
  }
  if (user.isVerified) {
    throw new AppError('User is already verified', ErrorCode.ALREADY_VERIFIED_ACCOUNT);
  }

  const temporaryVerificationHash = generateTemporaryToken(20);

  user.verificationHash = await argon2.hash(temporaryVerificationHash);
  await AppDataSource.getRepository(User).save(user);
  const frontUrl = process.env.HOST_URL || 'http://localhost:5000';

  if (data.email) {
    try {
      await sendMail(Email.CONFIRMATION_EMAIL, data.email, {
        url: frontUrl,
        firstname: user.firstname,
        email: data.email,
        verificationHash: temporaryVerificationHash,
      });

      res.status(200).json({
        message: 'Verification email sent successfully',
      });
    } catch (err) {
      res.status(400).json({ message: 'Bad request' });
    }
  }
  res.status(400);
  // Return a success response
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

  const user = await AppDataSource.getRepository(User).findOne({ where: { email: data.email } });
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
  user.accountRegistration = 0;

  await AppDataSource.getRepository(User).save(user);

  const frontUrl = process.env.HOST_URL || 'http://localhost:5000';
  await sendMail(Email.RESET_PASSWORD_EMAIL, data.email, {
    url: frontUrl,
    email: user.email,
    verificationHash: temporaryPassword,
  });

  res.sendJSON({ success: true });
});

// --- Update pwd. ---
type UpdateData = {
  email: string;
  verificationHash: string;
  password: string;
};
const UPDATE_SCHEMA: JSONSchemaType<UpdateData> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    verificationHash: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'verificationHash', 'password'],
  additionalProperties: false,
};
const updateUserValidator = ajv.compile(UPDATE_SCHEMA);
userController.post({ path: '/update-password' }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateUserValidator(data)) {
    sendInvalidDataError(updateUserValidator);
    return;
  }

  const user = await AppDataSource.getRepository(User)
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
    isverifyTokenCorrect = await argon2.verify(user.verificationHash || '', data.verificationHash);
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
  await AppDataSource.getRepository(User).save(user);

  // login user
  const { accessToken } = await getAccessToken(user.id, false);
  res.cookie('access-token', accessToken, {
    maxAge: 4 * 60 * 60000,
    expires: new Date(Date.now() + 4 * 60 * 60000),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
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
userController.post({ path: '/ask-update', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
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

userController.get({ path: '/get-classroom/:id', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  // Retrieve the user's linked student
  const userToStudent = await AppDataSource.getRepository(UserToStudent).findOne({
    where: { user: { id: req.user.id } },
    relations: ['student', 'student.classroom', 'student.classroom.village', 'student.classroom.user'],
  });

  if (!userToStudent) {
    res.status(404).json({ message: 'No linked student found' });
    return;
  }

  const { student } = userToStudent;
  const { classroom } = student;

  res.json({
    student: {
      id: student.id,
      firstname: student.firstname,
      lastname: student.lastname,
      classroom: {
        user: classroom.user.countryCode,
      },
    },
  });
});

userController.get({ path: '/:id/linked-students' }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  // Retrieve the user's linked student
  const id = parseInt(req.params.id, 10) || 0;

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id },
    relations: ['userToStudents', 'userToStudents.student'],
  });

  if (!user) {
    res.status(404).json({ message: 'No linked student found' });
    return;
  }

  // const { student } = userToStudent;
  const students = user.userToStudents.map((userToStudent) => userToStudent.student);
  res.json(students);
});

// Delete the link between user and student
userController.delete({ path: '/:userId/linked-students/:studentId' }, async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Forbidden', ErrorCode.UNKNOWN);

  const userId = parseInt(req.params.userId, 10) || 0;
  const studentId = parseInt(req.params.studentId, 10) || 0;

  const userToStudent = await AppDataSource.getRepository(UserToStudent).findOne({
    where: { user: { id: userId }, student: { id: studentId } },
    relations: ['user', 'student'],
  });

  if (!userToStudent) {
    return res.status(404).json({ message: 'Le lien parent-étudiant n a pas été trouvé.' });
  }
  // const { student } = userToStudent;
  await AppDataSource.getRepository(UserToStudent).remove(userToStudent);

  return res.status(200).json({ message: 'Le lien parent-étudiant a été supprimé avec succès.' });
});

// Get the visibility parameters for Family members
userController.get({ path: '/:id/visibility-params/', userType: UserType.FAMILY }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  const id = parseInt(req.params.id, 10) || 0;
  const user = await AppDataSource.getRepository(User).findOne({ where: { id }, relations: ['userToStudents', 'userToStudents.student'] });

  if (user && user.type === UserType.TEACHER) {
    const teacherClassroom = await AppDataSource.getRepository(Classroom).findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
    return res.json(teacherClassroom);
  }

  if (user && user.type === UserType.FAMILY) {
    const classrooms = [];

    for (const student of user.userToStudents) {
      const classroom = await AppDataSource.getRepository(Classroom).findOne({
        where: { students: { id: student.student.id } },
        relations: ['user'],
      });
      if (classroom) {
        classrooms.push(classroom);
      }
    }

    return res.json(classrooms);
  }

  return res.json([]);
});

userController.get({ path: '/get-student-vp', userType: UserType.FAMILY }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  const visibilityParams = await AppDataSource.getRepository(UserToStudent)
    .createQueryBuilder('userStudent')
    .innerJoinAndSelect('userStudent.student', 'student')
    .innerJoinAndSelect('student.classroom', 'classroom')
    .where('userStudent.user = :familyId', { familyId: req.user.id })
    .getRawMany(); //* Here it's getRawMany because for some reason we lost 2 attributes otherwise classroom.userId and classroom.villageId
  res.json(visibilityParams);
});

export { userController };
