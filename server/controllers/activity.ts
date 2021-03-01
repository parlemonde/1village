import { JSONSchemaType } from 'ajv';
import { NextFunction, Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';

import { ActivityData, ActivityDataType } from '../entities/activityData';
import { Activity, ActivityType, ActivitySubType } from '../entities/activity';
import { Comment } from '../entities/comment';
import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { getQueryString } from '../utils';

import { commentController } from './comment';
import { Controller } from './controller';

const activityController = new Controller('/activities');

type ActivityGetter = {
  limit?: number;
  page?: number;
  villageId?: number;
  type?: number;
  subType?: number;
  countries?: string[];
  pelico?: boolean;
  userId?: number;
};
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
const getActivities = async ({ limit = 200, page = 0, villageId, type = 0, subType = 0, countries = [], pelico = true, userId }: ActivityGetter) => {
  // get ids
  let subQueryBuilder = getRepository(Activity).createQueryBuilder('activity').select('activity.id', 'id');
  if (villageId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.villageId = :villageId', { villageId });
  }
  if (type !== 0) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.type = :type', { type: `${type - 1}` });
  }
  if (subType !== 0) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.subType = :subType', { subType: `${subType - 1}` });
  }
  if (userId !== undefined) {
    subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.id = :userId', {
      userId,
    });
  } else if (pelico) {
    if (countries.length > 0) {
      subQueryBuilder = subQueryBuilder
        .innerJoin('activity.user', 'user')
        .andWhere('((user.countryCode IN (:countries) AND user.type <= :userType) OR user.type >= :userType2)', {
          countries,
          userType: UserType.OBSERVATOR,
          userType2: UserType.MEDIATOR,
        });
    } else {
      subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.type >= :userType2', {
        userType2: UserType.MEDIATOR,
      });
    }
  } else {
    if (countries.length > 0) {
      subQueryBuilder = subQueryBuilder.innerJoin('activity.user', 'user').andWhere('user.countryCode IN (:countries) AND user.type <= :userType', {
        countries,
        userType: UserType.OBSERVATOR,
      });
    } else {
      return [];
    }
  }

  const ids = (
    await subQueryBuilder
      .orderBy('activity.createDate', 'DESC')
      .limit(limit)
      .offset(page * limit)
      .getRawMany()
  ).map((row) => row.id);
  if (ids.length === 0) {
    return [];
  }

  // select activities and their content
  const activities = await getRepository(Activity)
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.content', 'activityData', 'activity.id = activityData.activityId')
    .where('activity.id IN (:ids)', { ids })
    .orderBy('activity.createDate', 'DESC')
    .addOrderBy('activityData.order', 'ASC')
    .getMany();

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

const getActivity = async (id: number) => {
  const activity = await getRepository(Activity)
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.content', 'activityData')
    .where('`activity`.`id` = :id', { id })
    .orderBy('`activity`.`createDate`', 'DESC')
    .addOrderBy('`activityData`.`order`', 'ASC')
    .getOne();
  return activity;
};

// --- Get all activities. ---
activityController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const activities = await getActivities({
    limit: req.query.limit ? parseInt(getQueryString(req.query.limit), 10) || 200 : undefined,
    page: req.query.page ? parseInt(getQueryString(req.query.page), 10) || 0 : undefined,
    villageId: req.query.villageId ? parseInt(getQueryString(req.query.villageId), 10) || 0 : undefined,
    countries: req.query.countries ? getQueryString(req.query.countries).split(',') : undefined,
    pelico: req.query.pelico ? req.query.pelico !== 'false' : false,
    type: req.query.type ? parseInt(getQueryString(req.query.type), 10) || 0 : undefined,
    subType: req.query.subType ? parseInt(getQueryString(req.query.subType), 10) || 0 : undefined,
    userId: req.query.userId ? parseInt(getQueryString(req.query.userId), 10) || 0 : undefined,
  });
  res.sendJSON(activities);
});

// --- Get one activity. ---
activityController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await getActivity(id);
  if (activity === undefined) {
    next();
    return;
  }
  if (req.user && req.user.type === UserType.TEACHER && req.user.villageId !== activity.villageId) {
    next();
    return;
  }
  res.sendJSON(activity);
});

