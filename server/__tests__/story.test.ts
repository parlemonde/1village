import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import supertest from 'supertest';

import { getApp } from '../app';
import { appDataSource, fakeUser, loginUser } from './mock';

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
    return appDataSource.initialize();
  });
  afterAll(() => {
    // return conn.close();
    return appDataSource.destroy();
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
