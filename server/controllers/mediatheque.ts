import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.post({ path: '' }, async (req, res) => {
  const filters: Filter[] = req?.body?.filters || [];
  const offset = req?.query?.offset || 0;

  console.log('===========================');
  console.log('filters :', filters);
  console.log('offset :', offset);
  console.log('===========================');

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user').where('1=1');

  filters.map(({ table, column, value }) => {
    subQueryBuilder = subQueryBuilder.andWhere(`${table}.${column} = :value`, { value });
  });
  const activities = await subQueryBuilder
    .limit(6)
    .offset(offset as number)
    .getMany();
  res.send(activities);
});

export { mediathequeController };
