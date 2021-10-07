/* eslint-disable no-console */
import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { MimiqueResponseValue } from '../../types/mimiqueResponse.type';
import { MimiqueResponse } from '../entities/mimiqueResponse';
import { Mimique } from '../entities/mimique';
import { UserType } from '../entities/user';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';

import { Controller } from './controller';

const mimiqueController = new Controller('/mimiques');

mimiqueController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const mimique = await getRepository(Mimique).findOne({ where: { id } });
  if (!mimique || (req.user.type === UserType.TEACHER && req.user.villageId !== mimique.villageId)) {
    next();
    return;
  }
  res.sendJSON(mimique);
});

mimiqueController.get({ path: '/play', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId || Number(req.query.villageId);
  console.log('villageId : ' + villageId);
  const mimique = await getRepository(Mimique)
    .createQueryBuilder('mimique')
    .leftJoinAndSelect('mimique.responses', 'responses')
    .where('`mimique`.`userId` <> :userId', { userId: userId })
    .andWhere('`mimique`.`villageId` = :villageId', { villageId: villageId })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(MimiqueResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.mimiqueId = mimique.id`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .orderBy('`mimique`.`createDate`', 'DESC')
    .limit(1)
    .getOne();

  res.sendJSON(mimique || null);
});

mimiqueController.get({ path: '/ableToPlay', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId || Number(req.query.villageId);
  console.log('villageId : ' + villageId);
  const mimique = await getRepository(Mimique).createQueryBuilder('mimique').where('`mimique`.`userId` = :userId', { userId: userId }).getOne();
  const count = await getRepository(Mimique)
    .createQueryBuilder('mimique')
    .leftJoinAndSelect('mimique.responses', 'responses')
    .where('`mimique`.`userId` <> :userId', { userId: userId })
    .andWhere('`mimique`.`villageId` = :villageId', { villageId: villageId })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(MimiqueResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.mimiqueId = mimique.id`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .orderBy('`mimique`.`createDate`', 'DESC')
    .getCount();
  res.sendJSON({
    ableToPlay: mimique ? true : false,
    count: count,
  });
});

mimiqueController.get({ path: '/stats/:mimiqueId', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const mimiqueId = parseInt(req.params.mimiqueId, 10) || 0;
  const mimiqueResponses = await getRepository(MimiqueResponse)
    .createQueryBuilder('mimiqueResponse')
    .leftJoinAndSelect('mimiqueResponse.user', 'user')
    .where('`mimiqueResponse`.`mimiqueId` = :mimiqueId', { mimiqueId: mimiqueId })
    .getMany();

  res.sendJSON(mimiqueResponses || []);
});

type UpdateActivity = {
  value: MimiqueResponseValue;
};

const ANSWER_M_SCHEMA: JSONSchemaType<UpdateActivity> = {
  type: 'object',
  properties: {
    value: {
      type: 'number',
      enum: [MimiqueResponseValue.SIGNIFICATION, MimiqueResponseValue.FAKE_SIGNIFICATION_1, MimiqueResponseValue.FAKE_SIGNIFICATION_2],
      nullable: false,
    },
  },
  required: [],
  additionalProperties: false,
};

const answerMimiqueValidator = ajv.compile(ANSWER_M_SCHEMA);

mimiqueController.put({ path: '/play/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const id = parseInt(req.params.id, 10) || 0;
  const userId = req.user.id;
  const data = req.body;

  if (!answerMimiqueValidator(data)) {
    sendInvalidDataError(answerMimiqueValidator);
    return;
  }

  const mimique = await getRepository(Mimique).findOne({ where: { id: id } });
  if (!mimique) {
    next();
    return;
  }
  const responses = await getRepository(MimiqueResponse).find({ where: { userId: userId, mimiqueId: id } });
  if (responses.length > 2) {
    next();
    return;
  }

  const mimiqueResponse = new MimiqueResponse();
  mimiqueResponse.value = data.value;
  mimiqueResponse.mimiqueId = mimique.id;
  mimiqueResponse.villageId = mimique.villageId;
  mimiqueResponse.userId = userId;

  await getRepository(MimiqueResponse).save(mimiqueResponse);

  res.sendJSON(mimiqueResponse);
});

export { mimiqueController };
