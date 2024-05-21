import { Brackets } from 'typeorm';

import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.post({ path: '' }, async (req, res) => {
  const filters: Array<Filter[]> = req?.body?.filters || [];
  const offset = req?.query?.offset || 0;

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user');

  filters.map((filter, index) => {
    subQueryBuilder = subQueryBuilder[index === 0 ? 'where' : 'orWhere'](
      new Brackets((qb) => {
        filter.map(({ table, column, values }, subQueryIndex) => {
          let condition = '';
          values.map((_value, valueIndex) => {
            condition += valueIndex > 0 ? ' or ' : '(';
            condition += `${table}.${column} = ${values[valueIndex]}`;
          });
          condition += ')';
          qb[subQueryIndex === 0 ? 'where' : 'andWhere'](condition);
        });
      }),
    );
  });
  const activities = await subQueryBuilder
    .limit(6)
    .offset(offset as number)
    .getMany();
  res.send(activities);
});

mediathequeController.post({ path: '/count' }, async (req, res) => {
  try {
    const filters: Array<Filter[]> = req?.body?.filters || [];

    let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user');

    filters.map((filter, index) => {
      subQueryBuilder = subQueryBuilder[index === 0 ? 'where' : 'orWhere'](
        new Brackets((qb) => {
          filter.map(({ table, column, values }, subQueryIndex) => {
            let condition = '';
            values.map((_value, valueIndex) => {
              condition += valueIndex > 0 ? ' or ' : '(';
              condition += `${table}.${column} = ${values[valueIndex]}`;
            });
            condition += ')';
            qb[subQueryIndex === 0 ? 'where' : 'andWhere'](condition);
          });
        }),
      );
    });
    const count = await subQueryBuilder.getMany();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { mediathequeController };
