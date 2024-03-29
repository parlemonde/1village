import { In } from 'typeorm';

import { Activity } from '../entities/activity';
import { Comment } from '../entities/comment';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

type ActivityGetter = {
  limit?: number;
  page?: number;
  phase?: number | null;
  phaseStep?: string;
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

export const getActivities = async ({
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
  phaseStep,
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
  if (phaseStep) {
    subQueryBuilder = subQueryBuilder.andWhere('activity.phaseStep = :phaseStep', { phaseStep });
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

export const getActivitiesCommentCount = async (ids: number[]): Promise<{ [key: number]: number }> => {
  if (ids.length === 0) {
    return {};
  }
  const comments = await AppDataSource.getRepository(Comment).find({
    where: {
      activityId: In(ids),
    },
  });
  return comments.reduce<{ [key: number]: number }>((acc, comment) => {
    if (!acc[comment.activityId]) {
      acc[comment.activityId] = 1;
    } else {
      acc[comment.activityId]++;
    }
    return acc;
  }, {});
};
