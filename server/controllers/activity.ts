import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { IsNull } from 'typeorm';

import type { ActivityContent, AnyData } from '../../types/activity.type';
import { EPhase1Steps, ActivityStatus, ActivityType, EPhase2Steps, EPhase3Steps } from '../../types/activity.type';
import type { GameData, GamesData } from '../../types/game.type';
import type { StoriesData, StoryElement } from '../../types/story.type';
import { ImageType } from '../../types/story.type';
import { hasSubscribed } from '../emails/checkSubscribe';
import { Activity } from '../entities/activity';
import { Game } from '../entities/game';
import { Image } from '../entities/image';
import { UserType } from '../entities/user';
import { VillagePhase } from '../entities/village';
import { getActivities, getActivitiesCommentCount } from '../manager/activity';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { commentController } from './comment';
import { Controller } from './controller';

const activityController = new Controller('/activities');

// --- Get all activities. ---
activityController.get({ path: '', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Forbidden', ErrorCode.UNKNOWN);

  const activities = await getActivities({
    limit: req.query.limit ? Number(getQueryString(req.query.limit)) || 200 : undefined,
    page: req.query.page ? Number(getQueryString(req.query.page)) || 0 : undefined,
    villageId: req.query.villageId ? Number(getQueryString(req.query.villageId)) || 0 : undefined,
    countries:
      req.query.countries !== undefined
        ? req.query.countries.length === 0
          ? []
          : (getQueryString(req.query.countries) || '').split(',')
        : undefined,
    pelico: req.query.pelico ? req.query.pelico !== 'false' : undefined,
    type: req.query.type ? (getQueryString(req.query.type) || '').split(',') : undefined,
    subType: req.query.subType ? Number(getQueryString(req.query.subType)) || 0 : undefined,
    phase: req.query.phase ? Number(getQueryString(req.query.phase)) || 0 : undefined,
    phaseStep: req.query.phaseStep ? String(req.query.phaseStep) : undefined,
    status: req.query.status ? Number(getQueryString(req.query.status)) || 0 : undefined,
    userId: req.query.userId ? Number(getQueryString(req.query.userId)) || 0 : undefined,
    responseActivityId: req.query.responseActivityId ? Number(getQueryString(req.query.responseActivityId)) || 0 : undefined,
    delayedDays: req.query.delayedDays && req.query.delayedDays !== '0' ? Number(getQueryString(req.query.delayedDays)) : undefined,
    hasVisibilitySetToClass: req.query.hasVisibilitySetToClass === 'true' ? true : undefined,
    teacherId: req.query.teacherId ? Number(getQueryString(req.query.teacherId)) : undefined,
    visibleToParent: req.user.type === UserType.FAMILY ? true : false,
  });
  res.sendJSON(activities);
});

// --- Get one activity. ---
activityController.get({ path: '/:id', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({
    where: { id },
  });
  if (activity === null) {
    next();
    return;
  }
  if (req.user && req.user.type === UserType.TEACHER && req.user.villageId !== activity.villageId) {
    next();
    return;
  }
  const commentCount = await getActivitiesCommentCount([activity.id]);
  activity.commentCount = commentCount[activity.id] || 0;
  res.sendJSON(activity);
});

// --- Get draft activity for type and subtype  ---
activityController.get({ path: '/draft', userType: UserType.OBSERVATOR }, async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.villageId === undefined || req.query.type === undefined) {
    next();
    return;
  }

  const search: { userId: number; villageId: number; type: number; status: number; subType?: number } = {
    userId: req.user?.id ?? 0,
    villageId: req.query.villageId ? Number(getQueryString(req.query.villageId)) || 0 : 0,
    type: req.query.type ? Number(getQueryString(req.query.type)) || 0 : 0,
    status: ActivityStatus.DRAFT,
  };
  if (req.query.subType !== undefined) {
    search.subType = req.query.subType ? Number(getQueryString(req.query.subType)) || 0 : 0;
  }
  const activity = await AppDataSource.getRepository(Activity).findOne({
    where: search,
  });
  res.sendJSON({ draft: activity || null });
});

activityController.get({ path: '/mascotte', userType: UserType.OBSERVATOR }, async (req, res, next) => {
  if (!req.user || req.user.type <= UserType.MEDIATOR) {
    // no mascotte for pelico
    next();
    return;
  }
  const activity = await AppDataSource.getRepository(Activity).findOne({
    where: {
      userId: req.user.id,
      type: ActivityType.MASCOTTE,
      status: ActivityStatus.PUBLISHED,
    },
  });
  if (activity) {
    const commentCount = await getActivitiesCommentCount([activity.id]);
    activity.commentCount = commentCount[activity.id] || 0;
    res.sendJSON(activity);
  } else {
    next();
  }
});

// --- Create an activity ---
type CreateActivityData = {
  type: number;
  subType?: number | null;
  status?: number;
  data: AnyData;
  phase?: number;
  content: ActivityContent[];
  villageId?: number;
  responseActivityId?: number;
  responseType?: number;
  isPinned?: boolean;
  displayAsUser?: boolean;
};

