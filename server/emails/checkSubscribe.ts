import { sendMail } from '../emails/index';
import { Activity } from '../entities/activity';
import { Notifications } from '../entities/notifications';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

type NotificationColumns =
  | 'commentary'
  | 'reaction'
  | 'publicationFromSchool'
  | 'publicationFromAdmin'
  | 'creationAccountFamily'
  | 'openingVillageStep';

const tableMapping: Record<NotificationColumns, string> = {
  commentary: 'commentary',
  reaction: 'reaction',
  publicationFromSchool: 'publicationFromSchool',
  publicationFromAdmin: 'publicationFromAdmin',
  creationAccountFamily: 'creationAccountFamily',
  openingVillageStep: 'openingVillageStep',
};

const emailMapping: Record<NotificationColumns, number> = {
  commentary: 1,
  reaction: 2,
  publicationFromSchool: 3,
  publicationFromAdmin: 4,
  creationAccountFamily: 5,
  openingVillageStep: 6,
};

const activityNameMapper: Record<number, string> = {
  1: 'Enigme',
  2: 'Défis',
  4: 'Jeux',
  6: 'Indice culturel',
  7: 'Indice symbolique',
  8: 'Mascotte',
  9: 'Reportage',
  10: 'Réaction',
  12: 'Couplet',
  13: 'Inventer une histoire',
  14: 'Réinventer une histoire',
};

export enum EnumMailType {
  COMMENTARY = 'commentary',
  REACTION = 'reaction',
}

export const hasSubscribed = async (activityId: number, userId: number, column: NotificationColumns) => {
  const userWhoComment = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const userIdWhoCreateActivity = activity?.userId;
  const userWhoCreateActivity = await AppDataSource.getRepository(User).findOne({ where: { id: userIdWhoCreateActivity } });

  // if (column === 'reaction') {
  //   const newActivity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activity?.responseActivityId } });
  //   userWhoCreateActivity = await AppDataSource.getRepository(User).findOne({ where: { id: newActivity?.userId } });
  //   userIdWhoCreateActivity = userWhoCreateActivity?.id;
  //   console.log('==========================');
  //   console.log('userWhoCreateActivity', userWhoCreateActivity);
  //   console.log('userIdWhoCreateActivity', userIdWhoCreateActivity);
  //   console.log('==========================');
  // }

  const whichNotification = await AppDataSource.createQueryBuilder()
    .select(`notifications.${column}`)
    .from(Notifications, 'notifications')
    .where('notifications.userId = :userIdWhoCreateActivity', { userIdWhoCreateActivity })
    .getOne();

  if (whichNotification && whichNotification[tableMapping[column] as keyof Notifications] === true && userWhoCreateActivity?.email) {
    const emailType = emailMapping[column];
    if (emailType === 4) {
      const activityType = activity?.type || 0;
      const activityName: string = activityNameMapper[activityType];
      const userName = userWhoComment?.school || '';
      await sendMail(emailType, userWhoCreateActivity.email, {
        userWhoComment: userName,
        activityType: activityName,
        url: `https://1v.parlemonde.org/activite/${activity?.id}`,
      });
    }
  }
};
