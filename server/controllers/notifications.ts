import type { NextFunction, Request, Response } from 'express';

import { Notifications } from '../entities/notifications';
import { User, UserType } from '../entities/user';
import { Controller } from './controller';

const notificationsController = new Controller('/notifications');
notificationsController.put({ path: '/:userId' }, async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const data = req.body;
  console.log('===============================================');
  console.log(userId);
  console.log('===============================================');
  console.log("Boucle sur l'objet data et comparé valeur si pas la meme valeur alors remplace dans la BDD");

  console.log(data);
  res.status(200).json({ message: 'ok' });
});

export { notificationsController };
