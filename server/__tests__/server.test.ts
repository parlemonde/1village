import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import path from 'path';
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';

import { getApp } from '../app';
import { fakeUser } from './mock';

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

describe('test entry point', () => {
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
  describe('server and login', () => {
    describe('server is OK', () => {
      it('should return 200', async () => {
        try {
          const app = await getApp();

          await supertest(app).get('/api').expect(200);
        } catch (e) {
          expect(400);
        }
      });
    });

    describe('Login is', () => {
      it('should return 200', async () => {
        try {
          const app = await getApp();
          const response = await supertest(app).post('/login').set('Accept', 'application/json');
          expect(response.status).toBe(200);
        } catch (e) {
          expect(400);
        }
      });
    });
  });
});
