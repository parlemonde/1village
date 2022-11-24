import type { NextFunction, Request, Response } from 'express';

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
const classroomController = new Controller('/classroom');

classroomController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});
classroomController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});
classroomController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});
classroomController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  res.json();
});
