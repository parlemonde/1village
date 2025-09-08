import { Comment } from '../../entities/comment';
import { AppDataSource } from '../../utils/data-source';

const commentsRepository = AppDataSource.getRepository(Comment);

export const getCommentCountForActivities = async (activityIds: number[]) => {
  if (!activityIds || activityIds.length === 0) {
    return 0;
  }

  const commentQB = commentsRepository.createQueryBuilder('comment').where('comment.activityId IN (:...activityIds)', { activityIds });

  return await commentQB.getCount();
};

export async function getUserCommentsCountByPhase(userId: number, phase: number): Promise<number> {
  return await commentsRepository
    .createQueryBuilder('c')
    .innerJoin('activity', 'a', `a.id = c.activityId AND a.phase = ${phase}`)
    .where('c.userId = :userId', { userId })
    .getCount();
}
