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

notificationsController.put({ path: '/suscribe/:userId' }, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { data } = req.body;

  let newNotification = new Notifications();
  newNotification = { ...Notifications, userId, ...data };
  try {
    await EditNotificationPreferences(newNotification);
  } catch (e) {
    res.status(500).json({ message: 'erreur de sauvegarde de vos choix, veuillez réessayer ultérieurement' });
  }
  res.status(200).json({ message: 'Notifications mises à jour' });
});

export { notificationsController };
