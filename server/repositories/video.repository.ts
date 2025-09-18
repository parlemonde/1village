import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

// On utilise les activités pour récupérer les videos car certaines sont manquantes de la table video

export async function getVideosCountByClassroomUser(userId: number, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.id = ${userId} AND u.type = 3 AND u.accountRegistration = 10`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getVideosCountByVillageId(villageId: number, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.villageId = ${villageId} AND u.type = 3 AND u.accountRegistration = 10`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getVideosCountByVillageCountryAndPhase(villageId: number, countryCode: string, phase?: number): Promise<number> {
  return activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .andWhere('a.phase = :phase', { phase })
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.villageId = ${villageId} AND u.countryCode = '${countryCode} AND u.type = 3 AND u.accountRegistration = 10'`,
    )
    .getCount();
}

export async function getVideosCountByCountryCode(countryCode: string, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = 3 AND u.accountRegistration = 10`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getVideosTotalCount(phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = 3 AND u.accountRegistration = 10`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}
