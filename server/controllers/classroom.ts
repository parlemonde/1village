import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Classroom } from '../entities/classroom';
import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

export const classroomController = new Controller('/classrooms');

/**
 * Classroom controller to get teacher's class parameters.
 * ExpressMiddleware signature
 * @param {string} id classroom id
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {string} Route API JSON response
 */

classroomController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await getRepository(Classroom).findOne({ where: { id } });
  if (classroom === undefined) return next();
  res.json(classroom);
});

type CreateClassroomData = {
  userId: number;
  villageId: number;
  name?: string;
  avatar?: string;
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
  },
  required: ['userId', 'villageId'],
  additionalProperties: false,
} as JSONSchemaType<CreateClassroomData>);

/**
 * Classroom controller to create a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {string} Route API JSON response
 */

classroomController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createClassroomValidator(data)) {
    sendInvalidDataError(createClassroomValidator);
  }
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  const classroom = new Classroom();
  classroom.userId = data.userId;
  classroom.villageId = data.villageId;
  classroom.name = data.name;
  classroom.avatar = data.avatar ?? null;
  classroom.delayedDays = data.delayedDays ?? null;

  await getRepository(Classroom).save(classroom);
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
  },
  required: [],
  additionalProperties: false,
} as JSONSchemaType<UpdateClassroomData>);

/**
 * Classroom controller to modify a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

classroomController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateClassroomValidator(data)) {
    sendInvalidDataError(updateClassroomValidator);
  }
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await getRepository(Classroom).findOne({ where: { id } });

  if (!classroom) return next();

  classroom.avatar = data.avatar ?? classroom.avatar;
  classroom.delayedDays = data.delayedDays ?? classroom.delayedDays;
  classroom.name = data.name ?? classroom.name;

  await getRepository(Classroom).save(classroom);
  res.json(classroom);
});

/**
 * Classroom controller to delete a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @return {string} Route API JSON response
 */

classroomController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await getRepository(Classroom).findOne({ where: { id } });
  if (!classroom || !req.user) return res.status(204).send();

  await getRepository(Classroom).delete({ id });
  res.status(204).send();
});
