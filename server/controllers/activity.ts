import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { IsNull } from 'typeorm';

import type { Track } from '../../types/anthem.type';
import { TrackType } from '../../types/anthem.type';
import type { GameData, GamesData } from '../../types/game.type';
import type { StoriesData, StoryElement } from '../../types/story.type';
import { ImageType } from '../../types/story.type';
import { buildAudioMix } from '../audioMix/buildAudioMix';
import type { AnyData, ActivityContent } from '../entities/activity';
import { Activity, ActivityType, ActivityStatus } from '../entities/activity';
import { Comment } from '../entities/comment';
import { Game } from '../entities/game';
import { Image } from '../entities/image';
import { UserType } from '../entities/user';
import { VillagePhase } from '../entities/village';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { commentController } from './comment';
import { Controller } from './controller';

const activityController = new Controller('/activities');

type ActivityGetter = {
  limit?: number;
  page?: number;
  phase?: number | null;
  villageId?: number;
  type?: string[];
  subType?: number | null;
  countries?: string[];
  pelico?: boolean;
  userId?: number;
  status?: number;
  responseActivityId?: number;
  delayedDays?: number;
  hasVisibilitySetToClass?: boolean;
  teacherId?: number;
  visibleToParent: boolean;
};

const getActivitiesCommentCount = async (ids: number[]): Promise<{ [key: number]: number }> => {
  if (ids.length === 0) {
    return {};
  }
  const queryBuilder = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .select('activity.id')
    .addSelect('IFNULL(`commentCount`, 0) + IFNULL(`activityCount`, 0)', 'comments')
    .leftJoin(
      (qb) => {
        qb.select('comment.activityId', 'cid').addSelect('COUNT(comment.id)', 'commentCount').from(Comment, 'comment').groupBy('comment.activityId');
        return qb;
      },
      'comments',
      '`comments`.`cid` = activity.id',
    )
    .leftJoin(
      (qb) => {
        qb.select('activity.responseActivityId', 'aid')
          .addSelect('COUNT(activity.id)', 'activityCount')
          .from(Activity, 'activity')
          .where('activity.status != :status', { status: `${ActivityStatus.DRAFT}` })
          .groupBy('activity.responseActivityId');
        return qb;
      },
      'activities',
      '`activities`.`aid` = activity.id',
    )
    .where('activity.id in (:ids)', { ids })
    .getRawMany();
  return queryBuilder.reduce((acc, row) => {
    acc[row.activity_id] = parseInt(row.comments, 10) || 0;
    return acc;
  }, {});
};

