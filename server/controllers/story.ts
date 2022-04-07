import type { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { ImageType } from '../../types/story.type';
import { Image } from '../entities/image';
import { UserType } from '../entities/user';
import { getQueryString } from '../utils';

import { Controller } from './controller';

const storyController = new Controller('/stories');

/**
 * Image controller to get all Images from image table.
 *
 * @param {string} path url path
 * @param {number} userType user profile type
 * @returns {string} Route API JSON response
 */
storyController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const villageId = req.user.type >= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;
  if (!villageId) {
    next();
    return;
  }

  const objectImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.OBJECT })
    .orderBy('RAND()')
    .getOne();
  // .limit(6)
  // .getMany();

  const placeImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.PLACE })
    .orderBy('RAND()')
    .getOne();
  // .limit(6)
  // .getMany();

  const oddImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.ODD })
    .orderBy('RAND()')
    .getOne();
  // .limit(6)
  // .getMany();

  res.sendJSON({ object: objectImages, place: placeImages, odd: oddImages });
});

export { storyController };
