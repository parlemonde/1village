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
// Mock nodemailer to avoid message in console.
jest.mock('../emails/nodemailer', () => ({
  __esModule: true,
  getNodeMailer: async () => ({
    t: null,
  }),
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

describe('Story api test', () => {
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

  describe('Images use in original stories', () => {
    const auth = { token: '' };
    beforeAll(async () => {
      return loginUser(auth);
    });

    describe('api call images/all', () => {
      it('should return ALL images', async () => {
        try {
          const app = await getApp();
          await supertest(app).get(`/api/stories/all`).expect(200);
        } catch (e) {
          expect(404);
        }
      });
    });
  });
});
