import { Not, In, IsNull } from 'typeorm';

import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

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
    where: { phase, deleteDate: IsNull(), status: 0, type: Not(In([0, 11])), user: { type: 3, accountRegistration: 10 } },
  });
}

export async function getActivitiesCountByClassroomUser(userId: number, phase?: number): Promise<number> {
  return activitiesRepository.count({
    where: { phase, deleteDate: IsNull(), status: 0, type: Not(In([0, 11])), user: { id: userId, type: 3, accountRegistration: 10 } },
  });
}

export async function getActivitiesByClassroomUserAndPhase(userId: number, phase?: number): Promise<Activity[]> {
  return activitiesRepository.find({
    where: { phase, deleteDate: IsNull(), status: 0, type: Not(In([0, 11])), user: { id: userId, type: 3, accountRegistration: 10 } },
  });
}

export async function getActivitiesByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode} AND u.type = 3 AND u.accountRegistration = 10'`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 11] }) // On exclut PRESENTATION et ANTHEM
    .getMany();
}

export async function getActivitiesCountByCountry(countryCode: string, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = 3 AND u.accountRegistration = 10`)
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 11] }); // On exclut PRESENTATION et ANTHEM

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getActivitiesByCountryAndPhase(countryCode: string, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = 3 AND u.accountRegistration = 10`)
    .where('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 11] }) // On exclut PRESENTATION et ANTHEM
    .getMany();
}

export async function getActivitiesCountByVillageId(villageId: number, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = 3 AND u.accountRegistration = 10`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 11] }); // On exclut PRESENTATION et ANTHEM

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getActivitiesByVillageIdAndPhase(villageId: number, phase: number): Promise<Activity[]> {
  return activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = 3 AND u.accountRegistration = 10`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 11] }) // On exclut PRESENTATION et ANTHEM
    .getMany();
}
