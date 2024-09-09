import type { NextFunction, Request, Response } from 'express';

import { TeamComment } from '../entities/teamComment';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const teamCommentController = new Controller('/team-comments');

// --- Get all comments. ---
teamCommentController.get({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const teamComments = await AppDataSource.getRepository(TeamComment).find();
  res.sendJSON(teamComments);
});

// --- Edit one comment. ---
teamCommentController.put({ path: '/:commentId', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const id = parseInt(req.params.commentId, 10) ?? 0;
  const teamComment = await AppDataSource.getRepository(TeamComment).findOne({ where: { id } });
  if (!teamComment) {
    next();
    return;
  }

  const updatedTeamComment = new TeamComment();
  updatedTeamComment.id = id;
  updatedTeamComment.text = data.text;
  await AppDataSource.getRepository(TeamComment).save(updatedTeamComment);
  res.sendJSON(updatedTeamComment);
});

export { teamCommentController };
