import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import type { GameDataMonneyOrExpression, GameDataStep } from '../../types/game.type';
import type { ActivityContent } from '../entities/activity';
import { Activity, ActivityType, ActivityStatus } from '../entities/activity';
import { Game } from '../entities/game';
import { GameResponse } from '../entities/gameResponse';
import { UserType } from '../entities/user';
import { getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

const gameController = new Controller('/games');

type GameGetter = {
  limit?: number;
  page?: number;
  villageId: number;
  type: number;
  userId?: number;
  subType?: number;
};

/**
 * return games
 * @param limit -  by default 200 - optional
 * @param pages -  indicate number of page to render by default 0 - optional
 * @param villageId id from village
 * @param type game type
 * @param userId -  id of user - optional
 *
 * @returns Game[]
 */
const getGames = async ({ limit = 200, page = 0, villageId, type, userId, subType }: GameGetter) => {
  let subQueryBuilder = AppDataSource.getRepository(Game)
    .createQueryBuilder('game')
    .where('game.villageId = :villageId', { villageId: villageId })
    .andWhere('game.type = :type', { type: type });
  if (userId !== undefined) {
    subQueryBuilder = subQueryBuilder.andWhere('game.userId = :userId', { userId });
  }

  const games = await subQueryBuilder
    .orderBy('game.createDate', 'DESC')
    .limit(limit)
    .offset(page * limit)
    .getMany();

  return games;
};

//--- Get all games ---
gameController.get({ path: '', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const userId = getQueryString(req.query.userId) === 'self' ? req.user.id : undefined;
  const type = parseInt(getQueryString(req.query.type) || '0', 10);
  const villageId = Number(getQueryString(req.query.villageId)) || 0;
  const subType = parseInt(getQueryString(req.query.subType) || '0', 10);

  const games = await getGames({ villageId, type, userId });

  res.sendJSON(games);
});

//--- Get one game ---
gameController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const game = await AppDataSource.getRepository(Game).findOne({ where: { id } });
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
  const villageId = req.user.type <= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;
  if (!villageId) {
    next();
    return;
  }
  const game = await AppDataSource.getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.responses', 'responses')
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
          .andWhere('response.isOldResponse = 0')
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

// --- Get the last created game ---
gameController.get({ path: '/latest', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const villageId = Number(getQueryString(req.query.villageId)) || 0;
  const type = parseInt(getQueryString(req.query.type) || '0', 10);

  const latestGame = await AppDataSource.getRepository(Game)
    .createQueryBuilder('game')
    .where('game.villageId = :villageId', { villageId: villageId })
    .andWhere('game.type = :type', { type: type })
    .orderBy('game.createDate', 'DESC')
    .getMany();

  if (!latestGame) {
    next();
    return;
  }

  res.sendJSON(latestGame);
});

//--- Get number of games available ---
gameController.get({ path: '/ableToPlay', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const type = parseInt(getQueryString(req.query.type) || '0', 10);
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.type <= UserType.TEACHER ? parseInt(getQueryString(req.query.villageId) || '0', 10) || null : req.user.villageId;
  if (!villageId) {
    next();
    return;
  }
  if (type === 0) {
    const games = await AppDataSource.getRepository(Game)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.responses', 'responses')
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
            .andWhere(`response.isOldResponse = 0`)
            .getQuery();
          return 'NOT EXISTS ' + subQuery;
        },
        { userId: req.user.id },
      )
      .getMany();
    res.sendJSON({
      games: games,
    });
  }
});

//--- retrieve answers to the mimic with this id ---
gameController.get({ path: '/stats/:gameId', userType: UserType.TEACHER }, async (req: Request, res: Response) => {
  if (!req.user) {
    res.sendJSON([]);
    return;
  }
  const gameId = parseInt(req.params.gameId, 10) || 0;
  const gameResponses = await AppDataSource.getRepository(GameResponse)
    .createQueryBuilder('gameResponse')
    .leftJoinAndSelect('gameResponse.user', 'user')
    .where('`gameResponse`.`gameId` = :gameId', { gameId: gameId })
    .andWhere('user.type <> :userType', { userType: UserType.OBSERVATOR }) //Observator can play but don't affect the stats
    .andWhere('gameResponse.isOldResponse = 0')
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

// reset games, put all isOldResponse to true to enable replay
gameController.put({ path: '/resetResponses', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const { id: userId } = req.user;
  await AppDataSource.createQueryBuilder().update(GameResponse).set({ isOldResponse: true }).where(' userId = :userId', { userId: userId }).execute();

  res.sendJSON(GameResponse);
});

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

  const game = await AppDataSource.getRepository(Game).findOne({ where: { id: id } });
  if (!game) {
    next();
    return;
  }
  const responses = await AppDataSource.getRepository(GameResponse).find({ where: { userId: userId, id: id } });
  if (responses.length > 2) {
    next();
    return;
  }

  const gameResponse = new GameResponse();
  gameResponse.value = data.value;
  gameResponse.gameId = game.id;
  gameResponse.villageId = game.villageId;
  gameResponse.userId = userId;

  await AppDataSource.getRepository(GameResponse).save(gameResponse);
  res.sendJSON(GameResponse);
});

