import type { NextFunction, Request, Response } from 'express';
import { In } from 'typeorm';

import { FeatureFlag } from '../entities/featureFlag';
import { User, UserType } from '../entities/user';
import { UserToFeatureFlag } from '../entities/userToFeatureFlag';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const featureFlagController = new Controller('/featureFlags');

// Get all feature flags
featureFlagController.get({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const featureFlags = await AppDataSource.getRepository(FeatureFlag).find({ relations: ['userToFeatureFlags', 'userToFeatureFlags.user'] });
  res.json(featureFlags);
});

// Create a feature flag
featureFlagController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const data = req.body;
  const featureFlag = new FeatureFlag();
  featureFlag.name = data.name;
  featureFlag.isEnabled = data.isEnabled || false;

  const newFeatureFlag = await AppDataSource.getRepository(FeatureFlag).save(featureFlag);

  if (data.users && data.users.length > 0) {
    const users = await AppDataSource.getRepository(User).find({ where: { id: In(data.users) } });
    const userToFeatureFlags = users.map((user) => {
      const userToFeatureFlag = new UserToFeatureFlag();
      userToFeatureFlag.user = user;
      userToFeatureFlag.featureFlag = newFeatureFlag;
      return userToFeatureFlag;
    });
    await AppDataSource.getRepository(UserToFeatureFlag).save(userToFeatureFlags);
  }

  const savedFeatureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { id: newFeatureFlag.id },
    relations: ['userToFeatureFlags', 'userToFeatureFlags.user'],
  });
  res.status(201).json(savedFeatureFlag);
});

// Update a feature flag
featureFlagController.put({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const data = req.body;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { id },
    relations: ['userToFeatureFlags', 'userToFeatureFlags.user'],
  });

  if (!featureFlag) return next();

  featureFlag.name = data.name ?? featureFlag.name;
  featureFlag.isEnabled = data.isEnabled ?? featureFlag.isEnabled;
  await AppDataSource.getRepository(FeatureFlag).save(featureFlag);

  if (data.userIds !== undefined) {
    await AppDataSource.getRepository(UserToFeatureFlag).delete({ featureFlag: { id: featureFlag.id } });
    const users = await AppDataSource.getRepository(User).find({ where: { id: In(data.userIds) } });
    const userToFeatureFlags = users.map((user) => {
      const userToFeatureFlag = new UserToFeatureFlag();
      userToFeatureFlag.user = user;
      userToFeatureFlag.featureFlag = featureFlag;
      return userToFeatureFlag;
    });
    await AppDataSource.getRepository(UserToFeatureFlag).save(userToFeatureFlags);
  }

  const updatedFeatureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { id },
    relations: ['userToFeatureFlags', 'userToFeatureFlags.user'],
  });
  res.json(updatedFeatureFlag);
});

// Delete a feature flag
featureFlagController.delete({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { id } });

  if (!featureFlag) return next();

  // Delete the related UserToFeatureFlag entities
  await AppDataSource.getRepository(UserToFeatureFlag).delete({ featureFlag: { id: featureFlag.id } });

  await AppDataSource.getRepository(FeatureFlag).remove(featureFlag);
  res.status(204).send();
});

export default featureFlagController;