// --- create activity's schema ---
const CREATE_SCHEMA: JSONSchemaType<CreateActivityData> = {
  type: 'object',
  properties: {
    type: {
      type: 'number',
    },
    subType: {
      type: 'number',
      nullable: true,
    },
    status: {
      type: 'number',
      nullable: true,
    },
    phase: {
      type: 'number',
      nullable: true,
    },
    data: {
      type: 'object',
      additionalProperties: true,
      nullable: false,
    },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: false },
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
      nullable: false,
    },
    villageId: { type: 'number', nullable: true },
    responseActivityId: { type: 'number', nullable: true },
    responseType: {
      type: 'number',
      nullable: true,
    },
    isPinned: { type: 'boolean', nullable: true },
    displayAsUser: { type: 'boolean', nullable: true },
  },
  required: ['type', 'data', 'content'],
  additionalProperties: false,
};

// --- validate activity's schema ---
const createActivityValidator = ajv.compile(CREATE_SCHEMA);

activityController.post({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createActivityValidator(data)) {
    sendInvalidDataError(createActivityValidator);
    return;
  }

  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const villageId = req.user.type <= UserType.MEDIATOR ? data.villageId || req.user.villageId || null : req.user.villageId || null;
  if (villageId === null) {
    throw new AppError('Invalid data, missing village Id', ErrorCode.INVALID_DATA);
  }

  // Delete old draft if needed.
  if (data.status === ActivityStatus.PUBLISHED || data.status === ActivityStatus.DRAFT) {
    await AppDataSource.getRepository(Activity).delete({
      userId: req.user.id,
      villageId,
      type: data.type,
      subType: data.subType ?? IsNull(),
      status: ActivityStatus.DRAFT,
    });
  }

  const activity = new Activity();
  activity.type = data.type;
  activity.subType = data.subType ?? null;
  activity.status = data.status ?? ActivityStatus.PUBLISHED;
  activity.data = data.data;
  activity.phase = data.phase || VillagePhase.DISCOVER;
  activity.content = data.content;
  activity.userId = req.user.id;
  activity.villageId = villageId;
  activity.responseActivityId = data.responseActivityId ?? null;
  activity.responseType = data.responseType ?? null;
  activity.isPinned = data.isPinned || false;
  activity.displayAsUser = data.displayAsUser || false;

  await AppDataSource.getRepository(Activity).save(activity);

  res.sendJSON(activity);
});

// --- Update activity ---
type UpdateActivity = {
  status?: number;
  phase?: 1 | 2 | 3;
  responseActivityId?: number;
  responseType?: number;
  isPinned?: boolean;
  displayAsUser?: boolean;
  data?: AnyData;
  content?: ActivityContent[];
  phaseStep?: string;
};

const UPDATE_A_SCHEMA: JSONSchemaType<UpdateActivity> = {
  type: 'object',
  properties: {
    status: {
      type: 'number',
      nullable: true,
    },
    phase: {
      type: 'number',
      nullable: true,
    },
    phaseStep: {
      type: 'string',
      nullable: true,
    },
    responseActivityId: { type: 'number', nullable: true },
    responseType: {
      type: 'number',
      nullable: true,
    },
    isPinned: { type: 'boolean', nullable: true },
    displayAsUser: { type: 'boolean', nullable: true },
    data: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
    },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: false },
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};

const updateActivityValidator = ajv.compile(UPDATE_A_SCHEMA);

