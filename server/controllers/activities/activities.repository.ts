import { Not, In, IsNull } from 'typeorm';

import { ActivityStatus, ActivityType } from '../../../types/activity.type';
import type { VillageClassroomsContribution } from '../../../types/statistics.type';
import { UserType } from '../../../types/user.type';
import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

const USER_WITH_PLM_SSO_REGISTRATION = 10;

const activitiesRepository = AppDataSource.getRepository(Activity);

type GetActivitiesParams = {
  phase?: number;
  villageIds?: number[];
};

export const getActivities = async ({ phase, villageIds = [] }: GetActivitiesParams) => {
  const activityQB = activitiesRepository.createQueryBuilder('activity').leftJoinAndSelect('activity.user', 'user');

  if (phase) {
    activityQB.where('activity.phase = :phase', { phase });
  }

  if (villageIds.length > 0) {
    activityQB.where('activity.villageId IN (:...villageIds)', { villageIds });
  }

  return activityQB.getMany();
};

export async function getActivitiesTotalCount(phase?: number): Promise<number> {
  return activitiesRepository.count({
    where: {
      phase,
      deleteDate: IsNull(),
      status: ActivityStatus.PUBLISHED,
      type: Not(In([ActivityType.PRESENTATION, ActivityType.ANTHEM])),
      user: { type: UserType.TEACHER, accountRegistration: USER_WITH_PLM_SSO_REGISTRATION },
    },
  });
}

export async function getActivitiesCountByStatusAndClassroomUser(activityStatus: ActivityStatus, userId: number, phase?: number): Promise<number> {
  return activitiesRepository.count({
    where: {
      phase,
      deleteDate: IsNull(),
      status: activityStatus,
      type: Not(In([ActivityType.PRESENTATION, ActivityType.ANTHEM])),
      user: { id: userId, type: UserType.TEACHER, accountRegistration: USER_WITH_PLM_SSO_REGISTRATION },
    },
  });
}

export async function getActivitiesByClassroomUserAndPhase(userId: number, phase?: number): Promise<Activity[]> {
  return activitiesRepository.find({
    where: {
      phase,
      deleteDate: IsNull(),
      status: ActivityStatus.PUBLISHED,
      type: Not(In([ActivityType.PRESENTATION, ActivityType.ANTHEM])),
      user: { id: userId, type: UserType.TEACHER, accountRegistration: USER_WITH_PLM_SSO_REGISTRATION },
    },
  });
}

export async function getActivitiesByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: ActivityStatus.PUBLISHED })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] })
    .getMany();
}

export async function getDraftActivitiesCountByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<number> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: ActivityStatus.DRAFT })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] })
    .getCount();
}

export async function getActivitiesCountByStatusAndCountry(activityStatus: ActivityStatus, countryCode: string, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: activityStatus })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] });

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getActivitiesByCountryAndPhase(countryCode: string, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .where('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: ActivityStatus.PUBLISHED })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] })
    .getMany();
}

export async function getActivitiesCountByStatusAndVillageId(activityStatus: ActivityStatus, villageId: number, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: activityStatus })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] });

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getActivitiesByVillageIdAndPhase(villageId: number, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = :status', { status: ActivityStatus.PUBLISHED })
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [ActivityType.PRESENTATION, ActivityType.ANTHEM] })
    .getMany();
}

export async function getClassroomsContributionsCounts(villageId: number): Promise<VillageClassroomsContribution[]> {
  return AppDataSource.query(`
  WITH classroomsActivities AS (
    SELECT cla.id as classroomId, cla.name as classroomName, cla.countryCode, cla.userId, u.displayName as userDisplayName, u.city, u.level, COUNT(a.id) as activitiesCount
      FROM classroom cla
      INNER JOIN user u ON u.id = cla.userId AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION} AND type = ${UserType.TEACHER}
      LEFT JOIN activity a ON a.userId = cla.userId AND a.status = ${ActivityStatus.PUBLISHED} AND deleteDate IS NULL AND a.type NOT IN (${ActivityType.PRESENTATION},${ActivityType.ANTHEM})
      WHERE cla.villageId = ${villageId}
      GROUP BY cla.id, cla.name, cla.countryCode
  ), classroomsContributions AS (
    SELECT classroomId, classroomName, countryCode, userDisplayName, ca.userId, city, level, activitiesCount, COUNT(c.id) as commentCount FROM classroomsActivities ca
      INNER JOIN comment c ON c.userId = ca.userId
      GROUP BY classroomId, classroomName, countryCode, ca.userId, activitiesCount
  )
  SELECT classroomId, countryCode, activitiesCount + commentCount as total,
    CASE
      WHEN cc.classroomName IS NOT NULL THEN cc.classroomName
      WHEN cc.userDisplayName IS NOT NULL THEN cc.userDisplayName
      WHEN cc.level IS NOT NULL THEN CONCAT('La classe de ', cc.level, ' à ', cc.city)
      ELSE CONCAT('La classe de ', cc.city)
    END AS classroomName
    FROM classroomsContributions cc
    GROUP BY classroomId, classroomName, countryCode
    ORDER BY countryCode;
`);
}
