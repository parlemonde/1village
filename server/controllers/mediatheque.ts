import type { NextFunction, Request, Response } from 'express';
import { In } from 'typeorm';

import type { FeatureFlagsNames } from '../../types/featureFlag.constant';
import { Activity } from '../entities/activity';
import { FeatureFlag } from '../entities/featureFlag';
import { User, UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

type filter = {
  table: string;
  column: string;
  value: number;
};

const mediatheque = new Controller('/mediatheque');

// Get all feature flags
mediatheque.get({ path: '/tests' }, async (req: Request, res: Response) => {
  const filters: filter[] = req.body.filters || [];
  const offset = req.body.offset || 0;
  const subQueryBuilder = await AppDataSource.getRepository(User).createQueryBuilder('user').select('user.id').where('1=1');
  filters
    .filter((f) => f.table === 'user')
    .map(({ table, column, value }) => {
      subQueryBuilder.andWhere(`user.${column} = :value`, { table, column, value });
    });
  subQueryBuilder
    .leftJoin((qb) => {
      qb.select('*').from(Activity, 'activity').where('activity.userId = user.id');
      filters
        .filter((f) => f.table === 'activity')
        .map(({ table, column, value }) => {
          subQueryBuilder.andWhere(`activity.${column} = :value`, { value });
        });
    }, 'toto')
    .limit(6)
    .offset(offset)
    .getMany();
  res.json(subQueryBuilder);
});

export default mediatheque;
