import type { Request, Response, NextFunction } from 'express';

import { ImageType } from '../../types/story.type';
import { Image } from '../entities/image';
import { UserType } from '../entities/user';
import { getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const storyController = new Controller('/stories');

/**
 * Image controller to get all Images from each category image table.
 *
 * @param {string} path url path
 * @param {number} userType user profile type
 * @returns {object} Route API JSON response
 */
storyController.get({ path: '/all', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const villageId = req.user.type <= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;

  if (!villageId) {
    next();
    return;
  }

  const [objectImages, placeImages, oddImages] = await Promise.all([
    AppDataSource.getRepository(Image)
      .createQueryBuilder('image')
      .where('image.villageId = :villageId', { villageId })
      .andWhere('image.imageType = :type', { type: ImageType.OBJECT })
      .orderBy('RAND()')
      .getMany(),
    AppDataSource.getRepository(Image)
      .createQueryBuilder('image')
      .where('image.villageId = :villageId', { villageId })
      .andWhere('image.imageType = :type', { type: ImageType.PLACE })
      .orderBy('RAND()')
      .getMany(),
    AppDataSource.getRepository(Image)
      .createQueryBuilder('image')
      .where('image.villageId = :villageId', { villageId })
      .andWhere('image.imageType = :type', { type: ImageType.ODD })
      .orderBy('RAND()')
      .getMany(),
  ]);

  res.sendJSON({ objects: objectImages, places: placeImages, odds: oddImages });
});

/**
 * Delete an image when it's not used by anyone.
 *
 * @param {string} path url path
 * @param {number} userType user profile type
 * @returns {void} status Ok or NOK
 */

storyController.delete({ path: '/:imageId', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.imageId, 10);
  const image = await AppDataSource.getRepository(Image).findOne({ where: { id } });
  const isAdmin = req.user && req.user.type >= UserType.ADMIN;
  if (image === undefined) {
    res.status(204).send();
    return;
  } else
    isAdmin
      ? await AppDataSource.getRepository(Image).delete({ id })
      : await AppDataSource.getRepository(Image).delete({ id, userId: req.user?.id ?? 0 });
  res.status(204).send();
});

export { storyController };
