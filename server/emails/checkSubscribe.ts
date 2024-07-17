import { Activity } from '../entities/activity';
import { Notifications } from '../entities/notifications';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const tableMapping = {
  commentary: 'commentary',
  reaction: 'reaction',
  publicationFromSchool: 'publicationFromSchool',
  publicationFromAdmin: 'publicationFromAdmin',
  creationAccountFamily: 'creationAccountFamily',
  openingVillageStep: 'openingVillageStep',
};

export const hasSubscribed = async (activityId, userId, column) => {
  const userWhoComment = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const userIdWhoCreateActivity = activity?.userId;
  const userWhoCreateActivity = await AppDataSource.getRepository(User).findOne({ where: { id: userIdWhoCreateActivity } });

  // const whichNotification = await AppDataSource.getRepository(Notifications).findOne({ where: { userId: userIdWhoCreateActivity } });
  const whichNotification = await AppDataSource.createQueryBuilder()
    .select(`notifications.${column}`)
    .from(Notifications, 'notifications')
    .where('notifications.userId = :userIdWhoCreateActivity', { userIdWhoCreateActivity })
    .getOne();

  console.log('=====================================================');
  console.log('`${whichNotification}.${column}`', whichNotification?.[tableMapping[column]]);
  if (whichNotification?.[tableMapping[column]] === true) {
    console.log('=====================================================');
    console.log('c est vrai');
  } else {
    console.log('=====================================================');
    console.log('non c est faux');
  }

  console.log('=====================================================');
  console.log('nom de la colonne', column);
  console.log('userWhoComment', userWhoComment);
  console.log('userWhoCreateActivity', userWhoCreateActivity);
  console.log('activity', activity);
  console.log('whichNotification', whichNotification);
  console.log('=====================================================');
};
