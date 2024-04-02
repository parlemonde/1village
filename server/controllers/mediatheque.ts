import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.get({ path: '' }, async (req, res) => {
  console.log('===========================');
  console.log('req.body');
  console.log(req.body);
  console.log('req.query');
  console.log(req.query);
  console.log('===========================');

  const filters: Filter[] = req?.body?.filters || [];
  const offset = req?.query?.offset || 0;

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user').where('1=1');

  filters.map(({ table, column, value }) => {
    subQueryBuilder = subQueryBuilder.andWhere(`${table}.${column} = :value`, { value });
  });
  console.log('offset', offset);
  const activities = await subQueryBuilder.limit(6).offset(offset).getMany();
  res.send(activities);
});

export { mediathequeController };
