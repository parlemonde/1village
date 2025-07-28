import type { NextFunction, Request, Response } from 'express';

import { TeamCommentEntity } from '../entities/teamComment';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const teamCommentController = new Controller('/team-comments');
const teamCommentRepository = AppDataSource.getRepository(TeamCommentEntity);

teamCommentController.get({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const { type } = req.query;
  const where = type ? { type: Number(type) } : {};

  const teamComments = await teamCommentRepository.find({ where });

  res.sendJSON(teamComments);
});

teamCommentController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const { type, comment } = req.body;

  const teamComment = teamCommentRepository.create({
    type: Number(type),
    comment,
  });

  const savedTeamComment = await teamCommentRepository.save(teamComment);
  res.sendJSON(savedTeamComment);
});

teamCommentController.put({ path: '/:commentId', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const id = parseInt(req.params.commentId, 10) ?? 0;
  const teamComment = await teamCommentRepository.findOne({ where: { id } });

  if (!teamComment) {
    next();
    return;
  }

  teamComment.comment = data.comment;
  const updatedTeamComment = await teamCommentRepository.save(teamComment);

  res.sendJSON(updatedTeamComment);
});

export { teamCommentController };