const getActivities = async ({
  limit = 200,
  page = 0,
  villageId,
  type = [],
  subType = null,
  countries,
  phase = null,
  pelico = true,
  status = 0,
  userId,
  responseActivityId,
  delayedDays,
  hasVisibilitySetToClass,
  teacherId,
  visibleToParent,
}: ActivityGetter) => {
  // get ids
  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').where('activity.status = :status', { status });
  if (villageId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.villageId = :villageId', { villageId });
  }
  if (type.length > 0) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.type IN (:type)', { type });
  }
  if (subType !== null) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.subType = :subType', { subType });
  }
  if (phase !== null) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.phase = :phase', { phase });
  }
  if (delayedDays !== undefined) {
    // * Memo: we only select activity with updateDate + delayedDays lesser than current date
    subQueryBuilder = subQueryBuilder.andWhere(`DATE_ADD(activity.updateDate, INTERVAL :delayedDays DAY) <= CURDATE()`, { delayedDays: delayedDays });
  }
  if (visibleToParent) {
    // * Here if user is a parent, we only select activities with the attribute is set to true
    subQueryBuilder = subQueryBuilder.andWhere('activity.isVisibleToParent = :visibleToParent', { visibleToParent });
  }
  if (hasVisibilitySetToClass !== undefined && teacherId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.user = :teacherId', { teacherId: teacherId });
  }

  if (responseActivityId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.responseActivityId = :responseActivityId', { responseActivityId });
  } else if (userId !== undefined) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.id = :userId', {
      userId,
    });
  } else if (pelico && countries !== undefined && countries.length > 0) {
    subQueryBuilder = subQueryBuilder
      .innerJoin('activity.user', 'user')
      .andWhere('((user.countryCode IN (:countries) AND user.type >= :userType) OR user.type <= :userType2)', {
        countries,
        userType: UserType.TEACHER,
        userType2: UserType.MEDIATOR,
      });
  } else if (pelico && countries !== undefined && countries.length === 0) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.type <= :userType2', {
      userType2: UserType.MEDIATOR,
    });
  } else if (!pelico && countries !== undefined && countries.length > 0) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.countryCode IN (:countries) AND user.type >= :userType', {
      countries,
      userType: UserType.TEACHER,
    });
  } else if (!pelico && countries !== undefined) {
    return [];
  }

  const activities = await subQueryBuilder
    .orderBy('activity.isPinned', 'DESC')
    .addOrderBy('activity.updateDate', 'DESC')
    .limit(limit)
    .offset(page * limit)
    .getMany();

  const ids = activities.map((a) => a.id);
  if (ids.length === 0) {
    return [];
  }

  const comments = await getActivitiesCommentCount(ids);
  for (const activity of activities) {
    if (comments[activity.id] !== undefined) {
      activity.commentCount = comments[activity.id];
    } else {
      activity.commentCount = 0;
    }
  }
  return activities;
};

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
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound'] },
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
  phase?: number;
  responseActivityId?: number;
  responseType?: number;
  isPinned?: boolean;
  displayAsUser?: boolean;
  data?: AnyData;
  content?: ActivityContent[];
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
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound'] },
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

  // Check if we need to build the audio mix for the anthem
  if (activity.type === ActivityType.ANTHEM && data.data !== undefined && areAnthemTracksNew(data.data, activity.data)) {
    const verseTracks = (data.data.tracks as Track[]).filter(
      (t) => t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO && t.sampleUrl !== '',
    );
    data.data.mixUrl = verseTracks.length > 0 ? buildAudioMix(activity.userId, verseTracks) : ''; // without intro and outro

    const intro = (data.data.tracks as Track[]).find((t) => t.type === TrackType.INTRO_CHORUS && t.sampleUrl !== '');
    const outro = (data.data.tracks as Track[]).find((t) => t.type === TrackType.OUTRO && t.sampleUrl !== '');
    const fullTracks = [];
    if (intro && intro.sampleUrl) {
      fullTracks.push(intro);
      fullTracks.push(...verseTracks.map((t) => ({ ...t, sampleStartTime: (t.sampleStartTime || 0) + (intro.sampleDuration || 0) })));
    } else {
      fullTracks.push(...verseTracks);
    }
    if (outro && outro.sampleUrl) {
      fullTracks.push({ ...outro, sampleStartTime: Math.max(...fullTracks.map((t) => (t.sampleStartTime || 0) + (t.sampleDuration || 0))) });
    }
    data.data.fullMixUrl = fullTracks.length > 0 ? buildAudioMix(activity.userId, fullTracks) : ''; // with intro and outro
  }

  // Check if we need to build the audio mix for the class verse
  if (activity.type === ActivityType.CLASS_ANTHEM && data.data !== undefined) {
    const tracks = (data.data.anthemTracks as Track[]).filter((t) => t.sampleUrl !== '');
    const intro = (data.data.anthemTracks as Track[]).find((t) => t.type === TrackType.INTRO_CHORUS && t.sampleUrl !== '');

    if (!data.data.verseMixUrl) {
      const verseTracks = tracks.filter((t) => t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO);

      data.data.verseMixWithVocalsUrl = buildAudioMix(activity.userId, verseTracks);
      data.data.verseMixUrl = buildAudioMix(
        activity.userId,
        verseTracks.filter((t) => t.type !== TrackType.VOCALS),
      );
      data.data.verseMixWithIntroUrl = buildAudioMix(
        activity.userId,
        tracks
          .filter((t) => t.type !== TrackType.VOCALS && t.type !== TrackType.OUTRO)
          .map((t) => ({ ...t, sampleStartTime: t.type !== TrackType.INTRO_CHORUS && intro ? intro.sampleDuration : 0 })),
      );
    }

    if ((data.data.classRecordTrack as Track).sampleUrl) {
      const fullTracks = tracks.filter((t) => t.type !== TrackType.VOCALS && t.type !== TrackType.INTRO_CHORUS && t.type !== TrackType.OUTRO);
      fullTracks.push(data.data.classRecordTrack as Track);

      data.data.verseFinalMixUrl = buildAudioMix(activity.userId, fullTracks);
      data.data.slicedRecordUrl = buildAudioMix(activity.userId, [data.data.classRecordTrack as Track, data.data.classRecordTrack as Track]);
    }
  }

  if (activity.status !== ActivityStatus.PUBLISHED) {
    activity.phase = data.phase || activity.phase;
  }
  activity.status = data.status ?? activity.status;
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

const areAnthemTracksNew = (oldData: AnyData, newData: AnyData): boolean => {
  const oldTracks = oldData.tracks as Track[]; // A changer
  const newTracks = newData.tracks as Track[]; // A changer

  const oldTracksMap = oldTracks.reduce<Record<string, { sampleStartTime?: number; sampleVolume?: number }>>((acc, track) => {
    if (track.sampleUrl) {
      acc[track.sampleUrl] = {
        sampleStartTime: track.sampleStartTime,
        sampleVolume: track.sampleVolume,
      };
    }
    return acc;
  }, {});
  const newTracksMap = newTracks.reduce<Record<string, { sampleStartTime?: number; sampleVolume?: number }>>((acc, track) => {
    if (track.sampleUrl) {
      acc[track.sampleUrl] = {
        sampleStartTime: track.sampleStartTime,
        sampleVolume: track.sampleVolume,
      };
    }
    return acc;
  }, {});

  return JSON.stringify(oldTracksMap) !== JSON.stringify(newTracksMap);
};

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
