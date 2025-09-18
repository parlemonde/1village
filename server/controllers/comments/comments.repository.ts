import { Comment } from '../../entities/comment';
import { AppDataSource } from '../../utils/data-source';

const commentsRepository = AppDataSource.getRepository(Comment);

export async function getCommentsTotalCount(): Promise<number> {
  return commentsRepository.count();
}

export async function getUserCommentsCount(userId: number): Promise<number> {
  return commentsRepository.count({ where: { userId } });
}

export async function getUserCommentsCountByPhase(userId: number, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .where('c.userId = :userId', { userId })
    .getCount();
}

export async function getCommentsCountByVillageCountryAndPhase(villageId: number, countryCode: string, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.countryCode = '${countryCode}' AND u.villageId = ${villageId}`)
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .getCount();
}

export async function getCommentsCountByCountry(countryCode: string): Promise<number> {
  return await commentsRepository.createQueryBuilder('c').innerJoin('user', 'u', `u.id = c.userId AND u.countryCode = '${countryCode}'`).getCount();
}

export async function getCommentsCountByCountryAndPhase(countryCode: string, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.countryCode = '${countryCode}'`)
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .getCount();
}

export async function getCommentsCountByVillageId(villageId: number): Promise<number> {
  return await commentsRepository.createQueryBuilder('c').innerJoin('user', 'u', `u.id = c.userId AND u.villageId = ${villageId}`).getCount();
}

export async function getCommentsCountByVillageAndPhase(villageId: number, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('user', 'u', `u.id = c.userId AND u.villageId = ${villageId}`)
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .getCount();
}
