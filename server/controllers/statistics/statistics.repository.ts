import { Comment } from '../../entities/comment';
import { Video } from '../../entities/video';
import { AppDataSource } from '../../utils/data-source';

type ExchangeParams = {
  countryCode: string;
  phaseId: number;
  villageId?: number;
  classRoomId?: number;
};

export const getExchanges = async (params?: ExchangeParams) => {
  const { countryCode } = params || {};

  const videoRepository = AppDataSource.getRepository(Video);
  const commentRepository = AppDataSource.getRepository(Comment);

  const videoQB = videoRepository.createQueryBuilder('video').innerJoin('video.user', 'user');

  const commentQB = commentRepository.createQueryBuilder('comment').innerJoin('comment.user', 'user');

  if (countryCode) {
    videoQB.where('user.countryCode = :countryCode', { countryCode });
    commentQB.where('user.countryCode = :countryCode', { countryCode });
  }

  const [videosCount, commentsCount] = await Promise.all([videoQB.getCount(), commentQB.getCount()]);

  return {
    videosCount,
    publicationsCount: 100,
    commentsCount,
  };
};
