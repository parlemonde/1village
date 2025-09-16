import { Video } from '../entities/video';
import { AppDataSource } from '../utils/data-source';

const videoRepository = AppDataSource.getRepository(Video);

export async function getVideosCountByClassroomUser(userId: number): Promise<number> {
  return videoRepository.count({ where: { userId } });
}

export async function getVideosCountByVillageId(villageId: number): Promise<number> {
  return await videoRepository
    .createQueryBuilder('v')
    .innerJoin('user', 'u', 'u.id = v.userId AND u.villageId = :villageId', { villageId })
    .getCount();
}
