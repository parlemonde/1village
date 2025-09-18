import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

// On utilise les activités pour récupérer les videos car certaines sont manquantes de la table video

export async function getVideosCountByClassroomUser(userId: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.id = ${userId}`)
    .getCount();
}

export async function getVideosCountByClassroomUserAndPhase(userId: number, phase: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.id = ${userId}`)
    .getCount();
}

export async function getVideosCountByVillageId(villageId: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.villageId = ${villageId}`)
    .getCount();
}

export async function getVideosCountByVillageIdAndPhase(villageId: number, phase: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.villageId = ${villageId}`)
    .getCount();
}

export async function getVideosCountByCountryCode(countryCode: string): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = ${countryCode}`)
    .getCount();
}

export async function getVideosCountByCountryCodeAndPhase(countryCode: string, phase: number): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.phase = :phase', { phase })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId AND u.countryCode = ${countryCode}`)
    .getCount();
}

export async function getVideosTotalCount(): Promise<number> {
  return await activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere('a.status = 0')
    .innerJoin('user', 'u', `u.id = a.userId`)

    .getCount();
}
