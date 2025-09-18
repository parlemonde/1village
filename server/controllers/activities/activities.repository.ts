import { Not, In } from 'typeorm';

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

  return await activityQB.getMany();
};

export async function getActivitiesTotalCount(): Promise<number> {
  return activitiesRepository.count({ where: { deleteDate: undefined, status: 0, type: Not(In([0, 12])) } });
}

export async function getActivitiesCountByClassroomUser(userId: number): Promise<number> {
  return activitiesRepository.count({ where: { userId, deleteDate: undefined, status: 0, type: Not(In([0, 12])) } });
}

export async function getActivitiesByClassroomUserAndPhase(userId: number, phase?: number): Promise<Activity[]> {
  return activitiesRepository.find({ where: { userId, phase, deleteDate: undefined, status: 0, type: Not(In([0, 12])) } });
}

export async function getActivitiesByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<Activity[]> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}'`)
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 12] }) // Exclude PRESENTATION and CLASS_ANTHEM
    .getMany();
}

export async function getActivitiesCountByCountry(countryCode: string): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}'`)
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 12] }) // Exclude PRESENTATION and CLASS_ANTHEM
    .getCount();
}

export async function getActivitiesByCountryAndPhase(countryCode: string, phase: number): Promise<Activity[]> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}'`)
    .where('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 12] }) // Exclude PRESENTATION and CLASS_ANTHEM
    .getMany();
}

export async function getActivitiesCountByVillageId(villageId: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 12] }) // Exclude PRESENTATION and CLASS_ANTHEM
    .getCount();
}

export async function getActivitiesByVillageIdAndPhase(villageId: number, phase: number): Promise<Activity[]> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where('a.villageId = :villageId', { villageId })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.type NOT IN (:...excludedTypes)', { excludedTypes: [0, 12] }) // Exclude PRESENTATION and CLASS_ANTHEM
    .getMany();
}