activityController.put({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;

  if (!updateActivityValidator(data)) {
    sendInvalidDataError(updateActivityValidator);
    return;
  }

  if (!req.user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const id = parseInt(req.params.id, 10) || 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id } });
  if (activity === null) {
    next();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type > UserType.ADMIN) {
    next();
    return;
  }

  if (activity.status !== ActivityStatus.PUBLISHED) {
    if (data.phase) activity.phase = data.phase;
    if (data.phaseStep) {
      switch (activity.phase) {
        case 1: {
          if (Object.values(EPhase1Steps).includes(data.phaseStep as EPhase1Steps)) activity.phaseStep = data.phaseStep;
          else throw new AppError(`Phase step: ${data.phaseStep} isn't part of phase 1`, ErrorCode.INVALID_DATA);
          break;
        }
        case 2: {
          if (Object.values(EPhase2Steps).includes(data.phaseStep as EPhase2Steps)) activity.phaseStep = data.phaseStep;
          else throw new AppError(`Phase step: ${data.phaseStep} isn't part of phase 2`, ErrorCode.INVALID_DATA);
          break;
        }
        case 3: {
          if (Object.values(EPhase3Steps).includes(data.phaseStep as EPhase3Steps)) activity.phaseStep = data.phaseStep;
          else throw new AppError(`Phase step: ${data.phaseStep} isn't part of phase 3`, ErrorCode.INVALID_DATA);
          break;
        }
        default:
          break;
      }
    }
  }
  if (data.status === 0 && activity.status !== 0) {
    activity.status = data.status;
    activity.publishDate = new Date();
  }
  activity.responseActivityId = data.responseActivityId !== undefined ? data.responseActivityId : activity.responseActivityId ?? null;
  activity.responseType = data.responseType !== undefined ? data.responseType : activity.responseType ?? null;
  activity.isPinned = data.isPinned !== undefined ? data.isPinned : activity.isPinned;
  activity.displayAsUser = data.displayAsUser !== undefined ? data.displayAsUser : activity.displayAsUser;
  activity.data = data.data ?? activity.data;
  activity.content = data.content ?? activity.content;

  // logic to create a activity game
  if (activity.type === ActivityType.GAME && activity.status === ActivityStatus.PUBLISHED && activity.data) {
    const gamesData = activity.data as GamesData;
    gamesData.game1.gameId = (await createGame(gamesData.game1, activity)).id;
    gamesData.game2.gameId = (await createGame(gamesData.game2, activity)).id;
    gamesData.game3.gameId = (await createGame(gamesData.game3, activity)).id;
  }

  // logic to create activity image
  if (
    (activity.type === ActivityType.STORY || activity.type === ActivityType.RE_INVENT_STORY) &&
    activity.status === ActivityStatus.PUBLISHED &&
    activity.data
  ) {
    const imagesData = activity.data as Omit<StoriesData, 'tale'>;
    //Save to image table only if ActivityType.STORY or ActivityType.RE_INVENT_STORY has new images
    if (!imagesData.object.imageId && imagesData.object.inspiredStoryId) {
      imagesData.object.imageId = (await createStory(imagesData.object, activity, ImageType.OBJECT, imagesData.object.inspiredStoryId)).id;
    }
    if (!imagesData.place.imageId && imagesData.place.inspiredStoryId) {
      imagesData.place.imageId = (await createStory(imagesData.place, activity, ImageType.PLACE, imagesData.place.inspiredStoryId)).id;
    }
    if (!imagesData.odd.imageId && imagesData.odd.inspiredStoryId) {
      imagesData.odd.imageId = (await createStory(imagesData.odd, activity, ImageType.ODD, imagesData.odd.inspiredStoryId)).id;
    }
  }

  // check and send an email notification to the user who created the activity
  const { userId } = activity;
  const activityId = activity.id;
  hasSubscribed(activityId, userId, 'reaction');

  await AppDataSource.getRepository(Activity).save(activity);
  res.sendJSON(activity);
});

activityController.put({ path: '/:id/askSame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  }

  const id = parseInt(req.params.id, 10) || 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id } });
  if (activity === null || activity.type !== ActivityType.QUESTION || activity.userId === user.id) {
    next();
    return;
  }
  // TODO: When we change the type of askSame from stringt to array of number, we have to change the type here as well
  const askSame = !activity.data.askSame ? [] : ((activity.data.askSame as string) || '').split(',').map((n) => parseInt(n, 10) || 0);
  // activity.data = data.data ?? activity.data;
  const index = askSame.findIndex((i) => i === user.id);
  if (index !== -1) {
    askSame.splice(index, 1);
  } else {
    askSame.push(user.id);
  }

  activity.data.askSame = askSame.join(',');
  await AppDataSource.getRepository(Activity).save(activity);
  res.sendJSON(activity);
});

// --- create a game ---
const createGame = async (data: GameData, activity: Activity): Promise<Game> => {
  const id = data.gameId;
  const game = id ? await AppDataSource.getRepository(Game).findOneOrFail({ where: { id: data.gameId || 0 } }) : new Game();
  delete data['gameId'];
  game.activityId = activity.id;
  game.villageId = activity.villageId;
  game.userId = activity.userId;
  game.type = activity.subType;
  game.signification = data.signification;
  game.fakeSignification1 = data.fakeSignification1;
  game.fakeSignification2 = data.fakeSignification2;
  game.origine = data.origine;
  game.video = data.video;
  await AppDataSource.getRepository(Game).save(game);
  return game;
};

// --- create a image ---
const createStory = async (data: StoryElement, activity: Activity, type: ImageType, inspiredStoryId: number = 0): Promise<Image> => {
  const id = data.imageId;
  const storyImage = id ? await AppDataSource.getRepository(Image).findOneOrFail({ where: { id: data.imageId || 0 } }) : new Image();
  // delete data['imageId'];
  storyImage.activityId = activity.id;
  storyImage.villageId = activity.villageId;
  storyImage.userId = activity.userId;
  storyImage.imageType = type;
  storyImage.imageUrl = data.imageUrl;
  storyImage.inspiredStoryId = inspiredStoryId;
  await AppDataSource.getRepository(Image).save(storyImage);
  return storyImage;
};

// --- Delete an activity --- (Soft delete)
activityController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id } });
  if (activity === null || req.user === undefined) {
    res.status(204).send();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type > UserType.ADMIN) {
    res.status(204).send();
    return;
  }

  if (activity.status === ActivityStatus.DRAFT) {
    // No soft delete for drafts.
    await AppDataSource.getRepository(Activity).delete({ id });
  } else {
    await AppDataSource.getRepository(Activity).softDelete({ id });
  }
  res.status(204).send();
});

// --- Add comment controllers
activityController.router.use(`/:id${commentController.name}`, commentController.router);

export { activityController };
