import type { NextFunction, Request, Response } from 'express';
import { In } from 'typeorm';

import type { FeatureFlagsNames } from '../../types/featureFlag.constant';
import { UserType } from '../../types/user.type';
import { FeatureFlag } from '../entities/featureFlag';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const featureFlagController = new Controller('/featureFlags');

// Get all feature flags
featureFlagController.get({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const featureFlags = await AppDataSource.getRepository(FeatureFlag).find({ relations: ['users'] });
  res.json(featureFlags);
});

// Get all users of a feature flag
featureFlagController.get({ path: '/:featureFlagName/users', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const featureFlagName: FeatureFlagsNames = req.params.featureFlagName as FeatureFlagsNames;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { name: featureFlagName }, relations: ['users'] });

  if (!featureFlag) {
    res.status(404).json({ error: 'Feature flag not found.' });
    return;
  }

  res.json(featureFlag.users);
});

// Get a feature flag by name
featureFlagController.get({ path: '/:featureFlagName', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const featureFlagName: FeatureFlagsNames = req.params.featureFlagName as FeatureFlagsNames;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { name: featureFlagName } });

  if (!featureFlag) {
    res.status(404).json({ error: 'Feature flag not found.' });
    return;
  }

  res.json(featureFlag);
});

// Create or update an existing feature flag
featureFlagController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const data = req.body;
  let featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { name: data.name }, relations: ['users'] });
  const usersToAdd = data.users && data.users.length > 0 ? await AppDataSource.getRepository(User).find({ where: { id: In(data.users) } }) : [];

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    if (!featureFlag) {
      featureFlag = new FeatureFlag();
      featureFlag.name = data.name;
      featureFlag.isEnabled = data.isEnabled || false;
      featureFlag.users = [];
    } else {
      featureFlag.isEnabled = data.isEnabled ?? featureFlag.isEnabled;
    }
    const savedFeatureFlag = await transactionalEntityManager.getRepository(FeatureFlag).save(featureFlag);

    // Wait for all remove operations to complete
    await Promise.all(
      featureFlag.users
        .filter((user) => usersToAdd.find((u) => u.id === user.id) === undefined)
        .map((user) =>
          transactionalEntityManager
            .getRepository(FeatureFlag)
            .createQueryBuilder('featureFlag')
            .relation(FeatureFlag, 'users')
            .of(savedFeatureFlag.id)
            .remove(user.id),
        ),
    );

    // Wait for all add operations to complete
    await Promise.all(
      usersToAdd
        .filter((user) => (featureFlag?.users || []).find((u) => u.id === user.id) === undefined)
        .map((user) =>
          transactionalEntityManager
            .getRepository(FeatureFlag)
            .createQueryBuilder('featureFlag')
            .relation(FeatureFlag, 'users')
            .of(savedFeatureFlag.id)
            .add(user.id),
        ),
    );
  });

  const updatedFeatureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { name: data.name },
    relations: ['users'],
  });

  res.sendJSON(updatedFeatureFlag);
});

// Update a feature flag
featureFlagController.put({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const data = req.body;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { id },
    relations: ['users'],
  });

  if (!featureFlag) return next();

  featureFlag.name = data.name ?? featureFlag.name;
  featureFlag.isEnabled = data.isEnabled ?? featureFlag.isEnabled;
  await AppDataSource.getRepository(FeatureFlag).save(featureFlag);

  if (data.userIds !== undefined) {
    featureFlag.users = await AppDataSource.getRepository(User).find({ where: { id: In(data.userIds) } });
    await AppDataSource.getRepository(FeatureFlag).save(featureFlag);
  }

  const updatedFeatureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({
    where: { id },
    relations: ['users'],
  });
  res.json(updatedFeatureFlag);
});

// Delete a feature flag
featureFlagController.delete({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10) || 0;
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { id }, relations: ['users'] });

  if (!featureFlag) return next();

  await AppDataSource.getRepository(FeatureFlag).remove(featureFlag);
  res.status(204).send();
});

export default featureFlagController;
