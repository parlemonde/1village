import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { UserType } from '../../types/user.type';
import { Classroom } from '../entities/classroom';
import { Country } from '../entities/country';
import { User } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

export const classroomController = new Controller('/classrooms');

/**
 * Classroom controller to get teacher's class parameters.
 * ExpressMiddleware signature
 * @param {string} id classroom id
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {object} Route API JSON response
 */

classroomController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await AppDataSource.getRepository(Classroom).findOne({
    relations: {
      user: true,
    },
    where: { user: { id } },
  });

  const user = await AppDataSource.getRepository(User).findOne({ where: { id } });

  if (classroom === undefined) return next();
  if (user && user.type === UserType.FAMILY) {
    res.json();
  } else {
    res.json(classroom);
  }
});

type CreateClassroomData = {
  userId: number;
  villageId: number;
  name?: string;
  avatar?: string;
  countryCode?: string;
  delayedDays?: number;
};

const createClassroomValidator = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'number', nullable: false },
    villageId: { type: 'number', nullable: false },
    name: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    delayedDays: { type: 'number', nullable: true },
    countryCode: { type: 'string', nullable: true },
    hasVisibilitySetToClass: { type: 'boolean', nullable: true },
  },
  required: ['userId', 'villageId'],
  additionalProperties: false,
} as JSONSchemaType<CreateClassroomData>);

/**
 * Classroom controller to create a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {object} Route API JSON response
 */

classroomController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createClassroomValidator(data)) {
    sendInvalidDataError(createClassroomValidator);
  }

  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  // Verification if the classrom already created
  // * Memo:  this logic may change in the future if teacher can have multiple classes
  const verification = await AppDataSource.getRepository(Classroom).find({
    where: { user: { id: req.user.id } },
  });
  if (verification.length !== 0) return res.status(303).send('Classroom already exit');
  const countryFound = await AppDataSource.getRepository(Country).findOne({ where: { isoCode: data.countryCode } });
  const classroom = new Classroom();
  classroom.user.id = data.userId;
  classroom.country = countryFound;
  classroom.id = data.villageId;

  // .createQueryBuilder()
  //   .insert()
  //   .into(Classroom)
  //   .values([{ user: { id: data.userId }, village: { id: data.villageId }, country: data.countryCode }])
  //   .execute();

  res.json(classroom);
});

type UpdateClassroomData = {
  name?: string;
  avatar?: string;
  delayedDays?: number;
};

const updateClassroomValidator = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    delayedDays: { type: 'number', nullable: true },
    hasVisibilitySetToClass: { type: 'boolean', nullable: true },
  },
  required: [],
  additionalProperties: false,
} as JSONSchemaType<UpdateClassroomData>);

/**
 * Classroom controller to modify a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {object} Route API JSON response
 */

classroomController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateClassroomValidator(data)) {
    sendInvalidDataError(updateClassroomValidator);
  }
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const userId = parseInt(req.params.id, 10) || 0;
  // * Memo:  this logic may change in the future if teacher can have multiple classes
  const classroom = await AppDataSource.getRepository(Classroom)
    .createQueryBuilder('classroom')
    .where('classroom.userId = :userId', { userId: userId })
    .getOne();

  if (!classroom) return next();

  classroom.avatar = data.avatar ?? classroom.avatar;
  classroom.name = data.name ?? classroom.name;
  classroom.delayedDays = data.delayedDays ?? classroom.delayedDays;
  classroom.hasVisibilitySetToClass = data.hasVisibilitySetToClass ?? classroom.hasVisibilitySetToClass;

  await AppDataSource.getRepository(Classroom).save(classroom);
  res.json(classroom);
});

/**
 * Classroom controller to delete a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {number} Route API JSON response
 */

classroomController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await AppDataSource.getRepository(Classroom).findOne({ where: { id } });
  if (!classroom || !req.user) return res.status(204).send();

  await AppDataSource.getRepository(Classroom).delete({ id });
  res.status(204).send();
});
