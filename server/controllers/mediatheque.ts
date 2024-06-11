import type { Request, Response } from 'express';
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

    let subQueryBuilder = AppDataSource.getRepository(Activity)
      .createQueryBuilder('activity')
      .leftJoin('activity.user', 'user')
      .addSelect('user.school')
      .addSelect('user.type')
      .leftJoin('activity.village', 'village')
      .addSelect('village.name');

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
    const activities = await subQueryBuilder.andWhere('activity.status = :status', { status: 0 }).getMany();
    res.send(activities);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export { mediathequeController };
