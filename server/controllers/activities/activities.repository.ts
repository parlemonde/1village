import { Activity } from '../../entities/activity';
import { AppDataSource } from '../../utils/data-source';

const activitiesRepository = AppDataSource.getRepository(Activity);

export const getActivities = async () => {
  return await activitiesRepository.find({
    select: {
      phase: true,
      type: true,
      status: true,
      content: true,
      villageId: true,
    },
  });
};
