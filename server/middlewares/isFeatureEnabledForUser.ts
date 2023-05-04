import type { Request, Response, NextFunction } from 'express';

import type { User } from '../entities/user';
import isFeatureEnabledForUser from '../utils/isFeatureEnabledForUser';

export async function featureEnabledMiddleware(featureName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = req.user;

    if (!user) {
      res.status(401).send({ error: 'Unauthorized.' });
      return;
    }

    if (await isFeatureEnabledForUser(user, featureName)) {
      next();
    } else {
      res.status(403).send({ error: 'Feature not enabled for this user.' });
    }
  };
}
