import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { Student } from '../entities/student';
import { UserType } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { inviteCodeGenerator } from '../utils/inviteCodeGenerator';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

const studentController = new Controller('/students');

/**
 * Student controller to get student list.
 * ExpressMiddleware signature
 * @param {string} id classroom id
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

studentController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const classroomId = Number(getQueryString(req.query.classroomId)) || 0;
  const students = await AppDataSource.getRepository(Student).find({ where: { classroom: { id: classroomId } } });
  res.json(students);
});

/**
 * Student controller to get student's info.
 * ExpressMiddleware signature
 * @param {string} id student id
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

studentController.get({ path: '/:id', userType: UserType.TEACHER || UserType.FAMILY }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const student = await AppDataSource.getRepository(Student).findOne({ where: { id } });
  if (student === undefined) return next();
  res.json(student);
});

type CreateStudentData = {
  classroomId: number;
  firstname: string;
  lastname: string;
};

const createStudentValidator = ajv.compile({
  type: 'object',
  properties: {
    classroomId: { type: 'number', nullable: false },
    firstname: { type: 'string', nullable: false },
    lastname: { type: 'string', nullable: false },
  },
  required: ['classroomId'],
  additionalProperties: false,
} as JSONSchemaType<CreateStudentData>);

/**
 * Student controller to create a student.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

studentController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createStudentValidator(data)) {
    sendInvalidDataError(createStudentValidator);
  }
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  const student = new Student();
  student.classroom = data.classroomId;
  student.firstname = data.firstname ?? null;
  student.lastname = data.lastname ?? null;
  student.hashedCode = inviteCodeGenerator(10);

  const studentCreated = await AppDataSource.getRepository(Student).save(student);

  //Insert of new student in table user_to_student
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(UserToStudent)
    .values([{ student: { id: studentCreated.id } }])
    .execute();

  res.json(studentCreated);
});

//--- Update a student ---
type UpdateStudentData = {
  firstname?: string;
  lastname?: string;
};

const updateStudentValidator = ajv.compile({
  type: 'object',
  properties: {
    firstname: { type: 'string', nullable: true },
    lastname: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
} as JSONSchemaType<UpdateStudentData>);

/**
 * Student controller to modify student's info.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

studentController.put({ path: '/:id', userType: UserType.TEACHER || UserType.FAMILY }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateStudentValidator(data)) {
    sendInvalidDataError(updateStudentValidator);
  }
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const id = parseInt(req.params.id, 10) || 0;
  const student = await AppDataSource.getRepository(Student).findOne({ where: { id } });

  if (!student) return next();

  student.firstname = data.firstname ?? student.firstname;
  student.lastname = data.lastname ?? student.lastname;

  await AppDataSource.getRepository(Student).save(student);
  res.json(student);
});

/**
 * Student controller to delete student's info.
 * ExpressMiddleware signature
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @returns {string} Route API JSON response
 */

studentController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const student = await AppDataSource.getRepository(Student).findOne({ where: { id } });
  if (!student) return res.status(204).send();
  //check if student has already been associated to a parent or relative
  const isAssociated = await AppDataSource.getRepository(UserToStudent).find({ where: { student: { id: id } }, relations: { user: true } });
  if (isAssociated) {
    await AppDataSource.getRepository(UserToStudent)
      .createQueryBuilder()
      .update(UserToStudent)
      .set({ student: { id: undefined } })
      .where({ student: { id: id } })
      .execute();
    await AppDataSource.getRepository(Student).delete({ id });
  }

  res.status(204).send();
});

export { studentController };
