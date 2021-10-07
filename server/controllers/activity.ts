import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import type { AnyData, ActivityContent } from '../entities/activity';
import { Activity, ActivityType, ActivityStatus } from '../entities/activity';
import { Comment } from '../entities/comment';
import { Mimique } from '../entities/mimique';
import { UserType } from '../entities/user';
import { VillagePhase } from '../entities/village';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { getQueryString } from '../utils';

import { commentController } from './comment';
import { Controller } from './controller';

// what's this for?
const activityController = new Controller('/activities');

// different activities' definition
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
};

// don't understand this one
const getActivitiesCommentCount = async (ids: number[]): Promise<{ [key: number]: number }> => {
  if (ids.length === 0) {
    return {};
  }
  const queryBuilder = await getRepository(Activity)
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

// check if the activities meet the requirements. If they do, then get all activities an then their ids
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
}: ActivityGetter) => {
  // get ids
  let subQueryBuilder = getRepository(Activity).createQueryBuilder('activity').where('activity.status = :status', { status });
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
  if (responseActivityId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.responseActivityId = :responseActivityId', { responseActivityId });
  } else if (userId !== undefined) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.id = :userId', {
      userId,
    });
  } else if (pelico && countries !== undefined && countries.length > 0) {
    subQueryBuilder = subQueryBuilder
      .innerJoin('activity.user', 'user')
      .andWhere('((user.countryCode IN (:countries) AND user.type <= :userType) OR user.type >= :userType2)', {
        countries,
        userType: UserType.OBSERVATOR,
        userType2: UserType.MEDIATOR,
      });
  } else if (pelico && countries !== undefined && countries.length === 0) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.type >= :userType2', {
      userType2: UserType.MEDIATOR,
    });
  } else if (!pelico && countries !== undefined && countries.length > 0) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.countryCode IN (:countries) AND user.type <= :userType', {
      countries,
      userType: UserType.OBSERVATOR,
    });
  } else if (!pelico && countries !== undefined) {
    return [];
  }

  const activities = await subQueryBuilder
    .orderBy('activity.createDate', 'DESC')
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
activityController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
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
  });
  res.sendJSON(activities);
});

// --- Get one activity. ---
activityController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await getRepository(Activity).findOne({
    where: { id },
  });
  if (activity === undefined) {
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
activityController.get({ path: '/draft', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.villageId === undefined || req.query.type === undefined) {
    next();
    return;
  }

  const search: { userId: number; villageId: number; type: string; status: string; subType?: number } = {
    userId: req.user?.id ?? 0,
    villageId: req.query.villageId ? Number(getQueryString(req.query.villageId)) || 0 : 0,
    type: `${req.query.type ? Number(getQueryString(req.query.type)) || 0 : 0}`,
    status: `${ActivityStatus.DRAFT}`,
  };
  if (req.query.subType !== undefined) {
    search.subType = req.query.subType ? Number(getQueryString(req.query.subType)) || 0 : 0;
  }
  const activity = await getRepository(Activity).findOne({
    where: search,
  });
  res.sendJSON({ draft: activity || null });
});

