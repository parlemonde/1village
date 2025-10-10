import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import { getAccessToken } from '../authentication/lib/tokens';
import { Email, sendMail } from '../emails';
import { EnumMailType, hasSubscribed, getEmailInformation, activityNameMapper, emailMapping } from '../emails/checkSubscribe';
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

  const newComment = new Comment();
  newComment.activityId = activityId;
  newComment.userId = req.user?.id ?? 0;
  newComment.text = data.text;

  try {
    const savedComment = await AppDataSource.getRepository(Comment).save(newComment);

    const { activityId, userId } = savedComment;
    const emailInformation = await getEmailInformation(activityId, userId, EnumMailType.COMMENTARY);
    const emailType = emailMapping[emailInformation.column];
    const shouldSendMail = hasSubscribed({ ...emailInformation, emailType });
    if (shouldSendMail) {
      const activityType = emailInformation?.activity?.type || 0;
      const activityName: string = activityNameMapper[activityType];
      const userName = emailInformation.classInformation || '';
      const { accessToken } = await getAccessToken(emailInformation.activityCreator?.id || 0, false);

      await sendMail(Email.COMMENT_NOTIFICATION, emailInformation?.activityCreator?.email || '', {
        userWhoComment: userName,
        activityType: activityName,
        url: `https://1v.parlemonde.org/activite/${activityId}`,
        token: accessToken,
      });
    }

    res.sendJSON(savedComment);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du commentaire:", error);
    res.status(500).send("Erreur lors de l'enregistrement du commentaire");
  }
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

export { commentController };
