import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import path from 'path';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { getApp } from '../app';
import { Activity } from '../entities/activity';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { fakeUser, loginUser } from './mock';

// Mock connection to database to avoid error message in console.
jest.mock('../utils/database', () => ({
  connection: Promise.resolve(),
}));

// Mock frontend NextJS library. We don't need it for testing.
jest.mock('next', () => ({
  __esModule: true,
  default: () => ({
    getRequestHandler: () => (_req: ExpressRequest, res: ExpressResponse) => {
      res.sendJSON({ isFrontend: true });
    },
    prepare: () => Promise.resolve(),
  }),
}));

jest.mock('../authentication/login', () => ({
  __esModule: true,
  login: async () => ({
    user: fakeUser,
  }),
}));

export const activity = {
  id: 18,
  type: 4,
  phase: 2,
  status: 0,
  data: {
    game1: { video: 'https://vimeo.com/36273186', gameId: 1, origine: 'b', signification: 'a', fakeSignification1: 'c', fakeSignification2: 'd' },
    game2: {
      video: 'https://vimeo.com/134108914',
      gameId: 2,
      origine: 'origin',
      signification: 'bubble',
      fakeSignification1: 'test',
      fakeSignification2: 'test',
    },
    game3: {
      video: 'https://vimeo.com/221414987',
      gameId: 3,
      origine: 'origin',
      signification: 'real',
      fakeSignification1: 'fake 1',
      fakeSignification2: 'fake 2',
    },
    draftUrl: '/creer-un-jeu/mimique/3',
    presentation: 'La classe de CE 2 à Paris',
  },
  content: [{ id: 0, type: 'text', value: '' }],
  userId: 6,
  villageId: 1,
  createDate: Date,
  updateDate: Date,
  deleteDate: null,
  subType: 0,
  responseActivityId: null,
  responseType: null,
  isPinned: 0,
  displayUser: 0,
  games: [],
  images: [],
  user: User,
  village: Village,
  responseActivity: Activity,
};

export const mimique = {
  id: 1,
  type: 0,
  content: { fakeSignification1: 'c', fakeSignification2: 'd', origine: 'b', signification: 'a', video: 'https://vimeo.com/36273186' },
  userId: 6,
  villageId: 1,
  activityId: 18,
  value: '',
};

describe('game', () => {
  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [path.join(__dirname, '../entities/*.js')],
      synchronize: true,
      logging: false,
    });
  });
  afterAll(() => {
    const conn = getConnection();
    return conn.close();
  });

  describe('get games', () => {
    const auth = { token: '' };
    beforeAll(async () => {
      return loginUser(auth);
    });

    describe('given game does not exist', () => {
      it('should return 404', async () => {
        const gameId = 'game-123';
        try {
          const app = await getApp();
          await supertest(app).get(`/api/games/${gameId}`).expect(404);
        } catch (e) {
          expect(400);
        }
      });
    });

    describe('given game does exist', () => {
      it('should return 200 status and the game', async () => {
        const game = mimique;
        try {
          const app = await getApp();
          const { body, statusCode } = await supertest(app)
            .get(`/api/games/${game.id}`)
            .set({ Authorization: 'bearer ' + auth.token, 'Content-Type': 'application/json' });
          expect(statusCode).toBe(200);
          expect(body.id).toEqual(game.id);
        } catch (e) {
          expect(400);
        }
      });
    });
  });
});
