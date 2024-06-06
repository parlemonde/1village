import type { Request, Response } from 'express';
import { map } from 'leaflet';
import { Brackets } from 'typeorm';

import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.post({ path: '' }, async (req: Request, res: Response) => {
  try {
    const filters: Array<Filter[]> = req.body.filters || [];

    if (!Array.isArray(filters)) {
      return res.status(400).send({ error: 'Invalid filters format' });
    }

    let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user');

    filters.map((filter, index) => {
      subQueryBuilder = subQueryBuilder[index === 0 ? 'where' : 'orWhere'](
        new Brackets((qb) => {
          filter.map(({ table, column, values }, subQueryIndex) => {
            let condition = '';
            values.map((value, valueIndex) => {
              condition += valueIndex > 0 ? ' or ' : '(';
              condition += `${table}.${column} = ${values[valueIndex]}`;
            });
            condition += ')';
            qb[subQueryIndex === 0 ? 'where' : 'andWhere'](condition);
          });
        }),
      );
    });
    const activities = await subQueryBuilder.getMany();
    res.send(activities);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

mediathequeController.post({ path: '/pelico' }, async (req: Request, res: Response) => {
  try {
    const filters: Array<Filter[]> = req.body.filters || [];

    if (!Array.isArray(filters)) {
      return res.status(400).send({ error: 'Invalid filters format' });
    }

    const subQueryBuilderUser = AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .where('user.type = :superAdmin', { superAdmin: 0 })
      .orWhere('user.type = :admin', { admin: 1 })
      .orWhere('user.type = :mediator', { mediator: 2 });

    const users = await subQueryBuilderUser.getMany();

    const usersId: number[] = users.map((user) => user.id);

    const subQueryBuilderActivity = AppDataSource.getRepository(Activity)
      .createQueryBuilder('activity')
      .where('activity.userId IN (:...usersId)', { usersId });

    const activities = await subQueryBuilderActivity.getMany();

    res.send(activities);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export { mediathequeController };
