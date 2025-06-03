import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

type GetActivitiesParams = {
  phase?: number;
  villageIds?: number[];
};

export const getActivities = async ({ phase, villageIds = [] }: GetActivitiesParams) => {
  const activityQB = activitiesRepository
    .createQueryBuilder('activity')
    .select(['activity.id', 'activity.phase', 'activity.type', 'activity.status', 'activity.content', 'activity.villageId']);

  if (phase) {
    activityQB.where('activity.phase = :phase', { phase });
  }

  if (villageIds.length > 0) {
    activityQB.where('activity.villageId IN (:...villageIds)', { villageIds });
  }

  return await activityQB
    .setFindOptions({
      relations: {
        user: true,
      },
    })
    .getMany();
};
