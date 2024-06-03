import { Brackets } from 'typeorm';

import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

const getMedias = async (result: any[], queryBuilder, offset, limit) => {
  const activities: Array<any> = await queryBuilder
    .limit(limit ? parseInt(limit) : undefined)
    .offset(offset ? parseInt(offset) : undefined)
    .getMany();
  // console.log('offset');
  // console.log(offset);
  // console.log('limit');
  // console.log(limit);
  // console.log('activities');
  // console.log(activities);
  const activitiesMediaFinder = activities.map(({ id, content, subType, type, villageId, userId, user }) => {
    // let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoinAndSelect('activity.user', 'user');
    // subQueryBuilder = subQueryBuilder.addSelect(['user.countrycode']);
    // const activitiesWithUserData = await subQueryBuilder.getMany();
    const result = { id, subType, type, villageId, userId, medias: [], user };
    if (content.game) {
      content.game.map(({ inputs }) =>
        inputs.map((input: { type: number; selectedValue: string }) => {
          if (input.type === 3 || input.type === 4) {
            result.medias.push({ type: input.type === 3 ? 'image' : 'video', value: input.selectedValue });
          }
        }),
      );
    } else {
      content.map(({ type, value }) => {
        const wantedTypes = ['image', 'video', 'sound'];
        if (wantedTypes.includes(type)) {
          result.medias.push({ type, value });
        }
      });
    }
    return result;
  });

  const activitiesWithMediaOnly = activitiesMediaFinder.filter((a) => a.medias.length > 0);
  result = [...result, ...activitiesWithMediaOnly];

  if (!limit) {
    return { activities: result, offset: offset + limit };
  }
  const oldLength = result.length;
  result = result.slice(0, limit);
  // console.log('resultPOPOPO');
  // console.log(result);
  const newLength = result.length;
  const hasReduced = oldLength !== newLength;

  if (result.length < limit) {
    if (activities.length < limit) {
      return { activities: result, offset: offset + limit };
    }
    const lastActivityInResultIndex = activities.findIndex((a) => a.id === result[result.length - 1]);
    const newOffset = hasReduced ? offset + lastActivityInResultIndex + 1 : offset + limit;
    return await getMedias(result, queryBuilder, newOffset, limit);
  }
  return { activities: result, offset: offset + limit };
};

mediathequeController.post({ path: '' }, async (req, res) => {
  const filters: Array<Filter[]> = req?.body?.filters || [];
  const offset: string | undefined = req?.query?.offset as string;
  const limit: string | undefined = req?.query?.limit as string;
  let subQueryBuilder = AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .innerJoinAndSelect('activity.user', 'user') // Join and select the user
    .addSelect(['user.countrycode']); // Select the countrycode

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
  const activitiesWithMediaOnly = await getMedias([], subQueryBuilder, offset ? parseInt(offset) : undefined, limit ? parseInt(limit) : undefined);
  // console.log('activitiesWithMediaOnly');
  // console.log(activitiesWithMediaOnly);

  res.send(activitiesWithMediaOnly);
});

export { mediathequeController };
