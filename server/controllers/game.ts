import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import type { GameType } from '../../types/game.type';
import type { ActivityType } from '../entities/activity';
import { Activity } from '../entities/activity';
import { ActivityStatus } from '../entities/activity';
import { GameResponse } from '../entities/gameResponse';
import { Game } from '../entities/game';
import { UserType } from '../entities/user';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';

import { Controller } from './controller';

const gameController = new Controller('/games');

//--- Get all games ---
//TODO : je pense qu'il faut ici faire une requête personnalisé
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

//--- Play a game ---
gameController.get({ path: '/play', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId || Number(req.query.villageId);
  const type = req.query.type;

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
    .orderBy('game.createDate', 'DESC')
    .limit(1)
    .getOne();
  res.sendJSON(game || null);
});

//--- Activate play mode ---
gameController.get({ path: '/ableToPlay', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId || Number(req.query.villageId);
  const type = Number(req.query.type);

  const game = await getRepository(Game).createQueryBuilder('game').where('game.userId = :userId', { userId: userId }).getOne();
  const count = await getRepository(Game)
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
    .orderBy('game.createDate', 'DESC')
    .getCount();
  res.sendJSON({
    ableToPlay: game ? true : false,
    count: count,
  });
});

//--- retrieve all answers from all users response to game ---
gameController.get({ path: '/stats/:gameId', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const gameId = parseInt(req.params.gameId, 10) || 0;
  const gameResponses = await getRepository(GameResponse)
    .createQueryBuilder('gameResponse')
    .leftJoinAndSelect('gameResponse.user', 'user')
    .where('gameResponse.gameId = :gameId', { gameId: gameId })
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
  gameResponse.value = String(data.value);
  gameResponse.gameId = game.id;
  gameResponse.villageId = game.villageId;
  gameResponse.userId = userId;
  await getRepository(GameResponse).save(gameResponse);
  res.sendJSON(GameResponse);
});

export { gameController };