// --- Create an activity ---
type CreateActivityData = {
  type: ActivityType;
  subType?: ActivitySubType;
  villageId?: number;
  content?: Array<{
    key: ActivityDataType;
    value: string;
  }>;
  responseActivityId?: number;
  responseType?: ActivityType;
};
const CREATE_SCHEMA: JSONSchemaType<CreateActivityData> = {
  type: 'object',
  properties: {
    type: {
      type: 'number',
      enum: [ActivityType.PRESENTATION, ActivityType.QUESTION, ActivityType.GAME, ActivityType.ENIGME, ActivityType.DEFI],
    },
    subType: {
      type: 'number',
      enum: [ActivitySubType.THEMATIQUE, ActivitySubType.MASCOTTE],
      nullable: true,
    },
    villageId: { type: 'number', nullable: true },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'json', 'h5p'] },
          value: { type: 'string', nullable: false },
        },
        required: ['key', 'value'],
      },
      nullable: true,
    },
    responseActivityId: { type: 'number', nullable: true },
    responseType: {
      type: 'number',
      nullable: true,
      enum: [ActivityType.PRESENTATION, ActivityType.QUESTION, ActivityType.GAME, ActivityType.ENIGME, ActivityType.DEFI],
    },
  },
  required: ['type'],
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

  const villageId = data.villageId || req.user.villageId || null;
  if (villageId === null) {
    throw new AppError('Invalid data, missing village Id', ErrorCode.INVALID_DATA);
  }

  const activity = new Activity();
  activity.villageId = villageId;
  activity.userId = req.user.id;
  activity.type = data.type;
  activity.subType = data.subType || data.subType == 0 ? data.subType : null;
  if (data.responseActivityId && data.responseType) {
    activity.responseActivityId = data.responseActivityId;
    activity.responseType = data.responseType;
  }

  const content = (data.content || []).map((d, index) => {
    const activityData = new ActivityData();
    activityData.order = index;
    activityData.key = d.key;
    activityData.value = d.value;
    return activityData;
  });
  await getManager().transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(activity);
    if (content.length > 0) {
      content.forEach((activityData) => {
        activityData.activityId = activity.id;
      });
      await transactionalEntityManager.save(content);
    }
  });
  activity.content = content;
  res.sendJSON(activity);
});

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
          key: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'json', 'h5p'] },
          value: { type: 'string', nullable: false },
        },
        required: ['key', 'value'],
      },
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};
const addActivityDataValidator = ajv.compile(ADD_DATA_SCHEMA);
activityController.post({ path: '/:id/content', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!addActivityDataValidator(data)) {
    sendInvalidDataError(addActivityDataValidator);
    return;
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
  if (!data.content || data.content.length === 0) {
    res.sendJSON([]);
    return;
  }

  const content = (data.content || []).map((c, index) => {
    const activityData = new ActivityData();
    activityData.order = index + (activity.content || []).length;
    activityData.key = c.key;
    activityData.value = c.value;
    activityData.activityId = activity.id;
    return activityData;
  });
  await getManager().transaction(async (transactionalEntityManager) => {
    activity.updateDate = new Date();
    await transactionalEntityManager.save(activity);
    await transactionalEntityManager.save(content);
  });
  res.sendJSON(content);
});

// --- update all activity content
type UpdateActivityData = {
  content: Array<{
    key?: ActivityDataType;
    value: string;
    id?: number;
  }>;
};
const UPDATE_DATA_SCHEMA: JSONSchemaType<UpdateActivityData> = {
  type: 'object',
  properties: {
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string', nullable: true, enum: ['text', 'video', 'image', 'json', 'h5p'] },
          value: { type: 'string', nullable: false },
          id: { type: 'number', nullable: true },
        },
        required: ['value'],
      },
      nullable: true,
    },
  },
  required: ['content'],
  additionalProperties: false,
};
const updateActivityDataValidator = ajv.compile(UPDATE_DATA_SCHEMA);
activityController.put({ path: '/:id/content', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateActivityDataValidator(data)) {
    sendInvalidDataError(updateActivityDataValidator);
    return;
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

  const mapIndex = data.content.reduce<{ [key: number]: number }>((acc, c, index) => {
    if (c.id) {
      acc[c.id] = index;
    }
    return acc;
  }, {});

  // 1-- new and updated content
  const newContent: ActivityData[] = [];
  const updatedContent: ActivityData[] = [];
  for (let index = 0; index < data.content.length; index++) {
    const c = data.content[index];
    if (c.id === undefined && c.key !== undefined) {
      const activityData = new ActivityData();
      activityData.order = index;
      activityData.key = c.key;
      activityData.value = c.value;
      activityData.activityId = activity.id;
      newContent.push(activityData);
    }
    if (c.id !== undefined && mapIndex[c.id] !== undefined) {
      const activityData = new ActivityData();
      activityData.order = index;
      activityData.value = c.value;
      activityData.activityId = activity.id;
      activityData.id = c.id;
      updatedContent.push(activityData);
    }
  }
  // 2-- deleted content
  const deletedContent = (activity.content || []).map((c) => c.id).filter((id) => mapIndex[id] === undefined);

  await getManager().transaction(async (transactionalEntityManager) => {
    activity.updateDate = new Date();
    await transactionalEntityManager.save(activity);
    if (newContent.length) {
      await transactionalEntityManager.save(newContent);
    }
    if (updatedContent.length) {
      await transactionalEntityManager.save(updatedContent);
    }
    if (deletedContent.length) {
      await transactionalEntityManager.createQueryBuilder().delete().from(ActivityData).where('`id` IN (:...ids)', { ids: deletedContent }).execute();
    }
  });

  // send new activity
  res.sendJSON(await getActivity(id));
});

