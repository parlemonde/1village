import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

type GetActivitiesParams = {
  phase?: number;
  classroomIds?: number[];
};

export const getActivities = async ({ phase, classroomIds = [] }: GetActivitiesParams) => {
  const activityQB = activitiesRepository
    .createQueryBuilder('activity')
    .select(['activity.id', 'activity.phase', 'activity.type', 'activity.status', 'activity.content', 'activity.villageId']);

  if (phase) {
    activityQB.where('activity.phase = :phase', { phase });
  }

  if (classroomIds.length > 0) {
    activityQB.where('activity.classroomId IN (:...classroomIds)', { classroomIds });
  }

  return await activityQB
    .setFindOptions({
      relations: {
        user: true,
      },
    })
    .getMany();
};
