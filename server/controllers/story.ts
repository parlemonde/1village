import type { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { ImageType } from '../../types/story.type';
import { Activity, ActivityType } from '../entities/activity';
import { Image } from '../entities/image';
import { UserType } from '../entities/user';
import { getQueryString } from '../utils';

import { Controller } from './controller';

const storyController = new Controller('/stories');

/**
 * Image controller to get 1 random Images from each category image table.
 *
 * @param {string} path url path
 * @param {number} userType user profile type
 * @returns {object} Route API JSON response
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
    .where('image.villageId = :villageId', { villageId: villageId })
    .andWhere('image.imageType = :type', { type: ImageType.OBJECT })
    .orderBy('RAND()')
    .getOne();

  const placeImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId: villageId })
    .andWhere('image.imageType = :type', { type: ImageType.PLACE })
    .orderBy('RAND()')
    .getOne();

  const oddImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId: villageId })
    .andWhere('image.imageType = :type', { type: ImageType.ODD })
    .orderBy('RAND()')
    .getOne();

  res.sendJSON({ object: objectImages, place: placeImages, odd: oddImages });
});

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

  const villageId = req.user.type >= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;

  if (!villageId) {
    next();
    return;
  }

  const objectImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.OBJECT })
    .getMany();

  const placeImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.PLACE })
    .orderBy('RAND()')
    .getMany();

  const oddImages = await getRepository(Image)
    .createQueryBuilder('image')
    .where('image.villageId = :villageId', { villageId })
    .andWhere('image.imageType = :type', { type: ImageType.ODD })
    .orderBy('RAND()')
    .getMany();

  res.sendJSON({ objects: objectImages, places: placeImages, odds: oddImages });
});

/**
 * Image controller to get story activityId.
 *
 * @param {string} path url path
 * @param {number} userType user profile type
 * @returns {object} Route API JSON response
 */

storyController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const id = parseInt(req.params.id, 10) || 0;

  const storyActivityIds = await getRepository(Activity)
    .createQueryBuilder('activity')
    .where('activity.type = :type', { type: ActivityType.RE_INVENT_STORY })
    .getRawMany();

  res.sendJSON({ storyActivityIds });
});

export { storyController };
