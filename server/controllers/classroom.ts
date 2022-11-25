import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Classroom } from '../entities/classroom';
import { UserType } from '../entities/user';
import { Controller } from './controller';

/**
 * Classroom controller
 * 1. il faut CRUD
 *  GET /classrooms/:id
 *  POST
 *  PUT /classrooms/:id
 *  DELETE /classrooms/:id
 *
 */
const classroomController = new Controller('/classrooms');

/**
 * Classroom controller to get teacher's class parameters.
 * ExpressMiddleware signature
 * @param {string} id classroom id
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

classroomController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const classroom = await getRepository(Classroom).findOne({ where: { id } });
  if (classroom === undefined) return next();
  res.json(classroom);
});

type CreateClassroomData = {};

/**
 * Classroom controller to create a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */
classroomController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  const classroom = new Classroom();
  classroom.userId = data.userId;
  classroom.villageId = data.villageId;
  classroom.name = data.name;
  classroom.avatar = data.avatar ?? null;
  classroom.delayedDays = data.delayedDays ?? null;

  await getRepository(Classroom).save(classroom);
  res.json(classroom);
});

/**
 * Classroom controller to modify a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */
classroomController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});

/**
 * Classroom controller to delete a teacher's class parameters.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */
classroomController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});
