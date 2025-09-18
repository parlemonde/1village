import { Comment } from '../../entities/comment';
import { AppDataSource } from '../../utils/data-source';

const commentsRepository = AppDataSource.getRepository(Comment);

export async function getCommentsTotalCount(phase?: number): Promise<number> {
  const qb = commentsRepository.createQueryBuilder('c').innerJoin('user', 'u', `u.id = c.userId`).innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getUserCommentsCount(userId: number, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.id = ${userId}`)
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getCommentsCountByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.countryCode = '${countryCode}' AND u.villageId = ${villageId}`)
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .getCount();
}

export async function getCommentsCountByCountry(countryCode: string, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.countryCode = '${countryCode}'`)
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}

export async function getCommentsCountByVillageId(villageId: number, phase?: number): Promise<number> {
  const qb = commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.villageId = ${villageId}`)
    .innerJoin('activity', 'a', `a.id = c.activityId`);

  if (phase) {
    qb.andWhere('a.phase = :phase', { phase });
  }

  return qb.getCount();
}
