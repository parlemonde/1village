import { ActivityStatus } from '../../types/activity.type';
import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';

const USER_WITH_PLM_SSO_REGISTRATION = 10;

const activitiesRepository = AppDataSource.getRepository(Activity);

// On utilise les activités pour récupérer les videos car certaines sont manquantes de la table video

export async function getVideosCountByClassroomUserByUserId(userId: number, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere(`a.status = ${ActivityStatus.PUBLISHED}`)
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.id = ${userId} AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    );

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
    .andWhere(`a.status = ${ActivityStatus.PUBLISHED}`)
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.villageId = ${villageId} AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    );

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
    .andWhere(`a.status = ${ActivityStatus.PUBLISHED}`)
    .andWhere('a.phase = :phase', { phase })
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.villageId = ${villageId} AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .getCount();
}

export async function getVideosCountByCountryCode(countryCode: string, phase?: number): Promise<number> {
  const qb = activitiesRepository
    .createQueryBuilder('a')
    .where(`JSON_SEARCH(a.content, 'one', :type, NULL, '$[*].type') IS NOT NULL`, { type: 'video' })
    .andWhere('a.deleteDate IS NULL')
    .andWhere(`a.status = ${ActivityStatus.PUBLISHED}`)
    .innerJoin(
      'user',
      'u',
      `u.id = a.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    );

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
    .andWhere(`a.status = ${ActivityStatus.PUBLISHED}`)
    .innerJoin('user', 'u', `u.id = a.userId AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}
