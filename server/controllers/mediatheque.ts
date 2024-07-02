import type { Request, Response } from 'express';

import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.get({ path: '' }, async (req: Request, res: Response) => {
  try {
    const subQueryBuilder = AppDataSource.getRepository(Activity)
      .createQueryBuilder('activity')
      .leftJoin('activity.user', 'user')
      .addSelect('user.school')
      .addSelect('user.type')
      .addSelect('user.countryCode')
      .leftJoin('activity.village', 'village')
      .addSelect('village.name')
      .addSelect('village.countryCodes');

    const activitiesToFilter = await subQueryBuilder.getMany();
    const activities = activitiesToFilter.filter((status) => status.status === 0);
    res.send(activities);
  } catch (error) {
    console.error('Error fetching media data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export { mediathequeController };