// --- Edit an activity content ---
type EditActivityData = {
  value: string;
};
const Edit_DATA_SCHEMA: JSONSchemaType<EditActivityData> = {
  type: 'object',
  properties: {
    value: { type: 'string', nullable: false },
  },
  required: ['value'],
  additionalProperties: false,
};
const editActivityDataValidator = ajv.compile(Edit_DATA_SCHEMA);
activityController.put({ path: '/:activityId/content/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!editActivityDataValidator(data)) {
    sendInvalidDataError(editActivityDataValidator);
    return;
  }

  const activityId = parseInt(req.params.activityId, 10) || 0;
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await getRepository(Activity).findOne({ where: { id: activityId } });
  const activityData = await getRepository(ActivityData).findOne({ where: { id } });
  if (activity === undefined || activityData === undefined || req.user === undefined) {
    next();
    return;
  }
  const isQuestionDataChange = activity.type === ActivityType.QUESTION && activityData.key === 'json';
  if (activity.userId !== req.user.id && req.user.type < UserType.ADMIN && !isQuestionDataChange) {
    next();
    return;
  }

  activityData.value = data.value;
  await getManager().transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(activityData);
    activity.updateDate = new Date();
    await transactionalEntityManager.save(activity);
  });
  res.sendJSON(activityData);
});

// --- Edit content order ---
type OrderActivityData = {
  order: number[];
};
const ORDER_DATA_SCHEMA: JSONSchemaType<OrderActivityData> = {
  type: 'object',
  properties: {
    order: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  required: ['order'],
  additionalProperties: false,
};
const editOrderActivityDataValidator = ajv.compile(ORDER_DATA_SCHEMA);
activityController.put({ path: '/:id/content-order', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!editOrderActivityDataValidator(data)) {
    sendInvalidDataError(editOrderActivityDataValidator);
    return;
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
  if (data.order.length !== (activity.content?.length || 0)) {
    throw new AppError('Invalid data, length of content is invalid.', ErrorCode.INVALID_DATA);
  }

  const content = data.order.map((activityDataId, index) => {
    const activityData = new ActivityData();
    activityData.order = index;
    activityData.id = activityDataId;
    return activityData;
  });
  await getManager().transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.save(content);
    activity.updateDate = new Date();
    await transactionalEntityManager.save(activity);
  });
  res.sendJSON(content);
});

// --- Delete an activity content ---
activityController.delete({ path: '/:activityId/content/:id', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.activityId, 10) || 0;
  const id = parseInt(req.params.id, 10) || 0;
  const activity = await getRepository(Activity).findOne({ where: { id: activityId } });
  const activityData = await getRepository(ActivityData).findOne({ where: { id } });
  if (activity === undefined || activityData === undefined || req.user === undefined) {
    res.status(204).send();
    return;
  }
  if (activity.userId !== req.user.id && req.user.type < UserType.ADMIN) {
    res.status(204).send();
    return;
  }

  await getManager().transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.delete(ActivityData, { id });
    activity.updateDate = new Date();
    await transactionalEntityManager.save(activity);
  });
  res.status(204).send();
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

  await getRepository(Activity).softDelete({ id });
  res.status(204).send();
});

// --- Add comment controllers
activityController.router.use(`/:id${commentController.name}`, commentController.router);

export { activityController };
