import { UserType } from '../../../types/user.type';
import { Comment } from '../../entities/comment';
import { AppDataSource } from '../../utils/data-source';

const USER_WITH_PLM_SSO_REGISTRATION = 10;

const commentsRepository = AppDataSource.getRepository(Comment);

export async function getCommentsTotalCount(phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`)
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getUserCommentsCountByUserId(userId: number, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin(
      'user',
      'u',
      `u.id = c.userId AND u.id = ${userId} AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getCommentsCountByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin(
      'user',
      'u',
      `u.id = c.userId AND u.countryCode = '${countryCode}' AND u.villageId = ${villageId} AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .getCount();
}

export async function getCommentsCountByCountry(countryCode: string, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin(
      'user',
      'u',
      `u.id = c.userId AND u.countryCode = '${countryCode}' AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getCommentsCountByVillageId(villageId: number, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin(
      'user',
      'u',
      `u.id = c.userId AND u.villageId = ${villageId} AND u.type = ${UserType.TEACHER} AND u.accountRegistration = ${USER_WITH_PLM_SSO_REGISTRATION}`,
    )
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}
