import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import supertest from 'supertest';

import { getApp } from '../app';
import { Activity } from '../entities/activity';
import { User } from '../entities/user';
import { Village } from '../entities/village';
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

describe('Notification api test', () => {
  beforeAll(() => {
    return appDataSource.initialize();
  });
  afterAll(() => {
    // return conn.close();
    return appDataSource.destroy();
  });
  describe('Has subscribed to notifications', () => {
    const auth = { token: '' };
    beforeAll(async () => {
      return loginUser(auth);
    });

    describe('api call notifications/suscribe/:userId', () => {
      it('should return notifications à jour', async () => {
        const id = '1';
        const app = await getApp();
        const response = await supertest(app).get(`/api/notifications/suscribe/${id}`).expect(200);
        expect(response.body).toEqual({ message: 'Notifications à jour' });
      });
    });
  });
});
