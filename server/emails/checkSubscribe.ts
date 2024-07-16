import { Activity } from '../entities/activity';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

export const hasSubscribed = async (activityId, userId) => {
  const userA = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const userIdB = activity?.userId;
  const userB = await AppDataSource.getRepository(User).findOne({ where: { id: userIdB } });

  console.log('=====================================================');
  console.log('userA', userA);
  console.log('userB', userB);
  console.log('activity', activity);
  console.log('=====================================================');

  
};
