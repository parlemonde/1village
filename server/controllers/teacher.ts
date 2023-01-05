import type { NextFunction, Request, Response } from 'express';

import { Activity } from '../entities/activity';
import { UserType } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { AppDataSource } from '../utils/data-source';
import { inviteCodeGenerator } from '../utils/inviteCodeGenerator';
import { Controller } from './controller';

export const teacherController = new Controller('/teachers');

/**

 * Endpoint to create a unique invite code for a teacher

 * @param {object} req Express request object

 * @param {object} res Express response object

 * @return {string} JSON Response invite code

 */

teacherController.get({ path: '/invite', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const inviteCode = inviteCodeGenerator(10);

  res.json({ inviteCode: inviteCode });
});

/**

 * Endpoint to change the visibility for one activity

 * @param {object} req Express request object

 * @param {object} res Express response object

 * @return {string} JSON Response invite code

 */

teacherController.put(
  { path: '/set-activity-visibility/:id', userType: UserType.TEACHER },

  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Forbidden', ErrorCode.UNKNOWN);
    }

    //Doc : https://orkhan.gitbook.io/typeorm/docs/update-query-builder

    const activityId = parseInt(req.params.id, 10) || 0;

    const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });

    if (!activity) return next();

    await AppDataSource.createQueryBuilder()

      .update(Activity)

      .set({ isVisibleToParent: !activity.isVisibleToParent })

      .where('id = :id', { id: activityId })

      .execute();

    res.status(204).send();
  },
);

/**

 * Endpoint to delete a student's parent attach to the profil for the teacher and his classroom

 * @param {object} req Express request object

 * @param {object} res Express response object

 * @return {number} Route API JSON response

 */

teacherController.delete({ path: '/detach/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const userId = parseInt(req.params.id, 10) || 0;

  const studentId = parseInt(req.params.studentId);

  const student = await AppDataSource.getRepository(UserToStudent).find({ where: { userId: userId, studentId: studentId } });

  if (!student) return res.status(204).send();

  await AppDataSource.getRepository(UserToStudent)

    .createQueryBuilder('UserToStudent')

    .delete()

    .from(UserToStudent)

    .where({ userId: userId, studentId: studentId })

    .execute();

  res.status(204).send();
});
