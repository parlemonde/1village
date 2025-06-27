import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

type GetActivitiesParams = {
  phase?: number;
  villageIds?: number[];
  classroomId?: number;
};

export const getActivities = async ({ phase, villageIds, classroomId }: GetActivitiesParams) => {
  const activityQB = activitiesRepository
    .createQueryBuilder('activity')
    .select(['activity.phase', 'activity.type', 'activity.status', 'activity.content', 'activity.villageId']);

  if (phase) {
    activityQB.where('activity.phase = :phase', { phase });
  }

  if (villageIds && villageIds.length > 0) {
    activityQB.where('activity.villageId IN (:...villageIds)', { villageIds });
  }

  if (classroomId) {
    activityQB.where('activity.classroomId = :classroomId', { classroomId });
  }

  return await activityQB.getMany();
};
