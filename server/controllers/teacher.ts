import type { Request, Response } from 'express';

import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { inviteCodeGenerator } from '../utils/inviteCodeGenerator';
import { Controller } from './controller';

export const teacherController = new Controller('/teachers');

/**
 * Endpoint to create a unique invite code for a teacher
 * @return {string} JSON Response invite code
 */
teacherController.get({ path: '/invite', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }
  const inviteCode = inviteCodeGenerator(10);
  res.json({ inviteCode: inviteCode });
});
