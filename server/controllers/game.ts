import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { GameResponse } from '../entities/gameResponse';
import { Game } from '../entities/game';
import { UserType } from '../entities/user';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { getQueryString } from '../utils';

import { Controller } from './controller';

const gameController = new Controller('/games');

//--- Get all games ---
gameController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  const games = await getRepository(Game).find();
  res.sendJSON(games);
});

//--- Get one game ---
gameController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const game = await getRepository(Game).findOne({ where: { id } });
  if (!game || (req.user.type === UserType.TEACHER && req.user.villageId !== game.villageId)) {
    next();
    return;
  }
  res.sendJSON(game);
});

//--- Get one random game to play ---
gameController.get({ path: '/play', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const type = parseInt(getQueryString(req.query.type) || '0', 10);
  if (!req.user || !req.query.type) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.type >= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;
  if (!villageId) {
    next();
    return;
  }
  const game = await getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.responses', 'responses')
    .where('game.userId <> :userId', { userId: userId })
    .andWhere('game.villageId = :villageId', { villageId: villageId })
    .andWhere('game.type = :type', { type: type })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(GameResponse, 'response')
          .where('response.userId = :userId', { userId: userId })
          .andWhere('response.gameId = game.id')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .orderBy('RAND()')
    .getOne();
  if (!game) {
    next();
    return;
  }
  res.sendJSON(game);
});

//--- Get number of games available ---
gameController.get({ path: '/ableToPlay', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const type = parseInt(getQueryString(req.query.type) || '0', 10);
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.type >= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;
  if (!villageId) {
    next();
    return;
  }
  // const game = await getRepository(Game).createQueryBuilder('game').where('`game`.`userId` = :userId', { userId: userId }).getOne();
  const count = await getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.responses', 'responses')
    .where('`game`.`userId` <> :userId', { userId: userId })
    .andWhere('`game`.`villageId` = :villageId', { villageId: villageId })
    .andWhere('`game`.`type` = :type', { type: type })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(GameResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.gameId = game.id`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .getCount();
  res.sendJSON({
    count: count,
  });
});

//--- retrieve answers to the mimic with this id ---
gameController.get({ path: '/stats/:gameId', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.sendJSON([]);
    return;
  }
  const gameId = parseInt(req.params.gameId, 10) || 0;
  const gameResponses = await getRepository(GameResponse)
    .createQueryBuilder('gameResponse')
    .leftJoinAndSelect('gameResponse.user', 'user')
    .where('`gameResponse`.`gameId` = :gameId', { gameId: gameId })
    .getMany();

  res.sendJSON(gameResponses || []);
});

type UpdateActivity = {
  value: string;
};

const ANSWER_M_SCHEMA: JSONSchemaType<UpdateActivity> = {
  type: 'object',
  properties: {
    value: {
      type: 'string',
    },
  },
  required: [],
  additionalProperties: false,
};

const answerGameValidator = ajv.compile(ANSWER_M_SCHEMA);

//--- Update a game response ---
gameController.put({ path: '/play/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const id = parseInt(req.params.id, 10) || 0;
  const userId = req.user.id;
  const data = req.body;

  if (!answerGameValidator(data)) {
    sendInvalidDataError(answerGameValidator);
    return;
  }

  const game = await getRepository(Game).findOne({ where: { id: id } });
  if (!game) {
    next();
    return;
  }
  const responses = await getRepository(GameResponse).find({ where: { userId: userId, gameId: id } });
  if (responses.length > 2) {
    next();
    return;
  }

  const gameResponse = new GameResponse();
  gameResponse.value = data.value;
  gameResponse.gameId = game.id;
  gameResponse.villageId = game.villageId;
  gameResponse.userId = userId;

  await getRepository(GameResponse).save(gameResponse);

  res.sendJSON(GameResponse);
});

export { gameController };
