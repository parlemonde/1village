import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { sendMail, Email } from '../emails/index';
import { Activity } from '../entities/activity';
import { Comment } from '../entities/comment';
import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

const commentController = new Controller('/comments');

// --- Get all comments. ---
commentController.get({ path: '', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.id, 10) ?? 0;
  const comments = await AppDataSource.getRepository(Comment).find({ where: { activityId }, order: { createDate: 'ASC' } });
  res.sendJSON(comments);
});

// --- Get one comment. ---
commentController.get({ path: '/:commentId', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  const activityId = parseInt(req.params.id, 10) ?? 0;
  const id = parseInt(req.params.commentId, 10) ?? 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const comment = await AppDataSource.getRepository(Comment).findOne({ where: { id, activityId } });
  if (activity === null || comment === null) {
    next();
    return;
  }
  if (req.user && req.user.type === UserType.TEACHER && req.user.villageId !== activity.villageId) {
    next();
    return;
  }
  res.sendJSON(comment);
});

// --- Add one comment. ---
type AddCommentData = {
  text: string;
};
const ADD_DATA_SCHEMA: JSONSchemaType<AddCommentData> = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      nullable: false,
    },
  },
  required: ['text'],
  additionalProperties: false,
};
const addCommentDataValidator = ajv.compile(ADD_DATA_SCHEMA);

commentController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!addCommentDataValidator(data)) {
    sendInvalidDataError(addCommentDataValidator);
    return;
  }
  const activityId = parseInt(req.params.id, 10) ?? 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  if (activity === null || (req.user && req.user.type === UserType.TEACHER && req.user.villageId !== activity.villageId)) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  // Ici on vient mettre notre listener pour envoyer une notif
  // à l'utilisateur qui a publié l'activité
  // dans activity il y a userId donc on connait le user qui a publié l'activité
  // on peut donc envoyer une notif à cet utilisateur en disant que c'est req.userId qui a commenté

  const newComment = new Comment();
  newComment.activityId = activityId;
  newComment.userId = req.user?.id ?? 0;
  newComment.text = data.text;
  await AppDataSource.getRepository(Comment).save(newComment);

  res.sendJSON(newComment);
});

// --- Edit one comment. ---
commentController.put({ path: '/:commentId', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!addCommentDataValidator(data)) {
    sendInvalidDataError(addCommentDataValidator);
    return;
  }
  const activityId = parseInt(req.params.id, 10) ?? 0;
  const id = parseInt(req.params.commentId, 10) ?? 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const comment = await AppDataSource.getRepository(Comment).findOne({ where: { id, activityId } });
  if (activity === null || comment === null || (req.user && req.user.type === UserType.TEACHER && req.user.villageId !== activity.villageId)) {
    next();
    return;
  }

  const updatedComment = new Comment();
  updatedComment.id = id;
  updatedComment.text = data.text;
  await AppDataSource.getRepository(Comment).save(updatedComment);
  res.sendJSON(updatedComment);
});

// --- Delete a comment. ---
commentController.delete({ path: '/:commentId', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.id, 10) ?? 0;
  const id = parseInt(req.params.commentId, 10) ?? 0;
  if (req.user && req.user.type <= UserType.ADMIN) {
    await AppDataSource.getRepository(Comment).delete({ id, activityId });
  } else {
    await AppDataSource.getRepository(Comment).delete({ id, activityId, userId: req.user?.id ?? 0 });
  }
  res.status(204).send();
});

// --- Test email sending ---

commentController.post({ path: '/mail' }, async (req: Request, res: Response) => {
  const data = req.body;
  console.log('================================================', data);

  try {
    await sendMail(Email.TEST, data.email, { text: 'This is a test email.' });
    res.send('Test email sent successfully!');
  } catch (error) {
    res.status(500).send(`Error sending test email: ${error.message}`);
  }
});

export { commentController };
