import { sendMail, Email } from '../emails/index';
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

export enum EnumMailType {
  COMMENTARY = 'commentary',
  REACTION = 'reaction',
}

const emailMapping = {
  [EnumMailType.COMMENTARY]: Email.COMMENT_NOTIFICATION,
  [EnumMailType.REACTION]: Email.REACTION_NOTIFICATION,
};

export const hasSubscribed = async (activityId, userId, column) => {
  const userWhoComment = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  let userIdWhoCreateActivity = activity?.userId;
  let userWhoCreateActivity = await AppDataSource.getRepository(User).findOne({ where: { id: userIdWhoCreateActivity } });
  console.log('==========================');
  console.log('userWhoCreateActivity', userWhoCreateActivity);
  console.log('userIdWhoCreateActivity', userIdWhoCreateActivity);
  console.log('activity', activity);
  console.log('==========================');

  if (column === 'reaction') {
    const newActivity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activity?.responseActivityId } });
    userWhoCreateActivity = await AppDataSource.getRepository(User).findOne({ where: { id: newActivity?.userId } });
    userIdWhoCreateActivity = userWhoCreateActivity?.id;
    console.log('==========================');
    console.log('userWhoCreateActivity', userWhoCreateActivity);
    console.log('userIdWhoCreateActivity', userIdWhoCreateActivity);
    console.log('==========================');
  }
  console.log('==========================');
  console.log('userIdWhoCreateActivity', userIdWhoCreateActivity);
  console.log('==========================');

  const whichNotification = await AppDataSource.createQueryBuilder()
    .select(`notifications.${column}`)
    .from(Notifications, 'notifications')
    .where('notifications.userId = :userIdWhoCreateActivity', { userIdWhoCreateActivity })
    .getOne();

  console.log('==========================');
  console.log('whichNotification', whichNotification);
  console.log('userIdWhoCreateActivity', userIdWhoCreateActivity);
  console.log('==========================');

  if (whichNotification?.[tableMapping[column]] === true && userWhoCreateActivity?.email) {
    const emailType = emailMapping[column];
    await sendMail(emailType, userWhoCreateActivity.email, { text: 'This is a test email.' });
  }
};