//--- Create a standardised game ---

gameController.post({ path: '/standardGame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const data = req.body;
  const game1 = data.game1;
  const game2 = data.game2;
  const game3 = data.game3;

  createGame(game1, data.userId, data.villageId, data.type, data.subType, data.selectedPhase);
  createGame(game2, data.userId, data.villageId, data.type, data.subType, data.selectedPhase);
  createGame(game3, data.userId, data.villageId, data.type, data.subType, data.selectedPhase);

  res.sendStatus(200);
});

async function createGame(data: ActivityContent[], userId: number, villageId: number, type: number, subType: number, selectedPhase: number) {
  const activity = new Activity();
  activity.type = type;
  activity.subType = subType;
  activity.status = ActivityStatus.PUBLISHED;
  // TODO: Travailler sur le type de data
  activity.data = data;
  activity.phase = selectedPhase;
  activity.content = data;
  activity.userId = userId;
  activity.villageId = villageId;
  activity.responseActivityId = null;
  activity.responseType = null;
  activity.isPinned = false;
  activity.displayAsUser = false;

  await AppDataSource.getRepository(Activity).save(activity);
}

// --- Get all games standardised by subType ---

gameController.get({ path: '/allStandardGame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }

  const subType = parseInt(getQueryString(req.query.subType) || '0', 10);

  const subQueryBuilder = AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .where('activity.villageId = :villageId', { villageId: req.user.villageId })
    .andWhere('activity.type = :type', { type: 4 })
    .andWhere('activity.subType = :subType', { subType: subType });

  const games = await subQueryBuilder
    .orderBy('activity.createDate', 'DESC')
    .limit(200)
    .offset(0 * 200)
    .getMany();

  res.sendJSON(games);
});

// --- Get one game standardised ---

gameController.get({ path: '/standardGame/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const game = await AppDataSource.getRepository(Activity).findOne({ where: { id } });
  if (!game || (req.user.type === UserType.TEACHER && req.user.villageId !== game.villageId)) {
    next();
    return;
  }
  res.sendJSON(game);
});

// --- Get one random game standardised to play ---
gameController.get({ path: '/playStandardGame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const villageId = req.user.villageId;
  const type = 4;
  // const subType = req.subType;
  const subType = 2;
  const game = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .andWhere('activity.villageId = :villageId', { villageId: villageId })
    .andWhere('activity.type = :type', { type: type })
    .andWhere('activity.subType = :subType', { subType: subType })
    .orderBy('RAND()')
    .getOne();
  if (!game) {
    next();
    return;
  }
  res.sendJSON(game);
});

// --- Get the last created game standardised ---

gameController.get({ path: '/latestStandard', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const villageId = req.user.villageId;
  const type = 4;
  // const subType = req.subType;
  const subType = 2;
  const latestGame = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .where('activity.villageId = :villageId', { villageId: villageId })
    .andWhere('activity.type = :type', { type: type })
    .andWhere('activity.subType = :subType', { subType: subType })
    .orderBy('activity.createDate', 'DESC')
    .getOne();

  if (!latestGame) {
    next();
    return;
  }

  res.sendJSON(latestGame);
});

// --- Get all games standardised available ---

gameController.get({ path: '/ableToPlayStandardGame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId;
  const type = 4;
  // const subType = req.subType;
  const subType = 2;

  const games = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .leftJoin(GameResponse, 'GameResponse')
    .andWhere('`activity`.`villageId` = :villageId', { villageId: villageId })
    .andWhere('`activity`.`type` = :type', { type: type })
    .andWhere('`activity`.`subType` = :subType', { subType: 2 })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(GameResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.gameId = activity.id`)
          .andWhere(`response.isOldResponse = 0`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .getMany();
  res.sendJSON({
    activities: games,
  });
});

// --- Get number of games standardised available ---

gameController.get({ path: '/countAbleToPlayStandardGame', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId;
  const type = 4;
  const subType = parseInt(getQueryString(req.query.subType) || '0', 10);

  const gameCount = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .leftJoin(GameResponse, 'GameResponse')
    .andWhere('`activity`.`villageId` = :villageId', { villageId: villageId })
    .andWhere('`activity`.`type` = :type', { type: type })
    .andWhere('`activity`.`subType` = :subType', { subType: subType })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(GameResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.gameId = activity.id`)
          .andWhere(`response.isOldResponse = 0`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .getCount();
  res.sendJSON({
    count: gameCount,
  });
});

export { gameController };
