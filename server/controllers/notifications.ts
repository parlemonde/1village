import type { Request, Response } from 'express';

import { Notifications } from '../entities/notifications';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const EditNotificationPreferences = async (notification: Notifications) => {
  const { userId, ...preferences } = notification;
  const userApprovedNotifications: Notifications | null = await AppDataSource.getRepository(Notifications).findOne({
    where: { userId: userId },
  });

  let newNotification = new Notifications();
  if (!userApprovedNotifications) {
    newNotification = { ...newNotification, userId, ...preferences };
  } else {
    newNotification = { ...userApprovedNotifications, ...preferences };
  }
  try {
    await AppDataSource.getRepository(Notifications).save(newNotification);
  } catch (e) {
    throw new Error('erreur de sauvegarde de la notification');
  }
};

const notificationsController = new Controller('/notifications');

notificationsController.get({ path: '/users/:userId' }, async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userNotifications = await AppDataSource.getRepository(Notifications).findOne({
      where: { userId: parseInt(userId, 10) },
    });

    if (!userNotifications) {
      return res.status(200).json({
        commentary: false,
        reaction: false,
        publicationFromSchool: false,
        publicationFromAdmin: false,
        creationAccountFamily: false,
        openingVillageStep: false,
      });
    }

    return res.status(200).json({
      commentary: userNotifications.commentary,
      reaction: userNotifications.reaction,
      publicationFromSchool: userNotifications.publicationFromSchool,
      publicationFromAdmin: userNotifications.publicationFromAdmin,
      creationAccountFamily: userNotifications.creationAccountFamily,
      openingVillageStep: userNotifications.openingVillageStep,
    });
  } catch (e) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

notificationsController.put({ path: '/subscribe/:userId' }, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { data } = req.body;

  let newNotification = new Notifications();
  newNotification = { ...Notifications, userId, ...data };
  try {
    await EditNotificationPreferences(newNotification);
  } catch (e) {
    return res.status(500).json({ message: 'erreur de sauvegarde de vos choix, veuillez réessayer ultérieurement' });
  }
  res.status(200).json({ message: 'Notifications mises à jour' });
});

export { notificationsController };
