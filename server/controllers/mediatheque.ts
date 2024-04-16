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
  const activities = await subQueryBuilder
    .limit(6)
    .offset(offset as number)
    .getMany();
  res.send(activities);
});

export { mediathequeController };