activityController.get({ path: '/mascotte', userType: UserType.TEACHER }, async (req, res, next) => {
  if (!req.user || req.user.type >= UserType.MEDIATOR) {
    // no mascotte for pelico
    next();
    return;
  }
  const activity = await getRepository(Activity).findOne({
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
};

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
  },
  required: ['type', 'data', 'content'],
  additionalProperties: false,
};

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

  const villageId = req.user.type >= UserType.MEDIATOR ? data.villageId || req.user.villageId || null : req.user.villageId || null;
  if (villageId === null) {
    throw new AppError('Invalid data, missing village Id', ErrorCode.INVALID_DATA);
  }

  // Delete old draft if needed.
  if (data.status === ActivityStatus.PUBLISHED || data.status === ActivityStatus.DRAFT) {
    await getRepository(Activity).delete({
      userId: req.user.id,
      villageId,
      type: data.type,
      subType: data.subType ?? null,
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

  await getRepository(Activity).save(activity);

  res.sendJSON(activity);
});

// --- Update activity ---
type UpdateActivity = {
  status?: number;
  phase?: number;
  responseActivityId?: number;
  responseType?: number;
  isPinned?: boolean;
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
    data: {
      type: 'object',
      additionalProperties: true,
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
  const activity = await getRepository(Activity).findOne({ where: { id }, relations: ['content'] });
  if (activity === undefined || req.user === undefined) {
    next();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type < UserType.ADMIN) {
    next();
    return;
  }

  activity.status = data.status ?? activity.status;
  activity.responseActivityId = data.responseActivityId !== undefined ? data.responseActivityId : activity.responseActivityId ?? null;
  activity.responseType = data.responseType !== undefined ? data.responseType : activity.responseType ?? null;

  if (activity.type === ActivityType.GAME && activity.subType === GameType.MIMIQUE && activity.status === ActivityStatus.PUBLISHED) {
    const activityData = (activity.content || []).find((data) => {
      return data.key === 'json';
    });
    if (activityData) {
      const value = JSON.parse(activityData.value);
      const mimiquesData = value.data as MimiquesData;
      mimiquesData.mimique1.mimiqueId = (await createMimique(mimiquesData.mimique1, activity)).id;
      mimiquesData.mimique2.mimiqueId = (await createMimique(mimiquesData.mimique2, activity)).id;
      mimiquesData.mimique3.mimiqueId = (await createMimique(mimiquesData.mimique3, activity)).id;
      activityData.value = JSON.stringify(value);
      await getRepository(ActivityData).save(activityData);
    }
  }

  await getRepository(Activity).save(activity);
  res.sendJSON(activity);
});

const createMimique = async (data: MimiqueData, activity: Activity): Promise<Mimique> => {
  const id = data.mimiqueId;
  const mimique = id ? await getRepository(Mimique).findOneOrFail({ where: { id: data.mimiqueId } }) : new Mimique();

  mimique.signification = data.signification || '';
  mimique.fakeSignification1 = data.fakeSignification1 || '';
  mimique.fakeSignification2 = data.fakeSignification2 || '';
  mimique.origine = data.origine || '';
  mimique.video = data.video || '';
  mimique.activityId = activity.id;
  mimique.villageId = activity.villageId;
  mimique.userId = activity.userId;
  await getRepository(Mimique).save(mimique);
  return mimique;
};
// --- Add content to an activity ---
type AddActivityData = {
  content?: Array<{
    key: ActivityDataType;
    value: string;
  }>;
};
const ADD_DATA_SCHEMA: JSONSchemaType<AddActivityData> = {
  type: 'object',
  properties: {
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'json', 'h5p', 'sound'] },
          value: { type: 'string', nullable: false },
        },
        required: ['key', 'value'],
      },
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
  const activity = await getRepository(Activity).findOne({ where: { id } });
  if (activity === undefined || req.user === undefined) {
    next();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type < UserType.ADMIN) {
    next();
    return;
  }

  if (activity.status !== ActivityStatus.PUBLISHED) {
    activity.phase = data.phase || activity.phase;
  }
  activity.status = data.status ?? activity.status;
  activity.responseActivityId = data.responseActivityId !== undefined ? data.responseActivityId : activity.responseActivityId ?? null;
  activity.responseType = data.responseType !== undefined ? data.responseType : activity.responseType ?? null;
  activity.isPinned = data.isPinned !== undefined ? data.isPinned : activity.isPinned;
  activity.data = data.data ?? activity.data;
  activity.content = data.content ?? activity.content;

  await getRepository(Activity).save(activity);
  res.sendJSON(activity);
});

// --- Delete an activity --- (Soft delete)
activityController.delete({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await getRepository(Activity).findOne({ where: { id } });
  if (activity === undefined || req.user === undefined) {
    res.status(204).send();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type < UserType.ADMIN) {
    res.status(204).send();
    return;
  }

  if (activity.status === ActivityStatus.DRAFT) {
    // No soft delete for drafts.
    await getRepository(Activity).delete({ id });
  } else {
    await getRepository(Activity).softDelete({ id });
  }
  res.status(204).send();
});

// --- Add comment controllers
activityController.router.use(`/:id${commentController.name}`, commentController.router);

export { activityController };
