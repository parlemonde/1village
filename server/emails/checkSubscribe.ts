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
} as const;

type NotificationColumns = typeof tableMapping[keyof typeof tableMapping];

export const emailMapping: Record<NotificationColumns, number> = {
  [tableMapping.commentary]: 1,
  [tableMapping.reaction]: 2,
  [tableMapping.publicationFromSchool]: 3,
  [tableMapping.publicationFromAdmin]: 4,
  [tableMapping.creationAccountFamily]: 5,
  [tableMapping.openingVillageStep]: 6,
};

export const activityNameMapper: Record<number, string> = {
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

export const getEmailInformation = async (activityId: number, userId: number, column: NotificationColumns) => {
  const commentAuthor = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  const activity = await AppDataSource.getRepository(Activity).findOne({ where: { id: activityId } });
  const activityCreatorId = activity?.userId;
  const activityCreator = await AppDataSource.getRepository(User).findOne({ where: { id: activityCreatorId } });
  const classInformation = `La classe de ${commentAuthor?.level} à ${commentAuthor?.city}`;

  const notificationRules = await AppDataSource.createQueryBuilder()
    .select(`notifications.${column}`)
    .from(Notifications, 'notifications')
    .where('notifications.userId = :activityCreatorId', { activityCreatorId })
    .getOne();

  return { commentAuthor, notificationRules, activityCreator, activity, column, classInformation };
};

type HasSubscribeProps = {
  emailType: number;
  notificationRules: Notifications | null;
  activityCreator: User | null;
  column: NotificationColumns;
};

export const hasSubscribed = ({ emailType, notificationRules, activityCreator, column }: HasSubscribeProps) => {
  if (
    emailType === emailMapping.commentary &&
    notificationRules &&
    notificationRules[tableMapping[column] as keyof Notifications] === true &&
    activityCreator?.email
  ) {
    return true;
  }
  return false;
};
