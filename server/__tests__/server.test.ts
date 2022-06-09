import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import request from 'supertest';

import { getApp } from '../app';

import { connectToDatabase } from './mock';

// Mock database to create a in-memory db for testing.
jest.mock('../utils/database', () => ({
  // __esModule: true,
  connectToDatabase: async () => await connectToDatabase(),
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

const fakeUser = {
  id: 1,
  email: 'teacher1@mail.io',
  pseudo: 'teacher1',
  level: 'CM1',
  school: 'École polyvalente publique Tandou',
  city: 'Paris',
  postalCode: '75019',
  address: '16 Rue Tandou, 75019 Paris',
  avatar: null,
  displayName: null,
  accountRegistration: 0,
  passwordHash: '$argon2i$v=19$m=4096,t=3,p=1$pR8B4dcw4skHCh8MjvMxBg$o4nkDI5WaV0xrOVJiR2qoNlU2WVonOsrGAb9IYScWyg',
  firstLogin: 3,
  type: 0,
  villageId: 1,
  country: { isoCode: 'FR', name: 'France' },
  position: { lat: 48.8863442, lng: 2.380321 },
};

jest.mock('../authentication/login', () => ({
  __esModule: true,
  login: async () => ({
    user: fakeUser,
  }),
}));
//Info : https://medium.com/welldone-software/jest-how-to-mock-a-function-call-inside-a-module-21c05c57a39f

describe('test entry point', () => {
  describe('server and login', () => {
    describe('server is OK', () => {
      it('should return 200', async () => {
        try {
          const app = await getApp();

          await request(app).get('/api').expect(200);
        } catch (e) {
          expect(400);
        }
      });
    });

    describe('Login', () => {
      it('should return 200', async () => {
        try {
          const app = await getApp();
          const response = await request(app).post('/login').set('Accept', 'application/json');
          expect(response.status).toBe(200);
        } catch (e) {
          expect(400);
        }
      });
    });
  });
});
